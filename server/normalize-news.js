import { resolveNewsImage } from "./image-service.js";
import crypto from 'crypto';

export async function normalizeNewsItem(item, source = {}) {
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
    
    // Google News links REQUIRE their search params to work
    if (url.hostname.includes('news.google.com')) {
      return url.toString().replace(/\/$/, "");
    }

    // For other links, we can be more aggressive in cleaning
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
