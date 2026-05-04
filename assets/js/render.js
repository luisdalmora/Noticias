const Render = {
  newsGrid(news, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!news || news.length === 0) {
      container.innerHTML = this.emptyState();
      return;
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        ${news.map((item, index) => this.newsCard(item, index)).join('')}
      </div>
    `;
  },

  newsCard(item, index) {
    const isFeatured = index === 0 && !window.location.search; // Destaque apenas se não houver filtro
    const timeAgo = Utils.formatRelativeDate(item.pubDate);
    const impactClass = this.getImpactClass(item.impact);
    const typeClass = this.getTypeClass(item.type);
    const isBrazil = item.tags.some(t => ['ZTO', 'Brasil', 'BR'].includes(t)) || item.title.includes('Brasil');

    return `
      <div class="console-card group animate-slide-up stagger-${(index % 4) + 1}" 
           onclick="window.location.href='noticia.html?id=${item.id}'">
        
        <div class="relative aspect-video mb-4 overflow-hidden rounded-2xl bg-gray-900">
          ${item.thumbnail ? 
            `<img src="${item.thumbnail}" alt="" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">` :
            `<div class="w-full h-full flex items-center justify-center text-4xl opacity-20">${item.category === 'Nintendo' ? '🎮' : '📱'}</div>`
          }
          <div class="absolute top-3 left-3 flex flex-wrap gap-2">
            <span class="badge ${impactClass}">${item.impact}</span>
            ${isBrazil ? `<span class="badge bg-green-600 text-white">Brasil</span>` : ''}
          </div>
          ${item.type === 'Rumor' ? 
            `<div class="absolute bottom-3 right-3 badge badge-rumor backdrop-blur-md bg-black/40">Confiança: ${item.confidence || 'Média'}</div>` : ''
          }
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
            <span>${item.source}</span>
            <span>${timeAgo}</span>
          </div>
          
          <h3 class="text-lg lg:text-xl font-black leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
            ${item.title}
          </h3>
          
          <p class="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            ${item.summary}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <span class="badge ${typeClass}">${item.type}</span>
            <div class="flex gap-1">
              ${item.tags.slice(0, 2).map(tag => `
                <span class="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 font-bold tracking-tighter">#${tag.toUpperCase()}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  statusIndicator(status) {
    const container = document.getElementById('system-status');
    if (!container) return;

    let config = {
      label: 'Offline Mode',
      color: 'bg-gray-700',
      icon: '📡',
      msg: 'Exibindo notícias locais de demonstração'
    };

    if (status === 'online') {
      config = {
        label: 'Online Mode',
        color: 'bg-cyan-500 shadow-cyan-500/20',
        icon: '⚡',
        msg: 'Notícias atualizadas via endpoint'
      };
    } else if (status === 'error') {
      config = {
        label: 'System Error',
        color: 'bg-red-500',
        icon: '⚠️',
        msg: 'Falha na conexão com o servidor'
      };
    }

    container.innerHTML = `
      <div class="flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-black/20 backdrop-blur-md animate-fade-in">
        <div class="w-2 h-2 rounded-full ${config.color} animate-pulse"></div>
        <div class="flex flex-col">
          <span class="text-[10px] font-black uppercase tracking-widest leading-none">${config.label}</span>
          <span class="text-[8px] text-gray-500 font-bold leading-none mt-1">${config.msg}</span>
        </div>
        <span class="ml-2 text-xs">${config.icon}</span>
      </div>
    `;
  },

  emptyState(msg = 'Nenhum item encontrado no sistema.') {
    return `
      <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div class="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-4xl mb-6 grayscale opacity-50">🎮</div>
        <h3 class="text-xl font-black mb-2 uppercase tracking-widest">Ops! Nada por aqui</h3>
        <p class="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">${msg}</p>
        <button onclick="window.location.reload()" class="mt-8 text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
          Recarregar Sistema
        </button>
      </div>
    `;
  },

  skeletonGrid(count = 6) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        ${Array(count).fill(0).map(() => `
          <div class="console-card h-96 skeleton opacity-50"></div>
        `).join('')}
      </div>
    `;
  },

  getImpactClass(impact) {
    switch (impact) {
      case 'Alta': return 'bg-red-500 text-white shadow-lg shadow-red-500/20';
      case 'Média': return 'bg-yellow-500 text-black';
      case 'Baixa': return 'bg-blue-600 text-white';
      default: return 'bg-gray-700 text-white';
    }
  },

  getTypeClass(type) {
    switch (type) {
      case 'Oficial': return 'bg-green-600 text-white';
      case 'Rumor': return 'bg-gray-800 text-gray-400 border border-white/5';
      case 'Review': return 'bg-purple-600 text-white';
      case 'Lançamento': return 'bg-cyan-600 text-white';
      case 'Atualização': return 'bg-orange-600 text-white';
      default: return 'bg-gray-800 text-gray-300';
    }
  }
};
