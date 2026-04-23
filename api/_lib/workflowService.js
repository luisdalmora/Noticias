import { sources } from './sources.js';
import { fetchAndFilterFeeds } from './rssService.js';
import { filterAndRankNews } from './filterService.js';
import { enhanceTopNewsWithAI } from './aiService.js';
import { setCache } from './cache.js';
import { sendDiscordNotification } from './discordService.js';

export async function runWorkflow() {
  console.log(`[${new Date().toISOString()}] Starting Serverless Workflow...`);
  
  try {
    // 1. RSS Fetch
    const rawNews = await fetchAndFilterFeeds(sources);
    if (rawNews.length === 0) return [];

    // 2. Filter & Rank
    const rankedNews = filterAndRankNews(rawNews);
    
    // 3. AI Enhancement (limited to top items for speed)
    const processedData = await enhanceTopNewsWithAI(rankedNews);
    
    // 4. Update In-Memory Cache
    setCache(processedData);

    // 5. Notification (Async but we wait in serverless to ensure execution)
    await sendDiscordNotification(processedData);

    return processedData;
  } catch (error) {
    console.error('Workflow Error:', error);
    throw error;
  }
}
