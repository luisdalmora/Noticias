import { F as FIXED_SOURCES, G as GOOGLE_NEWS_QUERIES, g as getGoogleNewsUrl } from './sources_CaozJTAi.mjs';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent', { keepArray: true }], ['enclosure', 'enclosure']],
  }
});

async function fetchRssFeed(source, timeoutMs = 5000) {
  const startTime = Date.now();
  try {
    console.log(`📡 [RSS] Iniciando: ${source.name}`);
    
    // Promise with timeout
    const fetchPromise = parser.parseURL(source.rssUrl);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout excedido')), timeoutMs)
    );

    const feed = await Promise.race([fetchPromise, timeoutPromise]);
    const duration = Date.now() - startTime;
    
    console.log(`✅ [RSS] Concluído: ${source.name} (${feed.items.length} itens) em ${duration}ms`);

    return feed.items.map(item => ({
      ...item,
      sourceId: source.id,
      sourceName: source.name,
      sourceReliability: source.reliability,
      sourceCategory: source.category
    }));
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [RSS] Erro em ${source.name} (${duration}ms):`, error.message);
    throw error; // Re-throw to be handled by allSettled
  }
}

const FALLBACK_IMAGES = {
  Nintendo: "/images/fallback/nintendo-news.webp",
  Samsung: "/images/fallback/samsung-news.webp",
  Android: "/images/fallback/android-news.webp",
  Gaming: "/images/fallback/gaming-news.webp",
  Tech: "/images/fallback/tech-news.webp",
  Default: "/images/fallback/gaming-news.webp",
};

function isValidImageUrl(url) {
  if (!url || typeof url !== "string") return false;

  const normalized = url.trim();

  if (!normalized) return false;
  if (normalized.startsWith("data:")) return false;
  if (normalized.includes("1x1")) return false;
  if (normalized.includes("pixel")) return false;
  if (normalized.includes("favicon")) return false;
  if (normalized.endsWith(".svg")) return false;

  try {
    const parsed = new URL(normalized);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function absolutizeUrl(imageUrl, baseUrl) {
  if (!imageUrl) return null;

  try {
    return new URL(imageUrl, baseUrl).toString();
  } catch {
    return imageUrl;
  }
}

function pickFromMediaObject(value) {
  if (!value) return null;

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    const firstValid = value.find((entry) => entry?.url || entry?.$?.url);
    return firstValid?.url || firstValid?.$?.url || null;
  }

  return value.url || value.$?.url || null;
}

function extractImageFromHtmlString(html, baseUrl) {
  if (!html || typeof html !== "string") return null;

  const $ = cheerio.load(html);

  const candidates = [
    $("img").first().attr("src"),
    $("img").first().attr("data-src"),
    $("img").first().attr("data-lazy-src"),
    $("img").first().attr("data-original"),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const absoluteUrl = absolutizeUrl(candidate, baseUrl);
    if (isValidImageUrl(absoluteUrl)) {
      return absoluteUrl;
    }
  }

  return null;
}

async function fetchArticleImage(articleUrl, timeoutMs = 8000) {
  if (!articleUrl || articleUrl === "#") return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(articleUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NoticiasBot/1.0; +https://github.com/luisdalmora/Noticias)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    const metaCandidates = [
      $('meta[property="og:image"]').attr("content"),
      $('meta[property="og:image:secure_url"]').attr("content"),
      $('meta[name="twitter:image"]').attr("content"),
      $('meta[name="twitter:image:src"]').attr("content"),
      $('link[rel="image_src"]').attr("href"),
    ].filter(Boolean);

    for (const candidate of metaCandidates) {
      const absoluteUrl = absolutizeUrl(candidate, articleUrl);
      if (isValidImageUrl(absoluteUrl)) {
        return {
          url: absoluteUrl,
          source: candidate.includes("twitter") ? "twitter" : "og",
        };
      }
    }

    const articleCandidates = [
      $("article img").first().attr("src"),
      $("main img").first().attr("src"),
      $(".post img").first().attr("src"),
      $(".entry-content img").first().attr("src"),
      $("img").first().attr("src"),
    ].filter(Boolean);

    for (const candidate of articleCandidates) {
      const absoluteUrl = absolutizeUrl(candidate, articleUrl);
      if (isValidImageUrl(absoluteUrl)) {
        return {
          url: absoluteUrl,
          source: "article",
        };
      }
    }

    return null;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

async function resolveNewsImage(item, source, category = "Gaming") {
  const baseUrl = item.link || source?.url || source?.rssUrl || "";

  const rssCandidates = [
    item.enclosure?.url,
    pickFromMediaObject(item["media:content"]),
    pickFromMediaObject(item["media:thumbnail"]),
    pickFromMediaObject(item.mediaContent),
    pickFromMediaObject(item.mediaThumbnail),
    item.image?.url,
    typeof item.image === "string" ? item.image : null,
    item.itunes?.image,
  ].filter(Boolean);

  for (const candidate of rssCandidates) {
    const absoluteUrl = absolutizeUrl(candidate, baseUrl);
    if (isValidImageUrl(absoluteUrl)) {
      return {
        thumbnail: absoluteUrl,
        imageSource: "rss",
      };
    }
  }

  const htmlImage =
    extractImageFromHtmlString(item.content, baseUrl) ||
    extractImageFromHtmlString(item.description, baseUrl) ||
    extractImageFromHtmlString(item.contentSnippet, baseUrl);

  if (isValidImageUrl(htmlImage)) {
    return {
      thumbnail: htmlImage,
      imageSource: "media",
    };
  }

  const articleImage = await fetchArticleImage(item.link);

  if (articleImage?.url && isValidImageUrl(articleImage.url)) {
    return {
      thumbnail: articleImage.url,
      imageSource: articleImage.source,
    };
  }

  const fallback = FALLBACK_IMAGES[category] || FALLBACK_IMAGES.Default;

  return {
    thumbnail: fallback,
    imageSource: "fallback",
  };
}

async function normalizeNewsItem(item, source = {}) {
  const category = source.category || item.sourceCategory || "Gaming";

  // Use the new robust image resolution service
  const image = await resolveNewsImage(item, source, category);

  // If even with fallback it fails (highly unlikely with the new service), we discard
  if (!image?.thumbnail) {
    return null;
  }

  const title = cleanText(item.title || 'Sem título');
  const summary = cleanText(item.contentSnippet || item.content || item.description || "");
  const link = normalizeLink(item.link || item.guid);

  return {
    id: generateNewsId(title, link, source.name || item.sourceName),
    title,
    summary: summary.substring(0, 300).trim(),
    link,
    originalLink: item.link,
    googleNewsLink: item.link?.includes('news.google.com') ? item.link : null,
    source: source.name || item.sourceName || 'Fonte Desconhecida',
    sourceUrl: source.url || item.sourceUrl,
    sourceReliability: source.reliability || item.sourceReliability || 'Média',
    category,
    type: classifyType(title),
    impact: classifyImpact(title, summary),
    pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    thumbnail: image.thumbnail,
    imageSource: image.imageSource,
    imageStatus: image.imageSource === 'fallback' ? 'fallback' : (image.imageSource === 'rss' ? 'rss' : 'og'),
    tags: extractTags(title, summary),
    classificationReason: item.classificationReason || "Classificação automática por palavras-chave",
    aiEnhanced: false,
    isCurrent: true,
  };
}

function generateNewsId(title, link, sourceName) {
  const seed = `${title}-${link}-${sourceName}`;
  return crypto.createHash('md5').update(seed).digest('hex').substring(0, 16);
}

function normalizeLink(link) {
  if (!link) return '';
  try {
    const url = new URL(link);
    // Remove query params that are tracking or dynamic
    url.search = '';
    url.hash = '';
    return url.toString().toLowerCase().replace(/\/$/, "");
  } catch (e) {
    return link;
  }
}


function cleanText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function classifyType(title = '') {
  const t = title.toLowerCase();
  if (t.includes('rumor') || t.includes('leak') || t.includes('vazamento')) return 'Rumor';
  if (t.includes('review') || t.includes('análise')) return 'Review';
  if (t.includes('update') || t.includes('atualização') || t.includes('patch')) return 'Atualização';
  if (t.includes('launch') || t.includes('lançamento') || t.includes('chega ao')) return 'Lançamento';
  return 'Oficial';
}

function classifyImpact(title, summary) {
  const t = (title + ' ' + summary).toLowerCase();
  
  if (t.includes('switch 2') || t.includes('direct') || t.includes('unpacked') || t.includes('s25 ultra') || t.includes('one ui 7')) {
    return 'Alta';
  }
  
  if (t.includes('rumor') || t.includes('pokemon') || t.includes('mario') || t.includes('zelda') || t.includes('android 16')) {
    return 'Média';
  }
  
  return 'Baixa';
}

function extractTags(title, summary) {
  const text = (title + ' ' + summary).toLowerCase();
  const possibleTags = ['Switch', 'Pokemon', 'Samsung', 'Android', 'GTA', 'One UI', 'Direct', 'S25 Ultra', 'ZTO', 'Brasil'];
  return possibleTags.filter(tag => text.includes(tag.toLowerCase()));
}

async function enhanceWithGemini(newsItems) {
  if (process.env.GEMINI_ENABLED !== 'true' || !process.env.GEMINI_API_KEY) {
    return newsItems;
  }

  const itemsToProcess = newsItems.slice(0, parseInt(process.env.GEMINI_MAX_ITEMS_PER_RUN || '5'));
  
  try {
    const prompt = `Melhore o resumo, tags e classificação das seguintes notícias gamer/tech.
    Retorne APENAS um array JSON com objetos contendo: id, summary (pt-BR, conciso), tags (array), impact (Alta/Média/Baixa), classificationReason.
    
    Notícias:
    ${JSON.stringify(itemsToProcess.map(i => ({ id: i.id, title: i.title, summary: i.summary })))}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const enhancements = JSON.parse(data.candidates[0].content.parts[0].text);
      
      return newsItems.map(item => {
        const enhancement = enhancements.find(e => e.id === item.id);
        if (enhancement) {
          return {
            ...item,
            summary: enhancement.summary || item.summary,
            tags: Array.from(new Set([...item.tags, ...(enhancement.tags || [])])),
            impact: enhancement.impact || item.impact,
            classificationReason: enhancement.classificationReason || item.classificationReason,
            aiEnhanced: true
          };
        }
        return item;
      });
    }
  } catch (e) {
    console.error('❌ Gemini Error:', e.message);
  }

  return newsItems;
}

