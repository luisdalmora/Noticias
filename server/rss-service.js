import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [['media:content', 'mediaContent', { keepArray: true }], ['enclosure', 'enclosure']],
  }
});

export async function fetchRssFeed(source, timeoutMs = 5000) {
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

