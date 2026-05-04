import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'media'], ['enclosure', 'enclosure']],
  }
});

export const RssService = {
  async fetchFeed(source) {
    try {
      const feed = await parser.parseURL(source.url);
      return feed.items.map(item => ({
        id: item.guid || item.link,
        title: item.title,
        link: item.link,
        summary: item.contentSnippet || item.content || '',
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        source: source.name,
        sourceUrl: source.url,
        sourceReliability: source.reliability,
        category: source.category,
        thumbnail: this.extractImage(item)
      }));
    } catch (error) {
      console.error(`Error fetching feed ${source.name}:`, error);
      return [];
    }
  },

  extractImage(item) {
    if (item.media && item.media.$ && item.media.$.url) return item.media.$.url;
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    
    // Fallback: try to find img tag in content
    const imgMatch = (item.content || '').match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  }
};
