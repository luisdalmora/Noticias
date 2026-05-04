const Storage = {
  PREFS_KEY: 'noticias_premium_prefs',

  getPrefs() {
    const data = localStorage.getItem(this.PREFS_KEY);
    return data ? JSON.parse(data) : {
      theme: 'dark',
      compactMode: false,
      favoriteCategory: 'Nintendo'
    };
  },

  savePrefs(prefs) {
    localStorage.setItem(this.PREFS_KEY, JSON.stringify(prefs));
  }
};
