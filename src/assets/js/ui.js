export const UI = {
  elements: {
    mobileMenu: null,
    sidebar: null,
    mainContent: null,
    loadingOverlay: null,
  },

  init() {
    this.elements.mobileMenu = document.getElementById('mobile-menu');
    this.elements.sidebar = document.getElementById('sidebar');
    this.elements.mainContent = document.getElementById('main-content');
    
    this.setupEventListeners();
  },

  setupEventListeners() {
    const menuBtn = document.getElementById('menu-toggle');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }
  },

  toggleMobileMenu() {
    const isVisible = this.elements.sidebar.classList.contains('active');
    if (isVisible) {
      this.elements.sidebar.classList.remove('active');
    } else {
      this.elements.sidebar.classList.add('active');
    }
  },

  showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = this.renderSkeleton();
  },

  renderSkeleton() {
    return `
      <div class="news-grid">
        ${Array(6).fill(0).map(() => `
          <div class="console-card">
            <div class="skeleton h-48 w-full mb-4"></div>
            <div class="skeleton h-6 w-3/4 mb-2"></div>
            <div class="skeleton h-4 w-full mb-4"></div>
            <div class="flex gap-2">
              <div class="skeleton h-4 w-16"></div>
              <div class="skeleton h-4 w-16"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  showEmptyState(containerId, message = 'Nenhuma notícia encontrada.') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 text-center fade-in-content">
        <div class="text-6xl mb-4">🎮</div>
        <h3 class="text-xl font-bold mb-2">Ops! Tudo calmo por aqui.</h3>
        <p class="text-console-secondary">${message}</p>
      </div>
    `;
  },

  showErrorState(containerId, error) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="bg-red-500/10 border border-red-500/50 p-8 rounded-console text-center fade-in-content">
        <div class="text-4xl mb-4">⚠️</div>
        <h3 class="text-xl font-bold mb-2 text-red-500">Erro de Conexão</h3>
        <p class="text-white/70 mb-4">${error.message || 'Não foi possível carregar as notícias.'}</p>
        <button onclick="location.reload()" class="console-button bg-red-500 hover:bg-red-600 mx-auto">
          Tentar Novamente
        </button>
      </div>
    `;
  }
};
