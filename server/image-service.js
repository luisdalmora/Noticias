import * as cheerio from "cheerio";

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

  let finalUrl = articleUrl;
  
  // Resolve Google News redirect if needed
  if (articleUrl.includes('news.google.com')) {
    try {
      const headResponse = await fetch(articleUrl, { 
        method: 'HEAD', 
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      finalUrl = headResponse.url;
    } catch (e) {
      console.warn(`⚠️ Erro ao resolver redirect do Google News: ${e.message}`);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(finalUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
      const absoluteUrl = absolutizeUrl(candidate, finalUrl);
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
      const absoluteUrl = absolutizeUrl(candidate, finalUrl);
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




export async function resolveNewsImage(item, source, category = "Gaming") {
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
