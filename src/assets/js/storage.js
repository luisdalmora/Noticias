import { CONFIG } from './config.js';

export const Storage = {
  getPreferences() {
    const prefs = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.PREFERENCES);
    return prefs ? JSON.parse(prefs) : {
      compactMode: false,
      consoleMode: true,
      favoriteCategory: 'Nintendo',
      newsPerPage: 20
    };
  },

  savePreferences(prefs) {
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  getTheme() {
    return localStorage.getItem(CONFIG.LOCAL_STORAGE_KEYS.THEME) || 'dark';
  },

  saveTheme(theme) {
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEYS.THEME, theme);
  }
};
