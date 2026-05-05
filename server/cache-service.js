import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'temp_data');
const LOCAL_CACHE_FILE = path.join(CACHE_DIR, 'news_cache.json');

// Ensure cache directory exists for local dev
if (!fs.existsSync(CACHE_DIR)) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (e) {
    console.error('Erro ao criar diretório de cache local:', e.message);
  }
}

export const CacheService = {
  async get(key) {
    // 1. Try Vercel KV if configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });
        const data = await response.json();
        if (data.result) {
          const item = JSON.parse(data.result);
          if (Date.now() < item.expiry) return item.value;
        }
      } catch (e) {
        console.error('Erro ao ler do Vercel KV:', e.message);
      }
    }

    // 2. Fallback to Local File
    try {
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        const content = fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8');
        const cache = JSON.parse(content);
        const item = cache[key];
        if (item && Date.now() < item.expiry) return item.value;
      }
    } catch (e) {
      console.error('Erro ao ler cache local:', e.message);
    }

    return null;
  },

  async set(key, value, ttlSeconds) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    const item = { value, expiry };

    // 1. Try Vercel KV
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
          body: JSON.stringify(JSON.stringify(item)) // KV set expects string value
        });
        // Also set EXPIRE in KV
        await fetch(`${process.env.KV_REST_API_URL}/expire/${key}/${ttlSeconds}`, {
          headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });
      } catch (e) {
        console.error('Erro ao gravar no Vercel KV:', e.message);
      }
    }

    // 2. Fallback to Local File
    try {
      let cache = {};
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        cache = JSON.parse(fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8'));
      }
      cache[key] = item;
      fs.writeFileSync(LOCAL_CACHE_FILE, JSON.stringify(cache, null, 2));
    } catch (e) {
      console.error('Erro ao gravar cache local:', e.message);
    }
  },

  async clear() {
    // Clear KV if possible (simplified: we don't have a flushall here, but we can delete the main keys)
    // For local, just delete the file
    try {
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        fs.unlinkSync(LOCAL_CACHE_FILE);
      }
    } catch (e) {
      console.error('Erro ao limpar cache local:', e.message);
    }
  },

  async getMeta() {
    try {
      if (fs.existsSync(LOCAL_CACHE_FILE)) {
        const stats = fs.statSync(LOCAL_CACHE_FILE);
        const content = fs.readFileSync(LOCAL_CACHE_FILE, 'utf-8');
        const cache = JSON.parse(content);
        return {
          updatedAt: stats.mtime.toISOString(),
          size: stats.size,
          keys: Object.keys(cache)
        };
      }
    } catch (e) {}
    return { updatedAt: null, size: 0, keys: [] };
  }
};

