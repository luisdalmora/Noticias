import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent', { keepArray: true }], ['enclosure', 'enclosure']],
  }
});

export async function fetchRssFeed(source) {
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
