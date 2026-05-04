const App = {
  news: [],
  sources: [],
  prefs: {},

  async init() {
    this.prefs = Storage.getPrefs();
    this.applyTheme();
    
    await this.injectSidebar();
    this.setupPage();
    this.setupEventListeners();
    
    await this.loadData();
  },

  async loadData() {
    this.showLoading();
    this.news = await Data.fetchNews();
    this.sources = await Data.fetchSources();
    
    Render.statusIndicator(Data.getSystemStatus());
    this.renderCurrentPage();
  },

  async refreshData() {
    console.log('🔄 Atualizando sistema...');
    const btn = document.getElementById('btn-refresh');
    if (btn) btn.classList.add('animate-spin');
    
    await this.loadData();
    
    if (btn) btn.classList.remove('animate-spin');
  },

  async injectSidebar() {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    try {
      // Usamos fetch para pegar o conteúdo do index.html e extrair a sidebar
      const response = await fetch('index.html');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const sidebarContent = doc.querySelector('.sidebar').innerHTML;
      placeholder.innerHTML = sidebarContent;
    } catch (e) {
      console.warn('Sidebar injection failed, falling back to static links.');
    }
  },

  setupPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    // Marcar link ativo
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === page) {
        link.classList.add('active');
      }
    });

    // Adicionar versão
    const versionEl = document.getElementById('app-version');
    if (versionEl) versionEl.textContent = CONFIG.APP_VERSION;
  },

  setupEventListeners() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshData());
    }

    // Filtros do Histórico
    const historyForm = document.getElementById('history-filters');
    if (historyForm) {
      historyForm.addEventListener('change', () => this.handleHistoryFilters());
      historyForm.addEventListener('submit', (e) => e.preventDefault());
    }
  },

  renderCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    if (page === 'index.html' || page === '') {
      Render.stats(this.news);
      Render.newsGrid(this.news.slice(0, 12), 'news-container');
    } else if (page === 'nintendo.html') {
      const filtered = Filters.apply(this.news, { category: 'Nintendo' });
      Render.newsGrid(filtered, 'news-container');
    } else if (page === 'samsung.html') {
      const filtered = Filters.apply(this.news, { category: 'Samsung' });
      Render.newsGrid(filtered, 'news-container');
    } else if (page === 'rumores.html') {
      const filtered = Filters.apply(this.news, { type: 'Rumor' });
      Render.newsGrid(filtered, 'news-container');
    } else if (page === 'fontes.html') {
      this.initSourcesPage();
    } else if (page === 'noticia.html') {
      this.initNoticiaPage();
    } else if (page === 'historico.html') {
      Render.newsGrid(this.news, 'news-container');
    }
  },

  handleSearch(query) {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    let criteria = { q: query };
    
    if (page === 'nintendo.html') criteria.category = 'Nintendo';
    if (page === 'samsung.html') criteria.category = 'Samsung';
    if (page === 'rumores.html') criteria.type = 'Rumor';

    const filtered = Filters.apply(this.news, criteria);
    Render.newsGrid(filtered, 'news-container');
  },

  handleHistoryFilters() {
    const form = document.getElementById('history-filters');
    const formData = new FormData(form);
    const criteria = Object.fromEntries(formData.entries());
    
    const filtered = Filters.apply(this.news, criteria);
    Render.newsGrid(filtered, 'news-container');
    
    const countEl = document.getElementById('result-count');
    if (countEl) countEl.textContent = `${filtered.length} resultados`;
  },

  initSourcesPage() {
    const container = document.getElementById('sources-container');
    if (!container) return;
    
    if (this.sources.length === 0) {
      container.innerHTML = Render.emptyState('Nenhuma fonte cadastrada.');
      return;
    }

    container.innerHTML = this.sources.map(s => `
      <div class="glass-panel p-6 animate-scale-in">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-2xl border border-white/5">
            ${s.category === 'Nintendo' ? '🎮' : '📱'}
          </div>
          <span class="badge ${s.status === 'Ativo' ? 'bg-green-600' : 'bg-gray-600'} text-white">${s.status || 'Ativo'}</span>
        </div>
        <h3 class="font-black text-lg mb-1 uppercase tracking-tight">${s.name}</h3>
        <p class="text-[10px] text-gray-500 font-bold mb-4">${s.url}</p>
        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span class="px-2 py-1 bg-white/5 rounded">${s.reliability} Confiança</span>
          <span>${s.country}</span>
        </div>
      </div>
    `).join('');
  },

  initNoticiaPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const item = this.news.find(n => n.id === id);
    const container = document.getElementById('noticia-container');

    if (!item || !container) {
      if (container) container.innerHTML = Render.emptyState('Notícia não localizada no banco de dados.');
      return;
    }

    document.title = `${item.title} | Noticias Premium`;
    
    container.innerHTML = `
      <div class="max-w-4xl mx-auto animate-fade-in pb-20">
        <div class="mb-10">
          <div class="flex flex-wrap gap-3 mb-6">
            <span class="badge ${Render.getImpactClass(item.impact)}">${item.impact} IMPACTO</span>
            <span class="badge ${Render.getTypeClass(item.type)}">${item.type}</span>
            <span class="badge bg-white/5 text-gray-400 border border-white/5">${item.category}</span>
          </div>
          <h1 class="text-3xl lg:text-6xl font-black mb-6 leading-tight tracking-tighter">${item.title}</h1>
          <div class="flex items-center gap-6 text-gray-500 text-sm font-bold uppercase tracking-widest">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center text-[10px]">OS</span>
              <span>${item.source}</span>
            </div>
            <span>•</span>
            <span>${new Date(item.pubDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        ${item.thumbnail ? `
          <div class="relative rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl border border-white/5">
            <img src="${item.thumbnail}" class="w-full h-auto" alt="">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
        ` : ''}

        <div class="prose prose-invert max-w-none">
          <p class="text-xl lg:text-2xl text-white font-bold leading-relaxed mb-8 border-l-4 border-red-500 pl-6 py-2">
            ${item.summary}
          </p>
          <div class="text-gray-400 text-lg leading-loose space-y-6">
            <p>Este é um portal estático de demonstração. Em uma implementação de produção, o conteúdo completo da notícia seria recuperado do endpoint original ou extraído via serviço de scraping.</p>
            <p>O objetivo desta interface é demonstrar a fluidez e a estética de um sistema operacional de console de nova geração (estilo Switch 2), priorizando a leitura rápida e o impacto visual.</p>
          </div>
        </div>

        <div class="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center">
          <a href="${item.link}" target="_blank" class="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-black py-5 px-12 rounded-2xl transition-all shadow-xl shadow-red-500/20 active:scale-95 text-center uppercase tracking-widest">
            Ler Matéria Original ➔
          </a>
          <button onclick="window.history.back()" class="text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors text-sm">
            [ B ] Voltar ao Dashboard
          </button>
        </div>
      </div>
    `;
  },

  showLoading() {
    const containers = ['news-container', 'stats-container', 'sources-container', 'noticia-container'];
    containers.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = Render.skeletonGrid();
    });
  },

  applyTheme() {
    const isDark = this.prefs.theme !== 'light';
    document.documentElement.classList.toggle('dark', isDark);
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
