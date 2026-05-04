import { SOURCES } from './_lib/sources.js';
import { RssService } from './_lib/rss-service.js';
import { AiService } from './_lib/ai-service.js';
import { CacheService } from './_lib/cache-service.js';
import { BACKEND_CONFIG } from './_lib/config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Auth Check
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${BACKEND_CONFIG.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    let allNewItems = [];

    // Fetch from all sources
    for (const source of SOURCES) {
      const items = await RssService.fetchFeed(source);
      allNewItems = [...allNewItems, ...items];
    }

    // Sort by date (newest first)
    allNewItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Limit processing to prevent timeouts (e.g., first 10 items)
    const itemsToProcess = allNewItems.slice(0, 10);
    const processedItems = [];

    for (const item of itemsToProcess) {
      const enhanced = await AiService.processNews(item);
      processedItems.push(enhanced);
    }

    // Save to cache
    const count = await CacheService.appendNews(processedItems);

    res.status(200).json({ 
      message: 'Update successful', 
      processed: itemsToProcess.length,
      added: count 
    });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
}
