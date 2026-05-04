// Basic in-memory cache for demo purposes
// In production, this should use Vercel KV or Redis
let internalStore = [];

export const CacheService = {
  async getNews() {
    return internalStore;
  },

  async setNews(news) {
    internalStore = news;
    return true;
  },

  async appendNews(newItems) {
    const existingLinks = new Set(internalStore.map(item => item.link));
    const uniqueNewItems = newItems.filter(item => !existingLinks.has(item.link));
    
    internalStore = [...uniqueNewItems, ...internalStore].slice(0, 100); // Keep last 100
    return uniqueNewItems.length;
  }
};
