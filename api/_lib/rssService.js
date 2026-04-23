import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from './config.js';

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['media:group', 'media:content']
  }
});

export async function discoverRss(url) {
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);
    let rssUrl = null;
    
    $('link[type="application/rss+xml"], link[type="application/atom+xml"]').each((i, link) => {
      if (!rssUrl) {
        rssUrl = $(link).attr('href');
      }
    });

    if (rssUrl) {
      if (!rssUrl.startsWith('http')) {
        const baseUrl = new URL(url);
        rssUrl = new URL(rssUrl, baseUrl.origin).toString();
      }
      return rssUrl;
    }
  } catch (error) {
    console.error(`Error discovering RSS for ${url}:`, error.message);
  }
  return null;
}

export async function fetchAndFilterFeeds(sources) {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const now = new Date().getTime();
  const allNews = [];

  for (const source of sources) {
    let feedUrl = source.fallbackRss;

    if (config.rss_auto_discovery) {
      const discovered = await discoverRss(source.url);
      if (discovered) {
        feedUrl = discovered;
      }
    }

    if (!feedUrl) continue;

    try {
      const feed = await parser.parseURL(feedUrl);
      
      feed.items.forEach(item => {
        const pubDate = new Date(item.pubDate).getTime();
        if (now - pubDate <= ONE_DAY) {
          allNews.push({
            title: item.title,
            link: item.link,
            content: item['content:encoded'] || item.content || item.summary || item.contentSnippet,
            pubDate: item.pubDate,
            source: source.name,
            category: source.category,
            'media:content': item['media:content'],
            enclosure: item.enclosure,
            'content:encoded': item['content:encoded']
          });
        }
      });
    } catch (error) {
      console.error(`Error parsing feed ${feedUrl}:`, error.message);
    }
  }

  return allNews;
}
