const Data = {
  status: 'initial', // initial, online, offline, error
  
  async fetchNews() {
    if (CONFIG.USE_ONLINE_MODE && CONFIG.ONLINE_NEWS_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
        
        const response = await fetch(CONFIG.ONLINE_NEWS_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            this.status = 'online';
            return this.normalizeNews(data);
          }
        }
        throw new Error('Endpoint online inválido ou vazio');
      } catch (error) {
        console.warn('Erro ao carregar notícias online, tentando fallback local...', error);
      }
    }

    // Fallback to local
    if (CONFIG.FALLBACK_LOCAL_JSON) {
      try {
        const response = await fetch(CONFIG.LOCAL_NEWS_URL);
        if (response.ok) {
          const data = await response.json();
          this.status = 'offline';
          return this.normalizeNews(data);
        }
      } catch (error) {
        console.error('Erro crítico ao carregar notícias locais:', error);
        this.status = 'error';
      }
    }

    this.status = 'error';
    return [];
  },

  async fetchSources() {
    try {
      const response = await fetch(CONFIG.LOCAL_SOURCES_URL);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Erro ao carregar fontes:', error);
    }
    return [];
  },

  normalizeNews(newsArray) {
    return newsArray.map(item => ({
      id: item.id || `news-${Math.random().toString(36).substr(2, 9)}`,
      title: this.sanitize(item.title) || 'Notícia sem título',
      summary: this.sanitize(item.summary) || 'Resumo não disponível',
      link: item.link || '#',
      source: item.source || 'Fonte não informada',
      category: item.category || 'Geral',
      type: item.type || 'Notícia',
      impact: item.impact || 'Baixa',
      pubDate: item.pubDate || new Date().toISOString(),
      thumbnail: item.thumbnail || null,
      tags: Array.isArray(item.tags) ? item.tags : [],
      confidence: item.confidence || 'Média'
    }));
  },

  sanitize(text) {
    if (!text) return '';
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML;
  },

  getSystemStatus() {
    return this.status;
  }
};
