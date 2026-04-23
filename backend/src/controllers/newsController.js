import { storage } from '../services/storageService.js';
import { logger } from '../utils/logger.js';

export const getLatestNews = (req, res) => {
  try {
    const data = storage.getLatestData();
    res.json(data);
  } catch (error) {
    logger.error('Error fetching latest news in controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
