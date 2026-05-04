import { CONFIG } from './config.js';

export const Api = {
  async getNews(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${CONFIG.ENDPOINTS.NEWS}${query ? '?' + query : ''}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  async triggerUpdate(token) {
    try {
      const response = await fetch(CONFIG.ENDPOINTS.UPDATE, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error triggering update:', error);
      throw error;
    }
  }
};
