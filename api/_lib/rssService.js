// ============================================================
// RSS SERVICE — Fetch paralelo com garantia de imagem
// ============================================================
import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import { extractRssImage, extractInlineImage, fetchOgImage, getCategoryFallback } from './imageService.js';

const parser = new Parser({
  timeout: 8000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0; +https://github.com)' },
  customFields: {
    item: [
      'media:content',
      'media:thumbnail',
      ['media:content', 'media:content', { keepArray: true }],
      'enclosure',
      'image',
      'content:encoded'
    ]
  }
});

const MAX_CONCURRENT = 5;       // Máximo de feeds simultâneos
const NEWS_WINDOW_MS = 48 * 60 * 60 * 1000; // 48 horas

// ---- Controle de concorrência ----
async function fetchInBatches(sources) {
  const results = [];
  for (let i = 0; i < sources.length; i += MAX_CONCURRENT) {
    const batch = sources.slice(i, i + MAX_CONCURRENT);
    const settled = await Promise.allSettled(batch.map(fetchOneFeed));
    results.push(...settled);
  }
  return results;
}

// ---- Busca um único feed ----
async function fetchOneFeed(source) {
  if (!source.fallbackRss) return [];
  try {
    const feed = await parser.parseURL(source.fallbackRss);
    const cutoff = new Date(Date.now() - NEWS_WINDOW_MS);

    const items = feed.items.filter(item => {
      const d = new Date(item.pubDate || item.isoDate || 0);
      return d >= cutoff;
    });

    return items.map(item => ({
      _raw: item,
      id: uuidv4(),
      title: (item.title || '').trim(),
      link: item.link || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: source.name,
      category: source.category,
      summary: item.contentSnippet || item.description || '',
      content: item['content:encoded'] || item.content || '',
      thumbnail: null // Será preenchido pela cascata
    }));
  } catch (err) {
    console.warn(`[RSS] Error fetching ${source.name}: ${err.message}`);
    return [];
  }
}

// ---- Cascata de imagem com og:image async ----
async function resolveImage(item) {
  // Camada 1: RSS nativo
  const rssImg = extractRssImage(item._raw);
  if (rssImg) return rssImg;

  // Camada 2: og:image (fetch leve)
  if (item.link) {
    const ogImg = await fetchOgImage(item.link);
    if (ogImg) return ogImg;
  }

  // Camada 3: <img> inline no content
  const inlineImg = extractInlineImage(item._raw);
  if (inlineImg) return inlineImg;

  // Camada 4: Fallback Unsplash por categoria (NUNCA retorna null)
  return getCategoryFallback(item.category);
}

// ---- Processo em batch com limite de concorrência ----
async function resolveImagesInBatches(items) {
  const resolved = [];
  for (let i = 0; i < items.length; i += MAX_CONCURRENT) {
    const batch = items.slice(i, i + MAX_CONCURRENT);
    const results = await Promise.allSettled(
      batch.map(async item => {
        const thumbnail = await resolveImage(item);
        return { ...item, thumbnail, _raw: undefined };
      })
    );
    for (const r of results) {
      if (r.status === 'fulfilled') resolved.push(r.value);
    }
  }
  return resolved;
}

// ---- Entry point principal ----
export async function fetchAndFilterFeeds(sources) {
  // 1. Busca todos os feeds em lotes
  const settled = await fetchInBatches(sources);

  const rawItems = [];
  for (const r of settled) {
    if (r.status === 'fulfilled' && Array.isArray(r.value)) {
      rawItems.push(...r.value);
    }
  }

  if (rawItems.length === 0) return [];

  // 2. Resolve imagens (cascata) — 100% garantido
  const withImages = await resolveImagesInBatches(rawItems);

  // 3. Ordena por data
  return withImages.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
}
