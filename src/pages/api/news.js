import { getLatestNews } from '../../../server/workflow-service.js';

export const GET = async ({ url }) => {
  try {
    const category = url.searchParams.get('category');
    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    
    let news = await getLatestNews({ category });
    
    if (category) {
      news = news.filter(n => n.category === category);
    }
    if (type) {
      news = news.filter(n => n.type === type);
    }

    const limitedNews = news.slice(0, limit);

    if (limitedNews.length === 0) {
      return new Response(JSON.stringify({
        status: "empty",
        message: "Nenhuma notícia atual com imagem válida foi encontrada nas últimas 24 horas.",
        updatedAt: new Date().toISOString(),
        news: []
      }), { status: 200 });
    }

    return new Response(JSON.stringify({
      status: "success",
      mode: "online",
      updatedAt: new Date().toISOString(),
      maxAgeHours: parseInt(process.env.MAX_NEWS_AGE_HOURS || '24'),
      total: limitedNews.length,
      gemini: {
        enabled: process.env.GEMINI_ENABLED === 'true',
        processed: Math.min(limitedNews.length, parseInt(process.env.GEMINI_MAX_ITEMS_PER_RUN || '5'))
      },
      cache: {
        enabled: true,
        ttlSeconds: parseInt(process.env.CACHE_TTL_SECONDS || '900')
      },
      news: limitedNews
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: "error",
      message: "Não foi possível carregar notícias atuais no momento.",
      details: error.message,
      news: []
    }), { status: 500 });
  }
};
