import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhanceTopNewsWithAI(rankedNews) {
  // Pegamos apenas as top 3 notícias classificadas como "Alta" para não estourar limite da API
  const topNews = rankedNews.filter(n => n.impact === 'Alta').slice(0, 3);
  
  if (topNews.length === 0) {
    console.log('Nenhuma notícia de Alta prioridade para a IA enriquecer. Pulando IA.');
    return rankedNews;
  }

  console.log(`IA Híbrida: Melhorando os ${topNews.length} principais destaques com Gemini...`);

  try {
    const textPayload = topNews.map((n, i) => `[ID: ${n.id}] Titulo: ${n.title}\nTexto Original: ${n.summary}`).join('\n\n');
    
    const prompt = `Você é um jornalista tech. Leia os textos abaixo e reescreva o resumo de cada um de forma altamente profissional, cativante e curta (máximo 2 frases). Mantenha o ID intacto.
Responda APENAS em JSON estrito neste formato:
[
  { "id": "id-aqui", "aiSummary": "resumo perfeito aqui" }
]

Textos:
${textPayload}`;

    const response = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const content = response.text.trim();
    const jsonStr = content.replace(/```json/g, '').replace(/```/g, '');
    const aiResults = JSON.parse(jsonStr);

    // Merge os resultados da IA de volta no array principal
    // 1. Enriquecer destaques
    const finalNews = rankedNews.map(news => {
      const enhanced = aiResults.find(r => r.id === news.id);
      if (enhanced) {
        return {
          ...news,
          summary: enhanced.aiSummary,
          aiEnhanced: true
        };
      }
      return news;
    });

    // 2. Traduzir TODOS os títulos para Português em um único lote (Batch)
    console.log(`IA Híbrida: Traduzindo ${finalNews.length} títulos para Português...`);
    
    // Chunk array to avoid passing too much in a single prompt if needed, but 100-200 is fine for flash.
    const titlesPayload = finalNews.map(n => `[ID: ${n.id}] ${n.title}`).join('\n');
    const translatePrompt = `Traduza os títulos abaixo para Português do Brasil (PT-BR). Mantenha o tom jornalístico e o formato exato com o ID.
Retorne APENAS um JSON estrito neste formato:
[ { "id": "id-aqui", "t": "titulo traduzido" } ]

Textos:
${titlesPayload}`;

    const transResponse = await genai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: translatePrompt,
    });
    
    const transStr = transResponse.text.trim().replace(/```json/g, '').replace(/```/g, '');
    const transResults = JSON.parse(transStr);
    
    const translatedNews = finalNews.map(news => {
      const translation = transResults.find(r => r.id === news.id);
      if (translation && translation.t) {
        return { ...news, title: translation.t };
      }
      return news;
    });

    console.log('IA Híbrida: Resumos premium e traduções aplicados com sucesso.');
    return translatedNews;

  } catch (error) {
    console.error('Erro na IA Híbrida (Fallback ativado, mantendo textos originais):', error.message);
    // Em caso de falha da IA (erro 503, 429), o sistema continua normalmente com os textos originais
    return rankedNews;
  }
}
