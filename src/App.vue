<template>
  <div class="app-layout">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar-left">
      <div class="brand">
        <div class="brand-logo"><Activity class="text-white" :size="20"/></div>
        <div class="brand-text">
          <h1>NewsHub</h1>
          <span>Gaming & Tech</span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <button class="nav-item" :class="{active: currentFilter === 'All'}" @click="setFilter('All')">
          <LayoutDashboard :size="20" /> Overview
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Nintendo'}" @click="setFilter('Nintendo')">
          <Gamepad2 :size="20" /> Nintendo
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Samsung'}" @click="setFilter('Samsung')">
          <Smartphone :size="20" /> Samsung
        </button>
        <button class="nav-item" :class="{active: typeFilter === 'Rumor'}" @click="setTypeFilter('Rumor')">
          <MessageCircle :size="20" /> Rumores
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Histórico'}" @click="setFilter('Histórico')">
          <Clock :size="20" /> Histórico
        </button>
      </nav>

      <div class="sidebar-bottom">
        <!-- Removido Sistema Premium e User Profile a pedido do usuário -->
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- TOPBAR -->
      <header class="topbar">
        <div class="search-container glass">
          <Search :size="18" class="text-muted" />
          <input type="text" placeholder="Buscar notícias..." v-model="searchQuery" />
          <div class="shortcut">⌘ K</div>
        </div>
        
        <div class="topbar-right">
          <div class="date-widget">
            <Calendar :size="18" class="text-muted" />
            <div class="date-text">
              <span class="date-main">{{ todayFormatted }}</span>
              <span class="date-sub">{{ weekday }}</span>
            </div>
          </div>
          
          <div class="status-widget">
            <span class="status-dot"></span>
            <div class="status-text">
              <span class="status-main">Atualizado</span>
              <span class="status-sub">{{ lastUpdated }}</span>
            </div>
          </div>
          
          <button class="btn-refresh button-primary" @click="forceUpdate" :disabled="isProcessing">
            <RefreshCw :size="16" :class="{'spin': loading || isProcessing}" /> 
            {{ isProcessing ? 'Processando IA...' : 'Atualizar Notícias' }}
          </button>
        </div>
      </header>

      <!-- CONTENT SCROLL AREA -->
      <div class="content-scroll" v-if="!loading">
        <!-- HIGHLIGHTS SECTION -->
        <section class="highlights-section" v-if="highlightNews.length > 0">
          <div class="section-header">
            <h2>🔥 Destaques do Dia</h2>
            <p>As notícias mais importantes das últimas 24h</p>
            <button class="btn-text">Ver todas <ChevronRight :size="16"/></button>
          </div>
          
          <div class="highlights-grid">
            <NewsCard v-for="item in highlightNews" :key="item.id" :news="item" :isHighlight="true" />
          </div>
        </section>

        <!-- ALL NEWS SECTION -->
        <section class="all-news-section">
          <div class="section-header">
            <h2><Newspaper :size="20" class="mr-2"/> Todas as Notícias</h2>
            <button class="btn-dropdown glass">Mais recentes <ChevronDown :size="16"/></button>
          </div>
          
          <div v-if="filteredNews.length === 0" class="empty-state glass">
            <SearchX :size="48" class="text-muted mb-4"/>
            <h3>Nenhum resultado encontrado</h3>
          </div>

          <div v-else class="news-grid">
            <NewsCard v-for="item in filteredNews" :key="item.id" :news="item" />
          </div>
          
          <div class="load-more">
            <button class="btn-text"><ChevronDown :size="16"/> Carregar mais notícias</button>
          </div>
        </section>
      </div>
      
      <!-- LOADING STATE -->
      <div class="loading-full" v-if="loading">
        <Loader2 class="spinner text-gradient" :size="48" />
      </div>
    </main>

    <!-- RIGHT SIDEBAR -->
    <aside class="sidebar-right">
      <!-- ESTATÍSTICAS -->
      <div class="widget-box glass">
        <div class="widget-header">
          <h3><BarChart2 :size="16"/> Estatísticas</h3>
          <span class="text-muted text-sm">Hoje</span>
        </div>
        <div class="stats-grid">
          <div class="stat-card glass">
            <h2>{{ stats.total }}</h2>
            <p>Total de Notícias</p>
            <span class="trend positive">+12% vs ontem</span>
          </div>
          <div class="stat-card glass">
            <h2>{{ stats.high }}</h2>
            <p>Alto Impacto</p>
            <span class="trend positive">+25% vs ontem</span>
          </div>
          <div class="stat-card glass">
            <h2>{{ stats.medium }}</h2>
            <p>Médio Impacto</p>
            <span class="trend positive">+5% vs ontem</span>
          </div>
          <div class="stat-card glass">
            <h2>{{ stats.rumors }}</h2>
            <p>Rumores</p>
            <span class="trend positive">+8% vs ontem</span>
          </div>
        </div>
      </div>

      <!-- FILTROS -->
      <div class="widget-box glass mt-4">
        <div class="widget-header">
          <h3><Filter :size="16"/> Filtros Rápidos</h3>
        </div>
        <div class="filter-list">
          <button class="filter-btn filter-high glass" :class="{active: impactFilter === 'Alta'}" @click="toggleImpact('Alta')">
            <Flame :size="14" class="mr-2"/> Alto Impacto <span class="badge-count">{{stats.high}}</span>
          </button>
          <button class="filter-btn filter-medium glass" :class="{active: impactFilter === 'Média'}" @click="toggleImpact('Média')">
            <Scale :size="14" class="mr-2"/> Médio Impacto <span class="badge-count">{{stats.medium}}</span>
          </button>
          <button class="filter-btn filter-low glass" :class="{active: impactFilter === 'Baixa'}" @click="toggleImpact('Baixa')">
            <Minus :size="14" class="mr-2"/> Baixo Impacto <span class="badge-count">{{stats.low}}</span>
          </button>
        </div>
      </div>

      <!-- TIMELINE -->
      <div class="widget-box glass mt-4 flex-grow">
        <div class="widget-header">
          <h3><Clock :size="16"/> Timeline do Dia</h3>
        </div>
        <div class="timeline">
          <div class="time-item" v-for="(item, index) in timelineNews" :key="'tl-'+index">
            <div class="time-dot"></div>
            <div class="time-content">
              <span class="time-label">{{ getTime(item.pubDate) }}</span>
              <div class="time-text">
                <h4 class="card-title-clamp">{{ item.title }}</h4>
                <p>{{ item.source }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Activity, LayoutDashboard, Gamepad2, Smartphone, MessageCircle, 
  Clock, Rocket, User, MoreVertical, Search, Calendar, RefreshCw,
  ChevronRight, ChevronDown, Newspaper, SearchX, BarChart2, Filter,
  Flame, Scale, Minus, Loader2
} from 'lucide-vue-next';
import NewsCard from './components/NewsCard.vue';
import { fetchLatestNews, forceProcessNews } from './services/api';