const CACHE_DIR = path.join(process.cwd(), 'temp_data');
const LOCAL_CACHE_FILE = path.join(CACHE_DIR, 'news_cache.json');

// Ensure cache directory exists for local dev
if (!fs.existsSync(CACHE_DIR)) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (e) {
    console.error('Erro ao criar diretório de cache local:', e.message);
  }
}

const CacheService = {
  async get(key) {
    // 1. Try Vercel KV if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });
        const data = await response.json();
        if (data.result) {
          const item = JSON.parse(data.result);
          if (Date.now() < item.expiry) return item.value;
        }
      } catch (e) {
        console.error('Erro ao ler do Vercel KV:', e.message);
      }
    }

    // 2. Fallback to Local File
    try {
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        const content = fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8');
        const cache = JSON.parse(content);
        const item = cache[key];
        if (item && Date.now() < item.expiry) return item.value;
      }
    } catch (e) {
      console.error('Erro ao ler cache local:', e.message);
    }

    return null;
  },

  async set(key, value, ttlSeconds) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    const item = { value, expiry };

    // 1. Try Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
          body: JSON.stringify(JSON.stringify(item)) // KV set expects string value
        });
        // Also set EXPIRE in KV
        await fetch(`${process.env.KV_REST_API_URL}/expire/${key}/${ttlSeconds}`, {
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });
      } catch (e) {
        console.error('Erro ao gravar no Vercel KV:', e.message);
      }
    }

    // 2. Fallback to Local File
    try {
      let cache = {};
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        cache = JSON.parse(fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8'));
      }
      cache[key] = item;
      fs.writeFileSync(LOCAL_CACHE_FILE, JSON.stringify(cache, null, 2));
    } catch (e) {
      console.error('Erro ao gravar cache local:', e.message);
    }
  },

  async clear() {
    // Clear KV if possible (simplified: we don't have a flushall here, but we can delete the main keys)
    // For local, just delete the file
    try {
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        fs.unlinkSync(LOCAL_CACHE_FILE);
      }
    } catch (e) {
      console.error('Erro ao limpar cache local:', e.message);
    }
  },

  async getMeta() {
    try {
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        const stats = fs.statSync(LOCAL_CACHE_FILE);
        const content = fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8');
        const cache = JSON.parse(content);
        return {
          updatedAt: stats.mtime.toISOString(),
          size: stats.size,
          keys: Object.keys(cache)
        };
      }
    } catch (e) {}
    return { updatedAt: null, size: 0, keys: [] };
  }
};

const CACHE_KEY = 'news_feed_all';

/**
 * FAST READ: Only from cache.
 */
async function getNewsFromCache() {
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
async function performUpdate() {
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
async function getLatestNews(options = {}) {
  const cached = await getNewsFromCache();
  if (cached) return cached;
  
  // If no cache, we DON'T trigger update here anymore to follow the strict rule
  return [];
}

export { getLatestNews as a, getNewsFromCache as g, performUpdate as p };
