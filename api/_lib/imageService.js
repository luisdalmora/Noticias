// ============================================================
// IMAGE SERVICE — Cascata 4 camadas, garantia total de imagem
// ============================================================
import * as cheerio from 'cheerio';

const FETCH_TIMEOUT = 4000; // 4s para og:image scraping

// ---- Camada 1: Extração dos campos RSS nativos ----
export function extractRssImage(item) {
  // media:content
  if (item['media:content']) {
    const mc = item['media:content'];
    const url = mc?.['$']?.url || (Array.isArray(mc) && mc[0]?.['$']?.url);
    if (url && isValidImageUrl(url)) return url;
  }
  // media:thumbnail
  if (item['media:thumbnail']) {
    const mt = item['media:thumbnail'];
    const url = mt?.['$']?.url || (Array.isArray(mt) && mt[0]?.['$']?.url);
    if (url && isValidImageUrl(url)) return url;
  }
  // enclosure
  if (item.enclosure?.url && /\.(jpe?g|png|gif|webp)/i.test(item.enclosure.url)) {
    return item.enclosure.url;
  }
  // image tag do item
  if (item.image?.url) return item.image.url;

  return null;
}

// ---- Camada 2: og:image via fetch leve ----
export async function fetchOgImage(url) {
  if (!url) return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        'Accept': 'text/html'
      }
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const ogImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content');
    if (ogImage && isValidImageUrl(ogImage)) return ogImage;
    return null;
  } catch {
    return null;
  }
}

// ---- Camada 3: Primeira <img> do content:encoded ----
export function extractInlineImage(item) {
  const html = item['content:encoded'] || item.content || item.contentSnippet || '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1] && isValidImageUrl(match[1])) return match[1];
  return null;
}

// ---- Camada 4: Fallback determinístico por categoria ----
const FALLBACK_QUERIES = {
  Nintendo:    'nintendo+gaming+console',
  Samsung:     'samsung+galaxy+smartphone',
  MobileGames: 'mobile+gaming+app'
};

// Unsplash Source API — gratuita, sem chave, sem CORS
export function getCategoryFallback(category) {
  const query = FALLBACK_QUERIES[category] || 'gaming+technology';
  return `https://source.unsplash.com/800x450/?${query}&sig=${Math.floor(Math.random() * 9999)}`;
}

// ---- Orquestrador: tenta todas as camadas em ordem ----
export async function ensureImage(item, category) {
  // 1. RSS nativo
  const rssImg = extractRssImage(item);
  if (rssImg) return rssImg;

  // 2. og:image
  const ogImg = await fetchOgImage(item.link);
  if (ogImg) return ogImg;

  // 3. Inline <img>
  const inlineImg = extractInlineImage(item);
  if (inlineImg) return inlineImg;

  // 4. Fallback Unsplash
  return getCategoryFallback(category);
}

// ---- Utilitário ----
function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (!url.startsWith('http')) return false;
  if (url.includes('pixel.') || url.includes('tracking.') || url.includes('1x1')) return false;
  return true;
}
