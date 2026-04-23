import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 60000 // Aumentado para 60s para suportar cold starts e processamento IA no Vercel
});

export const fetchLatestNews = async (retries = 2) => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Erro de conexão, tentando novamente em 2s... (${retries} tentativas restantes)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchLatestNews(retries - 1);
    }
    console.error('Erro ao buscar notícias:', error);
    return [];
  }
};

export const forceProcessNews = async () => {
  try {
    // Rota alterada para o novo padrão Serverless
    const response = await api.post('/update');
    return response.data;
  } catch (error) {
    console.error('Erro ao forçar atualização:', error);
    throw error;
  }
};