const news = ref([]);
const loading = ref(true);
const isProcessing = ref(false);
const searchQuery = ref('');
const impactFilter = ref('');
const currentFilter = ref('All');
const typeFilter = ref('');

const lastUpdated = ref(format(new Date(), 'HH:mm aa'));
const todayFormatted = ref(format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR }));
const weekday = ref(format(new Date(), 'EEEE', { locale: ptBR }));

const fetchData = async () => {
  loading.value = true;
  news.value = await fetchLatestNews();
  lastUpdated.value = format(new Date(), 'HH:mm aa');
  loading.value = false;
};

const forceUpdate = async () => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  loading.value = true;
  try {
    await forceProcessNews();
    await fetchData();
  } catch (error) {
    console.error('Erro ao forçar atualização:', error);
  } finally {
    isProcessing.value = false;
    loading.value = false;
  }
};

onMounted(fetchData);

const setFilter = (category) => {
  currentFilter.value = category;
  typeFilter.value = '';
};

const setTypeFilter = (type) => {
  typeFilter.value = type;
  currentFilter.value = 'All';
};

const toggleImpact = (impact) => {
  if (impactFilter.value === impact) impactFilter.value = '';
  else impactFilter.value = impact;
};

// Computeds
const highlightNews = computed(() => {
  let result = news.value;
  
  if (currentFilter.value !== 'All' && currentFilter.value !== 'Histórico') {
    result = result.filter(n => n.category === currentFilter.value);
  }
  
  if (typeFilter.value) {
    result = result.filter(n => n.type === typeFilter.value);
  }
  
  return result.filter(n => n.impact === 'Alta').slice(0, 5);
});

