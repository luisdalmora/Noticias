import { c as createComponent } from './astro-component_CEH83wsb.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate } from './entrypoint_ClfmAdsr.mjs';
import { $ as $$BaseLayout } from './BaseLayout_BI3S5Lgz.mjs';
import { useSSRContext, ref, computed, mergeProps, onMounted, onUnmounted } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$1 = {
  __name: 'NewsCardVue',
  props: {
  news: Object,
  isHero: Boolean
},
  setup(__props, { expose: __expose }) {
  __expose();

const props = __props;

const currentImage = ref(props.news.thumbnail);
const hasError = ref(false);

const handleImageError = () => {
  if (hasError.value) return; // Prevent infinite loop
  hasError.value = true;
  currentImage.value = `/images/fallback/${props.news.category.toLowerCase()}-news.webp`;
};

const formattedTime = computed(() => {
  const date = new Date(props.news.pubDate);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
});

const impactClass = computed(() => {
  if (props.news.impact === 'Alta') return 'bg-red-500 text-white';
  if (props.news.impact === 'Média') return 'bg-yellow-500 text-black';
  return 'bg-blue-500 text-white';
});

const __returned__ = { props, currentImage, hasError, handleImageError, formattedTime, impactClass, ref, computed };
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
return __returned__
}

};

