const Render = {
  newsGrid(news, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!news || news.length === 0) {
      container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div class="text-6xl mb-4">🎮</div>
          <h3 class="text-xl font-bold mb-2">Nenhuma notícia encontrada</h3>
          <p class="text-gray-500">Tente ajustar seus filtros ou busca.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        ${news.map((item, index) => this.newsCard(item, index)).join('')}
      </div>
    `;
  },

  newsCard(news, index) {
    const isFeatured = index === 0;
    const timeAgo = Utils.formatRelativeDate(news.pubDate);
    const impactClass = this.getImpactClass(news.impact);
    const typeClass = this.getTypeClass(news.type);

    return `
      <div class="console-card animate-slide-up stagger-${(index % 4) + 1}" 
           onclick="window.location.href='noticia.html?id=${news.id}'">
        
        ${news.thumbnail ? `
          <div class="relative h-48 mb-4 overflow-hidden rounded-xl">
            <img src="${news.thumbnail}" alt="${news.title}" class="w-full h-full object-cover">
            <div class="absolute top-3 left-3 flex gap-2">
              <span class="badge ${impactClass}">${news.impact}</span>
            </div>
          </div>
        ` : ''}

        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span>${news.source}</span>
            <span>${timeAgo}</span>
          </div>
          
          <h3 class="text-lg font-bold leading-tight hover:text-red-500 transition-colors">
            ${news.title}
          </h3>
          
          <p class="text-sm text-gray-400 line-clamp-2">
            ${news.summary}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <span class="badge ${typeClass}">${news.type}</span>
            <div class="flex gap-1">
              ${news.tags ? news.tags.slice(0, 2).map(tag => `
                <span class="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500">#${tag}</span>
              `).join('') : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  getImpactClass(impact) {
    switch (impact) {
      case 'Alta': return 'badge-high';
      case 'Média': return 'badge-medium';
      case 'Baixa': return 'badge-low';
      default: return 'bg-gray-700';
    }
  },

  getTypeClass(type) {
    switch (type) {
      case 'Oficial': return 'badge-official';
      case 'Rumor': return 'badge-rumor';
      default: return 'bg-gray-800';
    }
  },

  stats(news) {
    const container = document.getElementById('stats-container');
    if (!container) return;

    const stats = {
      total: news.length,
      nintendo: news.filter(n => n.category === 'Nintendo').length,
      samsung: news.filter(n => n.category === 'Samsung').length,
      rumores: news.filter(n => n.type === 'Rumor').length
    };

    container.innerHTML = `
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="glass-panel p-4 text-center">
          <p class="text-2xl font-black text-red-500">${stats.total}</p>
          <p class="text-[10px] uppercase font-bold text-gray-500">Total</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-2xl font-black text-cyan-400">${stats.nintendo}</p>
          <p class="text-[10px] uppercase font-bold text-gray-500">Nintendo</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-2xl font-black text-blue-500">${stats.samsung}</p>
          <p class="text-[10px] uppercase font-bold text-gray-500">Samsung</p>
        </div>
        <div class="glass-panel p-4 text-center">
          <p class="text-2xl font-black text-yellow-500">${stats.rumores}</p>
          <p class="text-[10px] uppercase font-bold text-gray-500">Rumores</p>
        </div>
      </div>
    `;
  }
};
