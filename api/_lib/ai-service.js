import { GoogleGenerativeAI } from '@google/generative-ai';
import { BACKEND_CONFIG } from './config.js';

const genAI = new GoogleGenerativeAI(BACKEND_CONFIG.GEMINI_API_KEY || '');

export const AiService = {
  async processNews(newsItem) {
    if (!BACKEND_CONFIG.GEMINI_API_KEY) {
      // Fallback if no API key
      return {
        ...newsItem,
        type: newsItem.title.toLowerCase().includes('rumor') ? 'Rumor' : 'Oficial',
        impact: 'Média',
        aiEnhanced: false
      };
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `
        Analise esta notícia e retorne um JSON com:
        - type: "Oficial", "Rumor", "Review", "Lançamento", "Atualização" ou "Análise"
        - impact: "Alta", "Média" ou "Baixa"
        - tags: array de strings
        - confidenceScore: número de 0 a 1
        - classificationReason: breve explicação

        Título: ${newsItem.title}
        Resumo: ${newsItem.summary}
        Categoria Sugerida: ${newsItem.category}

        Retorne APENAS o JSON.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const aiData = JSON.parse(text.replace(/```json|```/g, ''));
      
      return {
        ...newsItem,
        ...aiData,
        aiEnhanced: true
      };
    } catch (error) {
      console.error('AI Processing Error:', error);
      return { ...newsItem, aiEnhanced: false };
    }
  }
};
