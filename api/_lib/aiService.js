import { GoogleGenAI } from '@google/genai';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhanceTopNewsWithAI(rankedNews) {
  if (rankedNews.length === 0) return rankedNews;

  // Process top 10 instead of 15 to stay within Vercel execution limits
  const batchNews = rankedNews.slice(0, 10);

  try {
    const textPayload = batchNews.map(n => `[ID: ${n.id}] Categoria: ${n.category}\nTitulo Original: ${n.title}\nTexto: ${n.summary}`).join('\n\n---\n\n');
    
    const prompt = `Você é o Curador e Auditor-Chefe Senior de Tecnologia. Sua tarefa é processar as notícias em lote seguindo regras inquebráveis:

REGRAS:
1. FAKE NEWS: Marque "isFake" como true para dados tecnicamente irreais.
2. ISOLAMENTO: Nintendo = Consolas. Samsung = Mobile. Marque "platform_violation": true se houver mistura.
3. TRADUÇÃO OBRIGATÓRIA: O campo "title_pt" DEVE conter o título 100% traduzido para Português do Brasil (PT-BR).
4. RESUMO: Um resumo premium em até 2 frases, em PT-BR, no campo "summary".
5. IMAGEM IA: Escreva um prompt visual EM INGLÊS detalhado no campo "image_prompt".

Responda APENAS com um array JSON válido e estrito:
[ { "id": "...", "title_pt": "...", "summary": "...", "image_prompt": "...", "isFake": false, "platform_violation": false } ]

Textos Originais:
${textPayload}`;

    const model = genai.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use stable 2.0 or 1.5 flash
    const result = await model.generateContent(prompt);
    const content = result.response.text();
    
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '');
    const aiResults = JSON.parse(jsonStr);

    const finalNews = [];
    
    for (const news of rankedNews) {
      const enhanced = aiResults.find(r => r.id === news.id);
      if (enhanced) {
        if (enhanced.isFake || enhanced.platform_violation) continue;
        
        let finalThumbnail = news.thumbnail;
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
        finalNews.push(news);
      }
    }

    return finalNews;

  } catch (error) {
    console.error('AI Service Error:', error.message);
    return rankedNews;
  }
}
