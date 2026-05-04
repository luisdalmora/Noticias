const Filters = {
  apply(news, criteria) {
    let filtered = [...news];

    // Busca textual abrangente
    if (criteria.q) {
      const q = criteria.q.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.impact.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Filtros específicos
    if (criteria.category) filtered = filtered.filter(n => n.category === criteria.category);
    if (criteria.type) filtered = filtered.filter(n => n.type === criteria.type);
    if (criteria.impact) filtered = filtered.filter(n => n.impact === criteria.impact);
    if (criteria.source) filtered = filtered.filter(n => n.source === criteria.source);
    
    // Filtro por Data (Histórico)
    if (criteria.dateStart) {
      const start = new Date(criteria.dateStart).getTime();
      filtered = filtered.filter(n => new Date(n.pubDate).getTime() >= start);
    }
    if (criteria.dateEnd) {
      const end = new Date(criteria.dateEnd).getTime();
      filtered = filtered.filter(n => new Date(n.pubDate).getTime() <= end);
    }

    // Ordenação (Padrão: mais recente primeiro)
    const sortOrder = criteria.order || 'newest';
    filtered.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  },

  getStats(news) {
    return {
      total: news.length,
      nintendo: news.filter(n => n.category === 'Nintendo').length,
      samsung: news.filter(n => n.category === 'Samsung').length,
      rumores: news.filter(n => n.type === 'Rumor').length,
      alta: news.filter(n => n.impact === 'Alta').length
    };
  }
};
