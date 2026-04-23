import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

export const fetchLatestNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
