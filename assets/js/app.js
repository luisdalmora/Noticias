const App = {
  news: [],
  sources: [],
  prefs: {},

  async init() {
    console.log('🎮 Noticias Premium: OS Initializing...');
    this.prefs = Storage.getPrefs();
    this.news = await Data.fetchNews();
    this.sources = await Data.fetchSources();

    await this.injectSidebar();
    this.setupPage();
    this.setupEventListeners();
  },

  async injectSidebar() {
    const placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    try {
      const response = await fetch('index.html');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const sidebarContent = doc.querySelector('.sidebar').innerHTML;
      placeholder.innerHTML = sidebarContent;
    } catch (e) {
      console.error('Falha ao injetar sidebar:', e);
    }
  },

  setupPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    // Set active link in sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === page) {
        link.classList.add('active');
      }
    });

    if (page === 'index.html' || page === '') {
      this.initDashboard();
    } else if (page === 'nintendo.html') {
      this.initCategory('Nintendo');
    } else if (page === 'samsung.html') {
      this.initCategory('Samsung');
    } else if (page === 'rumores.html') {
      this.initRumores();
    } else if (page === 'fontes.html') {
      this.initSources();
    } else if (page === 'noticia.html') {
      this.initNoticia();
    }
  },

  setupEventListeners() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        // Toggle mobile menu logic if needed
      });
    }
  },

  initDashboard() {
    Render.stats(this.news);
    Render.newsGrid(this.news.slice(0, 12), 'news-container');
  },

  initCategory(category) {
    const filtered = Filters.apply(this.news, { category });
    Render.newsGrid(filtered, 'news-container');
  },

  initRumores() {
    const filtered = Filters.apply(this.news, { type: 'Rumor' });
    Render.newsGrid(filtered, 'news-container');
  },

  initSources() {
    const container = document.getElementById('sources-container');
    if (!container) return;

    container.innerHTML = this.sources.map(source => `
      <div class="glass-panel p-6 animate-scale-in">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl">
            ${source.category === 'Nintendo' ? '🎮' : '📱'}
          </div>
          <span class="badge badge-official">Ativo</span>
        </div>
        <h3 class="font-bold text-lg mb-1">${source.name}</h3>
        <p class="text-xs text-gray-500 mb-4">${source.url}</p>
        <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span>${source.reliability} Confiança</span>
          <span>${source.country}</span>
        </div>
      </div>
    `).join('');
  },

  initNoticia() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const newsItem = this.news.find(n => n.id === id);
    const container = document.getElementById('noticia-container');

    if (!newsItem || !container) {
      if (container) container.innerHTML = '<p>Notícia não encontrada.</p>';
      return;
    }

    document.title = `${newsItem.title} | Noticias Premium`;

    container.innerHTML = `
      <div class="max-w-4xl mx-auto animate-fade-in">
        <div class="mb-8">
          <div class="flex gap-2 mb-4">
            <span class="badge badge-high">${newsItem.impact}</span>
            <span class="badge badge-official">${newsItem.type}</span>
          </div>
          <h1 class="text-3xl lg:text-5xl font-black mb-4 leading-tight">${newsItem.title}</h1>
          <div class="flex items-center gap-4 text-gray-500 text-sm font-bold">
            <span>${newsItem.source}</span>
            <span>•</span>
            <span>${new Date(newsItem.pubDate).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        ${newsItem.thumbnail ? `
          <img src="${newsItem.thumbnail}" class="w-full h-auto rounded-3xl mb-8 shadow-2xl" alt="">
        ` : ''}

        <div class="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
          <p class="mb-6 font-bold text-white">${newsItem.summary}</p>
          <p>Conteúdo completo da notícia seria carregado aqui. Como este é um sistema estático, exibimos o resumo estendido processado.</p>
        </div>

        <div class="mt-12 pt-8 border-t border-white/5 flex justify-between items-center">
          <a href="${newsItem.link}" target="_blank" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all">
            VER MATÉRIA ORIGINAL
          </a>
          <button onclick="window.history.back()" class="text-gray-500 font-bold hover:text-white">
            VOLTAR
          </button>
        </div>
      </div>
    `;
  },

  handleSearch(query) {
    const filtered = Filters.apply(this.news, { q: query });
    Render.newsGrid(filtered, 'news-container');
  }
};

// Initialize
window.addEventListener('DOMContentLoaded', () => App.init());
