export const CONFIG = {
  API_BASE_URL: '/api',
  ENDPOINTS: {
    NEWS: '/api/news',
    UPDATE: '/api/update',
  },
  CATEGORIES: ['Nintendo', 'Samsung', 'Android', 'Gaming', 'Tech'],
  IMPACT_LEVELS: ['Alta', 'Média', 'Baixa'],
  TYPES: ['Oficial', 'Rumor', 'Review', 'Lançamento', 'Atualização', 'Análise'],
  LOCAL_STORAGE_KEYS: {
    PREFERENCES: 'noticias_prefs',
    THEME: 'noticias_theme',
  },
  REFRESH_INTERVAL: 1000 * 60 * 15, // 15 minutes
};
