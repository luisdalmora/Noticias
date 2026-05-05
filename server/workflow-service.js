import { FIXED_SOURCES, GOOGLE_NEWS_QUERIES, getGoogleNewsUrl } from './sources.js';
import { fetchRssFeed } from './rss-service.js';
import { normalizeNewsItem } from './normalize-news.js';
import { enhanceWithGemini } from './gemini-service.js';
import { CacheService } from './cache-service.js';

export async function getLatestNews(options = {}) {
  const maxAgeHours = parseInt(process.env.MAX_NEWS_AGE_HOURS || '24');
  const cacheKey = `news_feed_${options.category || 'all'}`;
  
  // 1. Check Cache
  const cached = CacheService.get(cacheKey);
  if (cached) return cached;

  let allRawItems = [];

  // 2. Fetch Fixed Sources
  if (process.env.USE_FIXED_RSS_SOURCES !== 'false') {
    const fixedSources = FIXED_SOURCES.filter(s => s.enabled);
    for (const source of fixedSources) {
       const items = await fetchRssFeed(source);
       // Attach source info to each raw item for normalization
       allRawItems.push(...items.map(item => ({ ...item, _source: source })));
    }
  }

  // 3. Fetch Google News RSS
  if (process.env.USE_GOOGLE_NEWS_RSS !== 'false') {
    const googleQueries = GOOGLE_NEWS_QUERIES.filter(q => q.enabled);
    for (const query of googleQueries) {
      const source = {
        id: query.id,
        name: `Google News: ${query.label}`,
        url: 'https://news.google.com',
        rssUrl: getGoogleNewsUrl(query.query),
        category: query.category,
        reliability: 'Alta'
      };
      const items = await fetchRssFeed(source);
      allRawItems.push(...items.map(item => ({ ...item, _source: source })));
    }
  }

  // 4. Pipeline: Normalize, Filter, Deduplicate
  const now = new Date();
  const processedItems = [];
  const seenLinks = new Set();

  // Sort raw items by date before processing to prioritize newest in deduplication
  allRawItems.sort((a, b) => new Date(b.pubDate || b.isoDate) - new Date(a.pubDate || a.isoDate));

  for (const rawItem of allRawItems) {
    if (!rawItem.link || !rawItem.title) continue;
    
    // Deduplicate by base URL
    const cleanLink = rawItem.link.split('?')[0].replace(/\/$/, "");
    if (seenLinks.has(cleanLink)) continue;
    seenLinks.add(cleanLink);

    // Age Filter
    const pubDate = new Date(rawItem.pubDate || rawItem.isoDate);
    if (isNaN(pubDate.getTime())) continue;
    const ageHours = (now - pubDate) / (1000 * 60 * 60);
    if (ageHours > maxAgeHours) continue;

    // Normalize (handles image resolution internally now)
    const item = await normalizeNewsItem(rawItem, rawItem._source);
    
    if (item) {
      processedItems.push(item);
    }
  }

  // Sort final items by date desc
  processedItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // 5. AI Enhancement (TOP 5)
  let finalItems = processedItems;
  if (process.env.GEMINI_ENABLED === 'true' && processedItems.length > 0) {
    finalItems = await enhanceWithGemini(processedItems);
  }

  // 6. Save to Cache
  CacheService.set(cacheKey, finalItems, parseInt(process.env.CACHE_TTL_SECONDS || '900'));

  return finalItems;
}
