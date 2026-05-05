import { CacheService } from '../../../server/cache-service.js';

export const POST = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET || 'dev-secret';

  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // Clear all caches
  CacheService.clear();
  
  return new Response(JSON.stringify({
    status: "success",
    message: "Cache do sistema limpo com sucesso. Nova busca RSS será realizada no próximo acesso.",
    timestamp: new Date().toISOString()
  }), { status: 200 });
};
