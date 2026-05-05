import { FIXED_SOURCES, GOOGLE_NEWS_QUERIES, getGoogleNewsUrl } from './sources.js';
import { fetchRssFeed } from './rss-service.js';
import { normalizeNewsItem } from './normalize-news.js';
import { enhanceWithGemini } from './gemini-service.js';
import { CacheService } from './cache-service.js';

const CACHE_KEY = 'news_feed_all';

/**
 * FAST READ: Only from cache.
 */
export async function getNewsFromCache() {
  const startTime = Date.now();
  const cached = await CacheService.get(CACHE_KEY);
  const duration = Date.now() - startTime;
  
  if (cached) {
    console.log(`✅ [CACHE] Hit: ${cached.length} itens retornados em ${duration}ms`);
    return cached;
  }
  
  console.log(`⚠️ [CACHE] Miss: Nenhum cache encontrado (${duration}ms)`);
  return null;
}

/**
 * HEAVY UPDATE: Process everything and save to cache.
 */
export async function performUpdate() {
  const overallStart = Date.now();
  console.log('🚀 [UPDATE] Iniciando workflow de atualização técnica...');

  const maxAgeHours = parseInt(process.env.MAX_NEWS_AGE_HOURS || '24');
  let allSources = [];

  // 1. Prepare Sources
  if (process.env.USE_FIXED_RSS_SOURCES !== 'false') {
    allSources.push(...FIXED_SOURCES.filter(s => s.enabled));
  }

  if (process.env.USE_GOOGLE_NEWS_RSS !== 'false') {
    const googleQueries = GOOGLE_NEWS_QUERIES.filter(q => q.enabled);
    allSources.push(...googleQueries.map(query => ({
      id: query.id,
      name: `Google News: ${query.label}`,
      url: 'https://news.google.com',
      rssUrl: getGoogleNewsUrl(query.query),
      category: query.category,
      reliability: 'Alta'
    })));
  }

  console.log(`📊 [UPDATE] Total de fontes a processar: ${allSources.length}`);

  // 2. Parallel Fetching
  const fetchTimeout = 6000; // 6 seconds timeout per source
  const fetchResults = await Promise.allSettled(
    allSources.map(source => fetchRssFeed(source, fetchTimeout))
  );

  let allRawItems = [];
  let successCount = 0;
  let failCount = 0;

  fetchResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const source = allSources[index];
      const items = result.value;
      allRawItems.push(...items.map(item => ({ ...item, _source: source })));
      successCount++;
    } else {
      failCount++;
    }
  });

  console.log(`✅ [UPDATE] Fontes concluídas: ${successCount} sucesso, ${failCount} falha`);

  // 3. Pipeline: Normalize, Filter, Deduplicate
  const now = new Date();
  const processedItems = [];
  const seenIds = new Set();
  const seenLinks = new Set();

  // Sort raw items by date before processing to prioritize newest in deduplication
  allRawItems.sort((a, b) => new Date(b.pubDate || b.isoDate) - new Date(a.pubDate || a.isoDate));

  for (const rawItem of allRawItems) {
    const pubDate = new Date(rawItem.pubDate || rawItem.isoDate);
    if (isNaN(pubDate.getTime())) continue;

    // Age Filter
    const ageHours = (now - pubDate) / (1000 * 60 * 60);
    if (ageHours > maxAgeHours) continue;

    // Normalize (handles image resolution internally)
    const item = await normalizeNewsItem(rawItem, rawItem._source);
    
    if (item) {
      // Deduplicate by ID and Link
      if (seenIds.has(item.id) || seenLinks.has(item.link)) continue;
      seenIds.add(item.id);
      seenLinks.add(item.link);
      processedItems.push(item);
    }
  }

  console.log(`🧹 [UPDATE] Processamento concluído: ${processedItems.length} itens únicos (de ${allRawItems.length} brutos)`);

  // Sort final items by date desc
  processedItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // 4. AI Enhancement (TOP items)
  let finalItems = processedItems;
  if (process.env.GEMINI_ENABLED === 'true' && processedItems.length > 0) {
    try {
      console.log('✨ [AI] Iniciando enriquecimento com Gemini...');
      finalItems = await enhanceWithGemini(processedItems);
      console.log('✨ [AI] Enriquecimento concluído.');
    } catch (e) {
      console.error('❌ [AI] Falha no enriquecimento:', e.message);
      // Continue with non-enhanced items
    }
  }

  // 5. Save to Cache
  const ttl = parseInt(process.env.CACHE_TTL_SECONDS || '3600');
  await CacheService.set(CACHE_KEY, finalItems, ttl);

  const totalDuration = Date.now() - overallStart;
  console.log(`🏁 [UPDATE] Workflow concluído com sucesso em ${totalDuration}ms. Cache atualizado.`);

  return {
    success: true,
    count: finalItems.length,
    durationMs: totalDuration,
    sources: {
      total: allSources.length,
      success: successCount,
      failed: failCount
    },
    updatedAt: new Date().toISOString()
  };
}

// Deprecated: maintain for backward compatibility if needed, but point to new methods
export async function getLatestNews(options = {}) {
  const cached = await getNewsFromCache();
  if (cached) return cached;
  
  // If no cache, we DON'T trigger update here anymore to follow the strict rule
  return [];
}

