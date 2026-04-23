import express from 'express';
import cors from 'cors';
import { storage } from './services/storageService.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Main API route to serve latest news to the Vue dashboard
app.get('/api/news', (req, res) => {
  try {
    const data = storage.getLatestData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export function startServer() {
  app.listen(port, '127.0.0.1', () => {
    console.log(`🚀 API Server running on http://127.0.0.1:${port}`);
  });
}
