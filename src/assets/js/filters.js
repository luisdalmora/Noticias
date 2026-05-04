export const Filters = {
  apply(news, criteria) {
    return news.filter(item => {
      const matchesSearch = !criteria.q || 
        item.title.toLowerCase().includes(criteria.q.toLowerCase()) ||
        item.summary.toLowerCase().includes(criteria.q.toLowerCase());

      const matchesCategory = !criteria.category || item.category === criteria.category;
      const matchesType = !criteria.type || item.type === criteria.type;
      const matchesImpact = !criteria.impact || item.impact === criteria.impact;
      const matchesSource = !criteria.source || item.source === criteria.source;

      return matchesSearch && matchesCategory && matchesType && matchesImpact && matchesSource;
    });
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
