import dotenv from 'dotenv';
dotenv.config();

export const BACKEND_CONFIG = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
  CACHE_TTL: 3600, // 1 hour
  MAX_NEWS_AGE: 24 * 7, // 7 days in hours
};
