import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhanceTopNewsWithAI(rankedNews) {
  if (rankedNews.length === 0) return rankedNews;

  // Processa as top 15 notícias para não abusar do context window ou output token limits num único JSON
  const batchNews = rankedNews.slice(0, 15);

  console.log(`IA Curadora: Processando lote único de ${batchNews.length} notícias para validação, resumo e tradução...`);

  try {
    const textPayload = batchNews.map(n => `[ID: ${n.id}] Categoria: ${n.category}\nTitulo Original: ${n.title}\nTexto: ${n.summary}`).join('\n\n---\n\n');
    
    const prompt = `Você é o Curador e Auditor-Chefe Senior de Tecnologia. Sua tarefa é processar as notícias em lote seguindo regras inquebráveis:

REGRAS:
1. FAKE NEWS: Marque "isFake" como true para dados tecnicamente irreais.
2. ISOLAMENTO: Nintendo = Consolas. Samsung = Mobile. Marque "platform_violation": true se houver mistura.
3. TRADUÇÃO OBRIGATÓRIA: O campo "title_pt" DEVE conter o título 100% traduzido para Português do Brasil (PT-BR). É proibido devolver o título em inglês.
4. RESUMO: Um resumo premium em até 2 frases, em PT-BR, no campo "summary".
5. IMAGEM IA: Escreva um prompt visual EM INGLÊS detalhado (ex: "cinematic shot of...") no campo "image_prompt", que descreva perfeitamente o assunto da notícia para um gerador de imagens IA.

Responda APENAS com um array JSON válido e estrito:
[ { "id": "...", "title_pt": "Título PT-BR", "summary": "Resumo PT-BR", "image_prompt": "English prompt for image...", "isFake": false, "platform_violation": false } ]

Textos Originais:
${textPayload}`;

    let response = null;
    let attempts = 0;
    while (attempts < 3) {
      try {
        response = await genai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        break; // Sucesso, sai do loop
      } catch (err) {
        attempts++;
        if (err.message.includes('503') || err.message.includes('high demand') || attempts === 3) {
          console.warn(`Tentativa ${attempts} falhou com 503. Aguardando 3s...`);
          await new Promise(r => setTimeout(r, 3000));
          if (attempts === 3) throw err;
        } else {
          throw err;
        }
      }
    }

    const content = response.text.trim();
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '');
    const aiResults = JSON.parse(jsonStr);

    const finalNews = [];
    
    for (const news of rankedNews) {
      const enhanced = aiResults.find(r => r.id === news.id);
      if (enhanced) {
        if (enhanced.isFake || enhanced.platform_violation) {
          console.log(`❌ Rejeitado pela IA: [${news.title}] - Fake: ${enhanced.isFake}, Violation: ${enhanced.platform_violation}`);
          continue; // Filtra a notícia
        }
        
        let finalThumbnail = news.thumbnail;
        // Se a notícia veio sem imagem original, cria a URL usando a inteligência artificial (pollinations.ai)
        if (!finalThumbnail && enhanced.image_prompt) {
          finalThumbnail = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhanced.image_prompt)}?width=800&height=450&nologo=true`;
        }

        finalNews.push({
          ...news,
          title: enhanced.title_pt && enhanced.title_pt.trim() !== '' ? enhanced.title_pt : news.title,
          summary: enhanced.summary || news.summary,
          thumbnail: finalThumbnail,
          aiEnhanced: true
        });
      } else {
        // Se a IA omitiu o ID ou não coube no batch, passa original
        if (batchNews.find(b => b.id === news.id)) {
          // estava no batch mas IA ignorou (fallback)
          finalNews.push(news);
        } else {
          // não estava no batch
          finalNews.push(news);
        }
      }
    }

    console.log(`IA Curadora finalizou: ${finalNews.length} notícias válidas mantidas.`);
    return finalNews;

  } catch (error) {
    console.error('Erro na IA Curadora (Fallback ativado, mantendo dados originais):', error.message);
    return rankedNews;
  }
}
