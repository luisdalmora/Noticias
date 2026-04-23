// In-memory cache for Vercel Serverless
// This will persist as long as the lambda container is "warm"
let cachedNews = [];
let lastUpdated = null;

export const getCache = () => {
  return {
    data: cachedNews,
    lastUpdated: lastUpdated
  };
};

export const setCache = (data) => {
  cachedNews = data;
  lastUpdated = new Date().toISOString();
  return { success: true };
};
