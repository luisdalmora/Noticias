<template>
  <a :href="news.link" target="_blank" class="news-card glass" :class="{ 'is-hero': isHighlight, 'is-compact': isCompact }">
    <div class="card-img-container">
      <img v-if="news.thumbnail" :src="news.thumbnail" :alt="news.title" loading="lazy" />
      <div v-else class="img-fallback"></div>
      
      <div class="badges-top-left" v-if="!isCompact">
        <span class="badge impact-badge" :class="impactClass">
          <component :is="impactIcon" :size="12" class="mr-1" />
          {{ news.impact }} Impacto
        </span>
      </div>
      
      <div class="badges-bottom-left" v-if="!isCompact">
        <span class="badge category-badge">{{ news.category.toUpperCase() }}</span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title card-title-clamp" :title="news.title">{{ news.title }}</h3>
      <p class="card-summary card-summary-clamp" v-if="!isCompact">{{ news.summary }}</p>
      
      <div class="card-footer">
        <div class="meta-left">
          <img :src="`https://www.google.com/s2/favicons?domain=${getDomain(news.link)}&sz=32`" class="favicon" />
          <span class="source">{{ news.source }}</span>
          <span class="dot">•</span>
          <span class="time">{{ formattedTime }}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Flame, Scale, Minus } from 'lucide-vue-next';

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  isHighlight: {
    type: Boolean,
    default: false
  },
  isCompact: {
    type: Boolean,
    default: false
  }
});

const formattedTime = computed(() => {
  if (!props.news.pubDate) return '';
  try {
    return formatDistanceToNow(new Date(props.news.pubDate), { addSuffix: true, locale: ptBR })
      .replace('aproximadamente ', '')
      .replace('cerca de ', '');
  } catch (e) {
    return '';
  }
});

const impactIcon = computed(() => {
  if (props.news.impact === 'Alta') return Flame;
  if (props.news.impact === 'Média') return Scale;
  return Minus;
});

const impactClass = computed(() => {
  if (props.news.impact === 'Alta') return 'impact-high';
  if (props.news.impact === 'Média') return 'impact-medium';
  return 'impact-low';
});

const getDomain = (url) => {
  try { return new URL(url).hostname; } catch (e) { return ''; }
};
</script>

<style scoped>
.news-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  height: 100%;
  position: relative;
  background: var(--bg-main);
}

.news-card:hover {
  transform: translateY(-4px);
  border-color: rgba(230, 0, 18, 0.4);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(230, 0, 18, 0.15);
}

/* IMAGE CONTAINER */
.card-img-container {
  height: 160px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.card-img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.news-card:hover .card-img-container img {
  transform: scale(1.05);
}

.img-fallback {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #111, var(--primary));
  opacity: 0.5;
}

/* GRADIENT OVERLAY */
.card-img-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, var(--bg-main) 0%, transparent 100%);
  z-index: 1;
}

/* BADGES */
.badges-top-left {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.badges-bottom-left {
  position: absolute;
  bottom: 12px;
  left: 12px;
  z-index: 2;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  text-transform: uppercase;
}

.mr-1 { margin-right: 4px; }

.category-badge {
  color: var(--text-main);
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px 8px;
}

.impact-high {
  background: rgba(230, 0, 18, 0.8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.impact-medium {
  background: rgba(234, 179, 8, 0.8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.impact-low {
  background: rgba(156, 163, 175, 0.8);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* CONTENT */
.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--bg-main);
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 8px;
  color: var(--text-main);
}

.card-summary {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 12px;
  flex-grow: 1;
}

/* FOOTER */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.favicon {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.source { font-weight: 600; color: #d1d5db; }
.dot { opacity: 0.5; }

/* === HERO CARD (isHighlight) === */
.is-hero {
  position: relative;
  border-color: rgba(230, 0, 18, 0.3);
  box-shadow: 0 0 30px rgba(230, 0, 18, 0.05);
}

.is-hero .card-img-container {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.is-hero .card-img-container::after {
  height: 80%;
  background: linear-gradient(to top, var(--bg-main) 10%, rgba(7, 7, 10, 0.7) 40%, transparent 100%);
}

.is-hero .card-content {
  position: relative;
  z-index: 2;
  background: transparent;
  justify-content: flex-end;
  padding: 30px;
}

.is-hero .card-title {
  font-size: 1.6rem;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.is-hero .card-summary {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 5px rgba(0,0,0,0.8);
  margin-bottom: 20px;
}

.is-hero .card-footer {
  margin-top: 0;
}

.is-hero .meta-left {
  font-size: 0.8rem;
  color: white;
  text-shadow: 0 1px 5px rgba(0,0,0,0.8);
}

.is-hero .source {
  color: white;
}

/* === COMPACT CARD (isCompact) === */
.is-compact {
  flex-direction: row;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
}

.is-compact .card-img-container {
  height: 70px;
  width: 100px;
  min-width: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.is-compact .card-img-container::after {
  display: none; /* No gradient over compact images */
}

.is-compact .card-content {
  padding: 0 0 0 12px;
  background: transparent;
  justify-content: center;
}

.is-compact .card-title {
  font-size: 0.85rem;
  margin-bottom: 6px;
  -webkit-line-clamp: 2;
}

.is-compact .card-footer {
  margin-top: 0;
}
</style>
