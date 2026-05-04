import { CacheService } from './_lib/cache-service.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { category, type, impact, source, q, limit = 20 } = req.query;
    let news = await CacheService.getNews();

    // Filters
    if (category) news = news.filter(n => n.category === category);
    if (type) news = news.filter(n => n.type === type);
    if (impact) news = news.filter(n => n.impact === impact);
    if (source) news = news.filter(n => n.source === source);
    if (q) {
      const search = q.toLowerCase();
      news = news.filter(n => 
        n.title.toLowerCase().includes(search) || 
        n.summary.toLowerCase().includes(search)
      );
    }

    // Limit
    const results = news.slice(0, parseInt(limit));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
