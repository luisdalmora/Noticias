import { F as FIXED_SOURCES, G as GOOGLE_NEWS_QUERIES, g as getGoogleNewsUrl } from './sources_CaozJTAi.mjs';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { C as CacheService } from './cache-service_BXA9ljG7.mjs';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent', { keepArray: true }], ['enclosure', 'enclosure']],
  }
});

async function fetchRssFeed(source) {
  try {
    console.log(`📡 Fetching: ${source.name} (${source.rssUrl})`);
    const feed = await parser.parseURL(source.rssUrl);
    
    return feed.items.map(item => ({
      ...item,
      sourceId: source.id,
      sourceName: source.name,
      sourceReliability: source.reliability,
      sourceCategory: source.category
    }));
  } catch (error) {
    console.error(`❌ Error fetching ${source.name}:`, error.message);
    return [];
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

  return {
    id: generateNewsId(item.link || item.title),
    title,
    summary: summary.substring(0, 300).trim(),
    link: item.link,
    source: source.name || item.sourceName || 'Fonte Desconhecida',
    sourceUrl: source.url || item.sourceUrl,
    sourceReliability: source.reliability || item.sourceReliability || 'Média',
    category,
    type: classifyType(title),
    impact: classifyImpact(title, summary),
    pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    thumbnail: image.thumbnail,
    imageSource: image.imageSource,
    tags: extractTags(title, summary),
    classificationReason: item.classificationReason || "Classificação automática por palavras-chave",
    aiEnhanced: false,
    isCurrent: true,
  };
}

function generateNewsId(input) {
  if (!input) return Math.random().toString(36).substring(7);
  return Buffer.from(input).toString('base64').substring(0, 16).replace(/[/+=]/g, '');
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

async function getLatestNews(options = {}) {
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

export { getLatestNews as g };
