const memoryCache = new Map();

const CacheService = {
  get(key) {
    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  },

  set(key, value, ttlSeconds) {
    memoryCache.set(key, {
      value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  },

  clear() {
    memoryCache.clear();
  }
};

export { CacheService as C };
