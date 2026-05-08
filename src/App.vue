<template>
  <div class="app-layout">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar-left">
      <div class="brand">
        <div class="brand-logo"><Gamepad2 class="text-white" :size="20"/></div>
        <div class="brand-text">
          <h1>Nintendo Pulse</h1>
          <span>Premium Updates</span>
        </div>
      </div>
      
      <nav class="nav-menu">
        <button class="nav-item" :class="{active: currentFilter === 'All' && !typeFilter}" @click="setFilter('All')">
          <LayoutDashboard :size="20" /> Todos
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Switch 2'}" @click="setFilter('Switch 2')">
          <Gamepad2 :size="20" /> Switch 2
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Switch'}" @click="setFilter('Switch')">
          <Gamepad2 :size="20" /> Switch
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Pokémon'}" @click="setFilter('Pokémon')">
          <Activity :size="20" /> Pokémon
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Mario'}" @click="setFilter('Mario')">
          <Rocket :size="20" /> Mario
        </button>
        <button class="nav-item" :class="{active: currentFilter === 'Zelda'}" @click="setFilter('Zelda')">
          <Flame :size="20" /> Zelda
        </button>
        <button class="nav-item" :class="{active: typeFilter === 'Rumor'}" @click="setTypeFilter('Rumor')">
          <MessageCircle :size="20" /> Rumores
        </button>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <!-- TOPBAR -->
      <header class="topbar">
        <div class="search-container glass">
          <Search :size="18" class="text-muted" />
          <input type="text" placeholder="Buscar no Nintendo Pulse..." v-model="searchQuery" />
          <div class="shortcut">⌘ K</div>
        </div>
        
        <div class="topbar-right">
          <div class="status-widget">
            <span class="status-dot"></span>
            <div class="status-text">
              <span class="status-main">Atualizado</span>
              <span class="status-sub">{{ lastUpdated }}</span>
            </div>
          </div>
          
          <button class="btn-refresh button-primary" @click="forceUpdate" :disabled="isProcessing">
            <RefreshCw :size="16" :class="{'spin': loading || isProcessing}" /> 
            {{ isProcessing ? 'Processando IA...' : 'Atualizar' }}
          </button>
        </div>
      </header>

      <!-- CONTENT SCROLL AREA (Internal Scroll) -->
      <div class="content-scroll" v-if="!loading">
        <div v-if="dashboardNews.length === 0" class="empty-state glass">
          <SearchX :size="48" class="text-muted mb-4"/>
          <h3>Nenhuma notícia encontrada</h3>
        </div>

        <div v-else class="pulse-dashboard">
          <!-- TOP ROW: Hero + Destaques -->
          <div class="top-row" v-if="heroNews">
            <div class="hero-container">
              <NewsCard :news="heroNews" :isHighlight="true" class="hero-card" />
            </div>
            <div class="destaques-container" v-if="destaquesNews.length > 0">
              <NewsCard v-for="item in destaquesNews" :key="item.id" :news="item" :isCompact="true" />
            </div>
          </div>

          <!-- BOTTOM ROW: Feed -->
          <div class="feed-container" v-if="feedNews.length > 0">
            <NewsCard v-for="item in feedNews" :key="item.id" :news="item" />
          </div>
        </div>
      </div>
      
      <!-- LOADING STATE -->
      <div class="loading-full" v-if="loading">
        <Loader2 class="spinner text-gradient" :size="48" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Gamepad2, LayoutDashboard, Activity, Rocket, Flame,
  MessageCircle, Search, RefreshCw, SearchX, Loader2
} from 'lucide-vue-next';
import NewsCard from './components/NewsCard.vue';
import { fetchLatestNews, forceProcessNews } from './services/api';

const news = ref([]);
const loading = ref(true);
const isProcessing = ref(false);
const searchQuery = ref('');
const currentFilter = ref('All');
const typeFilter = ref('');

const lastUpdated = ref(format(new Date(), 'HH:mm aa'));

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

// Filtered and limited news
const dashboardNews = computed(() => {
  let result = news.value;
  
  // Filter out news without thumbnail as requested
  result = result.filter(n => n.thumbnail && n.thumbnail.trim() !== '');
  
  // Apply search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(n => n.title.toLowerCase().includes(q));
  }

  // Apple category filter (only nintendo ones)
  if (currentFilter.value !== 'All') {
    // If exact match doesn't work, we can just do a broad term search for Mario/Zelda etc.
    const term = currentFilter.value.toLowerCase();
    result = result.filter(n => 
      (n.category && n.category.toLowerCase() === term) ||
      (n.title && n.title.toLowerCase().includes(term)) ||
      (n.summary && n.summary.toLowerCase().includes(term))
    );
  }

  if (typeFilter.value) {
    result = result.filter(n => n.type === typeFilter.value);
  }
  
  // Sort by pubDate or priority
  // For Nintendo Pulse we want to highlight High impact or recent
  const sorted = [...result].sort((a, b) => {
    if (a.impact === 'Alta' && b.impact !== 'Alta') return -1;
    if (a.impact !== 'Alta' && b.impact === 'Alta') return 1;
    return new Date(b.pubDate) - new Date(a.pubDate);
  });

  // Limit to 11 items max
  return sorted.slice(0, 11);
});

const heroNews = computed(() => dashboardNews.value[0] || null);
const destaquesNews = computed(() => dashboardNews.value.slice(1, 5));
const feedNews = computed(() => dashboardNews.value.slice(5, 11));

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
  width: 240px;
  min-width: 240px;
  background: rgba(7, 7, 10, 0.95);
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
  box-shadow: 0 0 15px rgba(230, 0, 18, 0.4);
}

.brand-text h1 {
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.brand-text span {
  font-size: 0.7rem;
  color: var(--primary);
  font-weight: 600;
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
  background: linear-gradient(90deg, rgba(230, 0, 18, 0.15), rgba(255, 51, 68, 0.05));
  color: var(--primary);
  border: 1px solid rgba(230, 0, 18, 0.3);
}

/* MAIN CONTENT */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: radial-gradient(circle at top right, rgba(230, 0, 18, 0.05) 0%, transparent 60%);
}

.topbar {
  height: 70px;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-glass);
}

.search-container {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  width: 320px;
}

.search-container input {
  background: transparent;
  border: none;
  color: white;
  margin-left: 10px;
  flex-grow: 1;
  outline: none;
  font-family: var(--font-inter);
  font-size: 0.9rem;
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

.status-widget {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-text {
  display: flex;
  flex-direction: column;
}

.status-main {
  font-size: 0.85rem;
  font-weight: 600;
}

.status-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--success);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--success);
}

.content-scroll {
  flex-grow: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* PULSE DASHBOARD GRID */
.pulse-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

.top-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  height: 45vh; /* Ocupa cerca de 45% da altura visível */
  min-height: 350px;
}

.hero-container {
  height: 100%;
}

.hero-card {
  height: 100%;
}

.destaques-container {
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  gap: 12px;
  height: 100%;
}

.feed-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  flex-grow: 1;
}

@media (max-width: 1400px) {
  .feed-container {
    grid-template-columns: repeat(3, 1fr);
  }
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
  margin: auto;
}
</style>
