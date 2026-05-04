const Filters = {
  apply(news, criteria) {
    return news.filter(item => {
      const matchesSearch = !criteria.q || 
        item.title.toLowerCase().includes(criteria.q.toLowerCase()) ||
        item.summary.toLowerCase().includes(criteria.q.toLowerCase());

      const matchesCategory = !criteria.category || item.category === criteria.category;
      const matchesType = !criteria.type || item.type === criteria.type;
      const matchesImpact = !criteria.impact || item.impact === criteria.impact;

      return matchesSearch && matchesCategory && matchesType && matchesImpact;
    });
  }
};
