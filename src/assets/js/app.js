import { Api } from './api.js';
import { UI } from './ui.js';
import { NewsRenderer } from './news-renderer.js';
import { Storage } from './storage.js';
import { Filters } from './filters.js';

class App {
  constructor() {
    this.currentPage = this.getFileName();
    this.newsData = [];
    this.prefs = Storage.getPreferences();
  }

  getFileName() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    return file;
  }

  async init() {
    console.log(`🎮 Noticias Premium: Initializing ${this.currentPage}`);
    
    // Load Shared Components (Sidebar, Topbar, Mobile Nav)
    await this.loadPartials();
    
    UI.init();
    
    // Page Specific Logic
    this.route();
  }

  async loadPartials() {
    // In a real MPA without a framework, we can fetch the partials and inject them
    // or use a build-time plugin. For simplicity here, we'll use fetch.
    const partials = ['sidebar', 'topbar', 'mobile-nav'];
    for (const name of partials) {
      const el = document.getElementById(name);
      if (el) {
        try {
          const response = await fetch(`/src/partials/${name}.html`);
          if (response.ok) {
            el.innerHTML = await response.text();
            this.setActiveNavItem(el);
          }
        } catch (e) {
          console.error(`Failed to load partial: ${name}`, e);
        }
      }
    }
  }

  setActiveNavItem(container) {
    const links = container.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === `/${this.currentPage}` || href === this.currentPage)) {
        link.classList.add('active-nav-item');
        // Add console-accent glow/border
        link.classList.add('border-l-4', 'border-console-accent', 'bg-white/5');
      }
    });
  }

  async route() {
    switch (this.currentPage) {
      case 'index.html':
      case '':
        await this.initDashboard();
        break;
      case 'nintendo.html':
        await this.initCategoryPage('Nintendo');
        break;
      case 'samsung.html':
        await this.initCategoryPage('Samsung');
        break;
      case 'rumores.html':
        await this.initRumoresPage();
        break;
      case 'noticia.html':
        await this.initSingleNewsPage();
        break;
      // Add other pages as needed
    }
  }

  async initDashboard() {
    UI.showLoading('news-container');
    try {
      const data = await Api.getNews({ limit: 12 });
      this.newsData = data;
      
      const stats = Filters.getStats(data);
      NewsRenderer.renderStats(stats);
      
      if (data.length === 0) {
        UI.showEmptyState('news-container');
      } else {
        NewsRenderer.renderGrid(data, 'news-container');
      }
    } catch (error) {
      UI.showErrorState('news-container', error);
    }
  }

  async initCategoryPage(category) {
    UI.showLoading('news-container');
    try {
      const data = await Api.getNews({ category, limit: 20 });
      if (data.length === 0) {
        UI.showEmptyState('news-container', `Nenhuma notícia de ${category} encontrada.`);
      } else {
        NewsRenderer.renderGrid(data, 'news-container');
      }
    } catch (error) {
      UI.showErrorState('news-container', error);
    }
  }

  async initRumoresPage() {
    UI.showLoading('news-container');
    try {
      const data = await Api.getNews({ type: 'Rumor', limit: 20 });
      if (data.length === 0) {
        UI.showEmptyState('news-container', 'Nenhum rumor encontrado no momento.');
      } else {
        NewsRenderer.renderGrid(data, 'news-container');
      }
    } catch (error) {
      UI.showErrorState('news-container', error);
    }
  }

  async initSingleNewsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
      window.location.href = '/index.html';
      return;
    }

    // Logic to render single news...
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
