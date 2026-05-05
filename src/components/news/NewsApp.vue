<template>
  <div class="news-app">
    <!-- System Status Bar (simplified for client-side) -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-10 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <div :class="{
            'w-2 h-2 rounded-full': true,
            'bg-yellow-500 animate-pulse': loading,
            'bg-green-500 shadow-status': !loading
          }"></div>

          <span class="text-[10px] font-black uppercase tracking-widest">{{ loading ? 'Sincronizando' : 'Sistema Ativo' }}</span>
        </div>
        <div v-if="updatedAt" class="hidden md:flex items-center gap-2 text-gray-500">
          <span class="text-[10px] font-black uppercase tracking-widest">Atualizado:</span>
          <span class="text-[10px] font-bold">{{ new Date(updatedAt).toLocaleTimeString() }}</span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
          {{ filteredNews.length }} Notícias
        </span>
        <button @click="fetchNews" class="text-[9px] font-black uppercase tracking-widest text-white hover:text-red-500 transition-colors">
          [ R ] Atualizar
        </button>
      </div>
    </div>

    <!-- Empty/Error States -->
    <div v-if="error" class="py-32 text-center animate-slide-up">
      <div class="text-6xl mb-6">⚠️</div>
      <h2 class="text-2xl font-black uppercase tracking-widest mb-4 italic">Erro ao carregar notícias</h2>
      <p class="text-gray-500 text-sm">{{ error }}</p>
    </div>

    <div v-else-if="!loading && filteredNews.length === 0" class="py-32 text-center animate-slide-up">
      <div class="text-6xl mb-6 opacity-20">📡</div>
      <h2 class="text-2xl font-black uppercase tracking-widest mb-4 italic">Nenhuma notícia encontrada</h2>
      <p class="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">Não encontramos notícias para este filtro nas últimas 24 horas.</p>
    </div>

    <!-- Success State -->
    <section v-else class="animate-fade-in">
      <div class="flex items-center gap-4 mb-10">
        <span class="w-2 h-10 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444]"></span>
        <h1 class="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic">
          {{ currentTitle }} <span class="text-red-500">{{ currentSubtitle }}</span>
        </h1>
      </div>

      <!-- Hero Section (only for Dashboard) -->
      <div v-if="currentFilter === 'all' && visibleNews.length > 0" class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
        <div class="xl:col-span-2">
          <NewsCardVue :news="visibleNews[0]" is-hero />
        </div>
        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black uppercase tracking-widest text-gray-500">Destaques Recentes</h3>
            <span class="text-[10px] font-black text-red-500">TOP 4</span>
          </div>
          <div class="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 no-scrollbar">
            <NewsCardVue v-for="item in visibleNews.slice(1, 5)" :key="item.id" :news="item" />
          </div>
        </div>
      </div>

      <!-- Global Feed -->
      <div v-if="currentFilter !== 'all' || visibleNews.length > 5" class="flex items-center gap-4 mb-8 pt-10 border-t border-white/5">
        <span class="w-2 h-6 bg-red-500 rounded-full"></span>
        <h2 class="text-2xl font-black uppercase tracking-widest italic">Feed {{ currentFilter === 'all' ? 'Global' : currentFilter }}</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <NewsCardVue v-for="item in (currentFilter === 'all' ? visibleNews.slice(5) : visibleNews)" :key="item.id" :news="item" />
      </div>

      <!-- Load More -->
      <div v-if="hasMore" class="mt-16 flex flex-col items-center gap-4">
        <button 
          @click="loadMore"
          class="bg-white/5 hover:bg-white/10 text-white font-black px-12 py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-white/10 group"
        >
          Carregar mais <span class="text-red-500 group-hover:ml-2 transition-all">>></span>
        </button>
        <p class="text-[10px] font-black text-gray-600 uppercase tracking-widest">
          Exibindo {{ visibleNews.length }} de {{ filteredNews.length }} notícias
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NewsCardVue from './NewsCardVue.vue';

const allNews = ref([]);
const loading = ref(true);
const error = ref(null);
const updatedAt = ref(null);
const currentFilter = ref('all'); // all, Nintendo, Samsung, Rumor
const visibleCount = ref(30);

const fetchNews = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch('/api/news');
    const data = await response.json();
    if (data.success) {
      allNews.value = data.items;
      updatedAt.value = data.updatedAt;
    } else {
      error.value = data.message;
    }
  } catch (e) {
    error.value = "Falha na conexão com a API.";
  } finally {
    loading.value = false;
  }
};

const filteredNews = computed(() => {
  if (currentFilter.value === 'all') return allNews.value;
  
  if (currentFilter.value === 'Rumor') {
    return allNews.value.filter(n => {
      if (n.type !== 'Rumor') return false;
      const text = (n.title + ' ' + n.summary).toLowerCase();
      return n.category === 'Nintendo' || text.includes('nintendo') || text.includes('switch');
    });
  }
  
  return allNews.value.filter(n => n.category === currentFilter.value);
});


const visibleNews = computed(() => {
  return filteredNews.value.slice(0, visibleCount.value);
});

const hasMore = computed(() => {
  return visibleCount.value < filteredNews.value.length;
});

const loadMore = () => {
  visibleCount.value += 30;
};

const currentTitle = computed(() => {
  if (currentFilter.value === 'all') return 'Central';
  if (currentFilter.value === 'Nintendo') return 'Universo';
  if (currentFilter.value === 'Samsung') return 'Galaxy';
  if (currentFilter.value === 'Rumor') return 'Canal de';
  return 'Categoria';
});

const currentSubtitle = computed(() => {
  if (currentFilter.value === 'all') return 'Noticias';
  if (currentFilter.value === 'Nintendo') return 'Nintendo';
  if (currentFilter.value === 'Samsung') return 'Samsung';
  if (currentFilter.value === 'Rumor') return 'Rumores';
  return currentFilter.value;
});

// Handle events from Sidebar or URL
const handleFilterChange = (filter) => {
  currentFilter.value = filter;
  visibleCount.value = 30;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  fetchNews();
  
  // Listen for navigation events
  const onNav = (e) => {
    if (e.detail?.filter) {
      handleFilterChange(e.detail.filter);
    }
  };
  window.addEventListener('app-nav', onNav);

  // Check URL hash for initial filter
  const hash = window.location.hash.replace('#', '');
  if (['Nintendo', 'Samsung', 'Rumor'].includes(hash)) {
    currentFilter.value = hash;
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
