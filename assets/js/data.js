const Data = {
  async fetchNews() {
    try {
      const response = await fetch('data/noticias.json');
      if (!response.ok) throw new Error('Falha ao carregar notícias');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      // Retorna array vazio ou dados mockados se falhar (ex: CORS no file://)
      return [];
    }
  },

  async fetchSources() {
    try {
      const response = await fetch('data/fontes.json');
      if (!response.ok) throw new Error('Falha ao carregar fontes');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar fontes:', error);
      return [];
    }
  }
};