const filteredNews = computed(() => {
  // Excluir destaques da lista geral (usando title em vez de id para evitar falha com json antigo)
  const highlightTitles = new Set(highlightNews.value.map(n => n.title));
  let result = news.value.filter(n => !highlightTitles.has(n.title));

  if (currentFilter.value !== 'All' && currentFilter.value !== 'Histórico') {
    result = result.filter(n => n.category === currentFilter.value);
  }

  if (typeFilter.value) {
    result = result.filter(n => n.type === typeFilter.value);
  }

  if (impactFilter.value) {
    result = result.filter(n => n.impact === impactFilter.value);
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(n => n.title.toLowerCase().includes(q));
  }

  // Se for Histórico, ordena por data mais antiga primeiro ou mais recente
  if (currentFilter.value === 'Histórico') {
    result.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }

  return result;
});

const timelineNews = computed(() => {
  return news.value.slice(0, 4);
});

const getTime = (dateStr) => {
  if (!dateStr) return '';
  return format(new Date(dateStr), 'HH:mm');
};

const stats = computed(() => {
  return {
    total: news.value.length,
    high: news.value.filter(n => n.impact === 'Alta').length,
    medium: news.value.filter(n => n.impact === 'Média').length,
    low: news.value.filter(n => n.impact === 'Baixa').length,
    rumors: news.value.filter(n => n.type === 'Rumor').length
  };
});
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--bg-main);
}

/* SIDEBAR LEFT */
.sidebar-left {
  width: 260px;
  min-width: 260px;
  background: rgba(11, 11, 15, 0.95);
  border-right: 1px solid var(--border-glass);
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  z-index: 20;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding-left: 8px;
}

.brand-logo {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text h1 {
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1;
}

.brand-text span {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-inter);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-main);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(79, 70, 229, 0.15), rgba(147, 51, 234, 0.15));
  color: var(--primary);
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.sidebar-bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.premium-box {
  padding: 16px;
  border-radius: 12px;
  text-align: left;
}

.premium-box h4 {
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.premium-box p {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info .name {
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pro-badge {
  font-size: 0.6rem;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 800;
}

.user-info .role {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* MAIN CONTENT */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: radial-gradient(circle at top right, rgba(79, 70, 229, 0.05) 0%, transparent 50%);
}

.topbar {
  height: 80px;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid var(--border-glass);
}

.search-container {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 10px;
  width: 380px;
}

.search-container input {
  background: transparent;
  border: none;
  color: white;
  margin-left: 10px;
  flex-grow: 1;
  outline: none;
  font-family: var(--font-inter);
}

.shortcut {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--text-muted);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.date-widget, .status-widget {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-text, .status-text {
  display: flex;
  flex-direction: column;
}

.date-main, .status-main {
  font-size: 0.85rem;
  font-weight: 600;
}

.date-sub, .status-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: capitalize;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--success);
}

.content-scroll {
  flex-grow: 1;
  overflow-y: auto;
  padding: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.section-header p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 4px;
}

.btn-text {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-inter);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.btn-text:hover { color: var(--text-main); }

.btn-dropdown {
  padding: 8px 16px;
  border-radius: 8px;
  color: var(--text-main);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

/* HIGHLIGHTS */
.highlights-section {
  margin-bottom: 40px;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

/* ALL NEWS */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* RIGHT SIDEBAR */
.sidebar-right {
  width: 320px;
  min-width: 320px;
  border-left: 1px solid var(--border-glass);
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: rgba(11, 11, 15, 0.5);
}

.widget-box {
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.widget-header h3 {
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-card {
  padding: 16px;
  border-radius: 12px;
}

.stat-card h2 {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.stat-card p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.trend {
  font-size: 0.7rem;
  font-weight: 600;
}
.trend.positive { color: var(--success); }

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  color: var(--text-main);
  font-family: var(--font-inter);
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-high .badge-count { background: rgba(239, 68, 68, 0.2); color: #ff6b6b; }
.filter-medium .badge-count { background: rgba(234, 179, 8, 0.2); color: #fbbf24; }
.filter-low .badge-count { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }

.badge-count {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* TIMELINE */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  padding-left: 10px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 14px;
  width: 1px;
  background: var(--border-glass);
}

.time-item {
  display: flex;
  gap: 16px;
  position: relative;
}

.time-dot {
  width: 9px;
  height: 9px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--primary);
  margin-top: 4px;
  z-index: 2;
}

.time-content {
  display: flex;
  gap: 16px;
}

.time-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  min-width: 40px;
}

.time-text h4 {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.time-text p {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.loading-full {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.empty-state {
  text-align: center;
  padding: 60px;
  border-radius: 16px;
}
</style>
