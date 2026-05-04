// ============================================================
// WORKFLOW SERVICE — Pipeline 100% Sem IA
// ============================================================
import { ALL_SOURCES, NINTENDO_SOURCES, SAMSUNG_SOURCES, MOBILE_GAMES_SOURCES } from './sources.js';
import { fetchAndFilterFeeds } from './rssService.js';
import { filterAndRankAll } from './filterService.js';
import { setCache, getCache } from './cache.js';
import { sendDiscordNotification } from './discordService.js';

// ---- Pipeline completo ----
export async function runWorkflow() {
  console.log(`[${new Date().toISOString()}] Starting workflow (No-AI mode)...`);

  // 1. Fetch de todos os feeds em paralelo (por grupo)
  const [nintendoRaw, samsungRaw, gamesRaw] = await Promise.allSettled([
    fetchAndFilterFeeds(NINTENDO_SOURCES),
    fetchAndFilterFeeds(SAMSUNG_SOURCES),
    fetchAndFilterFeeds(MOBILE_GAMES_SOURCES)
  ]);

  const nintendo = nintendoRaw.status === 'fulfilled' ? nintendoRaw.value : [];
  const samsung  = samsungRaw.status  === 'fulfilled' ? samsungRaw.value  : [];
  const games    = gamesRaw.status    === 'fulfilled' ? gamesRaw.value    : [];

  console.log(`[Workflow] Raw: Nintendo=${nintendo.length} Samsung=${samsung.length} Games=${games.length}`);

  // 2. Classificação determinística
  const allRaw = [...nintendo, ...samsung, ...games];
  const processed = filterAndRankAll(allRaw);

  // 3. Split por categoria
  const nintendoNews = processed.filter(n => n.category === 'Nintendo');
  const samsungNews  = processed.filter(n => n.category === 'Samsung');
  const gamesNews    = processed.filter(n => n.category === 'MobileGames');

  console.log(`[Workflow] Processed: Nintendo=${nintendoNews.length} Samsung=${samsungNews.length} Games=${gamesNews.length}`);

  // 4. Salva caches por categoria
  setCache('nintendo', nintendoNews);
  setCache('samsung',  samsungNews);
  setCache('games',    gamesNews);
  setCache('all',      processed);

  // 5. Notificação Discord (não bloqueante)
  sendDiscordNotification(processed.slice(0, 5)).catch(() => {});

  return { nintendo: nintendoNews, samsung: samsungNews, games: gamesNews, all: processed };
}

// ---- Helper: retorna cache ou executa workflow ----
export async function getOrRefresh(cacheKey = 'all') {
  const cached = getCache(cacheKey);
  if (cached.isValid && cached.data.length > 0) {
    console.log(`[Cache] HIT — ${cacheKey} (${cached.age}s ago, ${cached.data.length} items)`);
    return cached.data;
  }
  console.log(`[Cache] MISS — ${cacheKey}, running workflow...`);
  const result = await runWorkflow();
  return result[cacheKey] || result.all;
}
