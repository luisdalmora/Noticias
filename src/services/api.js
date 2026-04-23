import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const fetchLatestNews = async (retries = 3) => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Connection error fetching news, retrying in 1.5s... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1500));
      return fetchLatestNews(retries - 1);
    }
    console.error('Error fetching news:', error);
    return [];
  }
};

export const forceProcessNews = async () => {
  try {
    const response = await api.post('/force-run');
    return response.data;
  } catch (error) {
    console.error('Error forcing news process:', error);
    throw error;
  }
};
