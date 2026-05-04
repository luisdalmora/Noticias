import { Utils } from './utils.js';

export const NewsRenderer = {
  renderGrid(news, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!news || news.length === 0) {
      return; // Handled by UI.showEmptyState
    }

    container.innerHTML = `
      <div class="news-grid">
        ${news.map((item, index) => this.renderCard(item, index)).join('')}
      </div>
    `;
  },

  renderCard(news, index) {
    const isFeatured = index === 0;
    const impactClass = this.getImpactClass(news.impact);
    const typeClass = this.getTypeClass(news.type);
    const timeAgo = Utils.formatRelativeDate(news.pubDate);

    return `
      <div class="console-card ${isFeatured ? 'featured' : ''} slide-up-item stagger-${(index % 4) + 1}" 
           onclick="window.location.href='/pages/noticia.html?id=${news.id}'">
        
        ${news.thumbnail ? `
          <div class="relative h-48 mb-4 overflow-hidden rounded-console-inner">
            <img src="${news.thumbnail}" alt="${news.title}" class="w-full h-full object-cover">
            <div class="absolute top-3 left-3 flex gap-2">
              <span class="badge ${impactClass}">${news.impact}</span>
              <span class="badge ${typeClass}">${news.type}</span>
            </div>
          </div>
        ` : ''}

        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center text-[10px] text-console-secondary font-bold uppercase tracking-widest">
            <span>${news.source}</span>
            <span>${timeAgo}</span>
          </div>
          
          <h3 class="text-lg lg:text-xl font-bold leading-tight group-hover:text-console-accent transition-colors">
            ${news.title}
          </h3>
          
          <p class="text-sm text-console-secondary line-clamp-2">
            ${news.summary}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <div class="flex gap-1">
              ${news.tags ? news.tags.slice(0, 2).map(tag => `
                <span class="text-[10px] bg-white/5 px-2 py-1 rounded-md text-white/50">#${tag}</span>
              `).join('') : ''}
            </div>
            ${news.isFakeSuspected ? '<span class="text-xs text-red-500 font-bold">⚠️ Suspeita de Fake</span>' : ''}
          </div>
        </div>
      </div>
    `;
  },

  renderStats(stats) {
    const container = document.getElementById('stats-container');
    if (!container) return;

    container.innerHTML = `
      <div class="stats-grid">
        <div class="glass-panel p-4 flex flex-col items-center justify-center text-center">
          <span class="text-2xl font-black text-console-accent">${stats.total}</span>
          <span class="text-[10px] uppercase font-bold text-console-secondary">Total Notícias</span>
        </div>
        <div class="glass-panel p-4 flex flex-col items-center justify-center text-center">
          <span class="text-2xl font-black text-console-cyan">${stats.nintendo}</span>
          <span class="text-[10px] uppercase font-bold text-console-secondary">Nintendo</span>
        </div>
        <div class="glass-panel p-4 flex flex-col items-center justify-center text-center">
          <span class="text-2xl font-black text-console-blue">${stats.samsung}</span>
          <span class="text-[10px] uppercase font-bold text-console-secondary">Samsung</span>
        </div>
        <div class="glass-panel p-4 flex flex-col items-center justify-center text-center">
          <span class="text-2xl font-black text-console-yellow">${stats.rumores}</span>
          <span class="text-[10px] uppercase font-bold text-console-secondary">Rumores</span>
        </div>
      </div>
    `;
  },

  getImpactClass(impact) {
    switch (impact) {
      case 'Alta': return 'badge-high';
      case 'Média': return 'badge-medium';
      case 'Baixa': return 'badge-low';
      default: return 'bg-neutral-700';
    }
  },

  getTypeClass(type) {
    switch (type) {
      case 'Oficial': return 'badge-official';
      case 'Rumor': return 'badge-rumor';
      default: return 'bg-neutral-800';
    }
  }
};
