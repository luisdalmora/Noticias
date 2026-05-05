import { g as getNewsFromCache } from './workflow-service_D2HR1-Ji.mjs';

const GET = async ({ url }) => {
  const startTime = Date.now();
  try {
    const category = url.searchParams.get('category');
    const type = url.searchParams.get('type');
    
    const news = await getNewsFromCache();
    
    if (!news) {
      return new Response(JSON.stringify({
        success: true,
        source: "empty-cache",
        updatedAt: null,
        count: 0,
        items: [],
        message: "Cache ainda não gerado ou expirado. Execute /api/update para reconstruir."
      }), { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    let filteredNews = news;
    if (category && category !== 'all') {
      filteredNews = filteredNews.filter(n => n.category === category);
    }
    if (type) {
      filteredNews = filteredNews.filter(n => n.type === type);
    }

    const duration = Date.now() - startTime;

    return new Response(JSON.stringify({
      success: true,
      source: "cache",
      updatedAt: new Date().toISOString(), // This is the response time, CacheService could provide more meta
      durationMs: duration,
      count: filteredNews.length,
      items: filteredNews
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: "Erro interno ao carregar notícias.",
      details: error.message
    }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
