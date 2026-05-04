// ============================================================
// CACHE — Sem IA, sem filas. Cache único por categoria.
// ============================================================

const CACHE_TTL = 1000 * 60 * 10; // 10 minutos

const store = {
  nintendo: { data: [], updatedAt: null },
  samsung:  { data: [], updatedAt: null },
  games:    { data: [], updatedAt: null },
  all:      { data: [], updatedAt: null }
};

function isValid(bucket) {
  return bucket.updatedAt && (Date.now() - bucket.updatedAt) < CACHE_TTL;
}

export function getCache(key = 'all') {
  const bucket = store[key] || store.all;
  return {
    data: bucket.data,
    updatedAt: bucket.updatedAt,
    isValid: isValid(bucket),
    age: bucket.updatedAt ? Math.floor((Date.now() - bucket.updatedAt) / 1000) : null
  };
}

export function setCache(key = 'all', data) {
  if (!store[key]) return;
  store[key].data = data;
  store[key].updatedAt = Date.now();
}

export function clearCache(key) {
  if (key && store[key]) {
    store[key].data = [];
    store[key].updatedAt = null;
  } else {
    Object.keys(store).forEach(k => {
      store[k].data = [];
      store[k].updatedAt = null;
    });
  }
}

export function getCacheStats() {
  const stats = {};
  Object.entries(store).forEach(([key, bucket]) => {
    stats[key] = {
      count: bucket.data.length,
      isValid: isValid(bucket),
      age: bucket.updatedAt ? Math.floor((Date.now() - bucket.updatedAt) / 1000) : null
    };
  });
  return stats;
}
