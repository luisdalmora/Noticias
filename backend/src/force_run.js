import { fetchAndFilterFeeds } from './services/rssService.js';
import { filterAndRankNews } from './services/filterService.js';
import { enhanceTopNewsWithAI } from './services/aiService.js';
import { storage } from './services/storageService.js';
import { sources } from './config/sources.js';

async function run() {
  console.log('Forcing workflow run to fetch images and generate IDs...');
  const rawNews = await fetchAndFilterFeeds(sources);
  const rankedNews = filterAndRankNews(rawNews);
  const processedData = await enhanceTopNewsWithAI(rankedNews);
  storage.saveData(processedData);
  console.log('Done! latest.json updated.');
  process.exit(0);
}

run();