function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${
    ssrRenderAttrs(mergeProps({
      class: "news-card-wrapper",
      id: `card-${$props.news.id}`
    }, _attrs))
  } data-v-3cce8ddb><a${
    ssrRenderAttr("href", $props.news.link)
  } target="_blank" class="console-card group flex flex-col gap-4 animate-slide-up h-full" data-v-3cce8ddb><div class="${
    ssrRenderClass(['relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5', $props.isHero ? 'aspect-[21/9]' : 'aspect-video'])
  }" data-v-3cce8ddb><img${
    ssrRenderAttr("src", $setup.currentImage)
  } alt="" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" data-v-3cce8ddb><div class="absolute top-4 left-4" data-v-3cce8ddb><div class="${
    ssrRenderClass(['badge-impact', $setup.impactClass])
  }" data-v-3cce8ddb>${
    ssrInterpolate($props.news.impact)
  } Impacto </div></div>`);
  if ($props.news.aiEnhanced) {
    _push(`<div class="absolute top-4 right-4 bg-purple-600/80 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-purple-400/20" data-v-3cce8ddb> AI Enhanced </div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="flex flex-col gap-2 flex-1" data-v-3cce8ddb><div class="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500" data-v-3cce8ddb><span class="flex items-center gap-2" data-v-3cce8ddb><span class="w-1.5 h-1.5 rounded-full bg-red-500" data-v-3cce8ddb></span> ${
    ssrInterpolate($props.news.source)
  }</span><span data-v-3cce8ddb>${
    ssrInterpolate($setup.formattedTime)
  }</span></div><h3 class="${
    ssrRenderClass(['font-black leading-tight group-hover:text-red-500 transition-colors line-clamp-2 uppercase italic', $props.isHero ? 'text-2xl lg:text-4xl' : 'text-lg'])
  }" data-v-3cce8ddb>${
    ssrInterpolate($props.news.title)
  }</h3><p class="text-xs text-gray-400 line-clamp-3 leading-relaxed" data-v-3cce8ddb>${
    ssrInterpolate($props.news.summary)
  }</p><div class="mt-auto pt-4 flex items-center justify-between" data-v-3cce8ddb><div class="flex gap-2" data-v-3cce8ddb><!--[-->`);
  ssrRenderList($props.news.tags.slice(0, 2), (tag) => {
    _push(`<span class="badge bg-white/5 text-gray-500 tracking-tighter" data-v-3cce8ddb> #${ssrInterpolate(tag)}</span>`);
  });
  _push(`<!--]--></div><span class="${
    ssrRenderClass(['badge', $props.news.type === 'Rumor' ? 'text-yellow-500 border-yellow-500/20' : 'text-cyan-500 border-cyan-500/20'])
  }" data-v-3cce8ddb>${
    ssrInterpolate($props.news.type)
  }</span></div></div></a></div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/news/NewsCardVue.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : undefined
};
const NewsCardVue = /*#__PURE__*/_export_sfc(_sfc_main$1, [['ssrRender',_sfc_ssrRender$1],['__scopeId',"data-v-3cce8ddb"]]);

const _sfc_main = {
  __name: 'NewsApp',
  setup(__props, { expose: __expose }) {
  __expose();

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
  if (currentFilter.value === 'Rumor') return allNews.value.filter(n => n.type === 'Rumor');
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

const __returned__ = { allNews, loading, error, updatedAt, currentFilter, visibleCount, fetchNews, filteredNews, visibleNews, hasMore, loadMore, currentTitle, currentSubtitle, handleFilterChange, ref, computed, onMounted, onUnmounted, NewsCardVue };
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
return __returned__
}

};

function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${
    ssrRenderAttrs(mergeProps({ class: "news-app" }, _attrs))
  } data-v-d88c7df8><div class="flex flex-wrap items-center justify-between gap-4 mb-10 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md" data-v-d88c7df8><div class="flex items-center gap-6" data-v-d88c7df8><div class="flex items-center gap-2" data-v-d88c7df8><div class="${
    ssrRenderClass({
            'w-2 h-2 rounded-full': true,
            'bg-yellow-500 animate-pulse': $setup.loading,
            'bg-green-500 shadow-status': !$setup.loading
          })
  }" data-v-d88c7df8></div><span class="text-[10px] font-black uppercase tracking-widest" data-v-d88c7df8>${
    ssrInterpolate($setup.loading ? 'Sincronizando' : 'Sistema Ativo')
  }</span></div>`);
  if ($setup.updatedAt) {
    _push(`<div class="hidden md:flex items-center gap-2 text-gray-500" data-v-d88c7df8><span class="text-[10px] font-black uppercase tracking-widest" data-v-d88c7df8>Atualizado:</span><span class="text-[10px] font-bold" data-v-d88c7df8>${ssrInterpolate(new Date($setup.updatedAt).toLocaleTimeString())}</span></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div><div class="flex items-center gap-4" data-v-d88c7df8><span class="text-[9px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20" data-v-d88c7df8>${ssrInterpolate($setup.filteredNews.length)} Notícias </span><button class="text-[9px] font-black uppercase tracking-widest text-white hover:text-red-500 transition-colors" data-v-d88c7df8> [ R ] Atualizar </button></div></div>`);
  if ($setup.error) {
    _push(`<div class="py-32 text-center animate-slide-up" data-v-d88c7df8><div class="text-6xl mb-6" data-v-d88c7df8>⚠️</div><h2 class="text-2xl font-black uppercase tracking-widest mb-4 italic" data-v-d88c7df8>Erro ao carregar notícias</h2><p class="text-gray-500 text-sm" data-v-d88c7df8>${ssrInterpolate($setup.error)}</p></div>`);
  } else if (!$setup.loading && $setup.filteredNews.length === 0) {
    _push(`<div class="py-32 text-center animate-slide-up" data-v-d88c7df8><div class="text-6xl mb-6 opacity-20" data-v-d88c7df8>📡</div><h2 class="text-2xl font-black uppercase tracking-widest mb-4 italic" data-v-d88c7df8>Nenhuma notícia encontrada</h2><p class="text-gray-500 max-w-md mx-auto text-sm leading-relaxed" data-v-d88c7df8>Não encontramos notícias para este filtro nas últimas 24 horas.</p></div>`);
  } else {
    _push(`<section class="animate-fade-in" data-v-d88c7df8><div class="flex items-center gap-4 mb-10" data-v-d88c7df8><span class="w-2 h-10 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444]" data-v-d88c7df8></span><h1 class="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic" data-v-d88c7df8>${
      ssrInterpolate($setup.currentTitle)
    } <span class="text-red-500" data-v-d88c7df8>${
      ssrInterpolate($setup.currentSubtitle)
    }</span></h1></div>`);
    if ($setup.currentFilter === 'all' && $setup.visibleNews.length > 0) {
      _push(`<div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16" data-v-d88c7df8><div class="xl:col-span-2" data-v-d88c7df8>`);
      _push(ssrRenderComponent($setup["NewsCardVue"], {
        news: $setup.visibleNews[0],
        "is-hero": ""
      }, null, _parent));
      _push(`</div><div class="flex flex-col gap-6" data-v-d88c7df8><div class="flex items-center justify-between" data-v-d88c7df8><h3 class="text-sm font-black uppercase tracking-widest text-gray-500" data-v-d88c7df8>Destaques Recentes</h3><span class="text-[10px] font-black text-red-500" data-v-d88c7df8>TOP 4</span></div><div class="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 no-scrollbar" data-v-d88c7df8><!--[-->`);
      ssrRenderList($setup.visibleNews.slice(1, 5), (item) => {
        _push(ssrRenderComponent($setup["NewsCardVue"], {
          key: item.id,
          news: item
        }, null, _parent));
      });
      _push(`<!--]--></div></div></div>`);
    } else {
      _push(`<!---->`);
    }
    if ($setup.currentFilter !== 'all' || $setup.visibleNews.length > 5) {
      _push(`<div class="flex items-center gap-4 mb-8 pt-10 border-t border-white/5" data-v-d88c7df8><span class="w-2 h-6 bg-red-500 rounded-full" data-v-d88c7df8></span><h2 class="text-2xl font-black uppercase tracking-widest italic" data-v-d88c7df8>Feed ${ssrInterpolate($setup.currentFilter === 'all' ? 'Global' : $setup.currentFilter)}</h2></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" data-v-d88c7df8><!--[-->`);
    ssrRenderList(($setup.currentFilter === 'all' ? $setup.visibleNews.slice(5) : $setup.visibleNews), (item) => {
      _push(ssrRenderComponent($setup["NewsCardVue"], {
        key: item.id,
        news: item
      }, null, _parent));
    });
    _push(`<!--]--></div>`);
    if ($setup.hasMore) {
      _push(`<div class="mt-16 flex flex-col items-center gap-4" data-v-d88c7df8><button class="bg-white/5 hover:bg-white/10 text-white font-black px-12 py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest border border-white/10 group" data-v-d88c7df8> Carregar mais <span class="text-red-500 group-hover:ml-2 transition-all" data-v-d88c7df8>&gt;&gt;</span></button><p class="text-[10px] font-black text-gray-600 uppercase tracking-widest" data-v-d88c7df8> Exibindo ${
        ssrInterpolate($setup.visibleNews.length)
      } de ${
        ssrInterpolate($setup.filteredNews.length)
      } notícias </p></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</section>`);
  }
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext()
  ;(ssrContext.modules || (ssrContext.modules = new Set())).add("src/components/news/NewsApp.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined
};
const NewsApp = /*#__PURE__*/_export_sfc(_sfc_main, [['ssrRender',_sfc_ssrRender],['__scopeId',"data-v-d88c7df8"]]);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "NewsApp", NewsApp, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/xampp/htdocs/Noticias/src/components/news/NewsApp.vue", "client:component-export": "default" })} ` })}`;
}, "C:/xampp/htdocs/Noticias/src/pages/index.astro", void 0);

const $$file = "C:/xampp/htdocs/Noticias/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
