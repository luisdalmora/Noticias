<template>
  <a :href="news.link" target="_blank" class="news-card glass" :class="{ 'is-highlight': isHighlight }">
    <div class="card-img-container">
      <img v-if="news.thumbnail" :src="news.thumbnail" :alt="news.title" loading="lazy" />
      <div v-else class="img-fallback"></div>
      
      <div class="badges-top-left">
        <span class="badge impact-badge" :class="impactClass">
          <component :is="impactIcon" :size="12" class="mr-1" />
          {{ news.impact }} Impacto
        </span>
      </div>
      
      <div class="badges-bottom-left">
        <span class="badge category-badge">{{ news.category.toUpperCase() }}</span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="card-title card-title-clamp" :title="news.title">{{ news.title }}</h3>
      <p class="card-summary card-summary-clamp" v-if="!isHighlight">{{ news.summary }}</p>
      
      <div class="card-footer">
        <div class="meta-left">
          <img :src="`https://www.google.com/s2/favicons?domain=${getDomain(news.link)}&sz=32`" class="favicon" />
          <span class="source">{{ news.source }}</span>
          <span class="dot">•</span>
          <span class="time">{{ formattedTime }}</span>
        </div>
        <ExternalLink :size="16" class="text-muted" />
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Flame, Scale, Minus, ExternalLink } from 'lucide-vue-next';

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  isHighlight: {
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
}

.news-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(79, 70, 229, 0.1);
}

.is-highlight {
  border-color: rgba(239, 68, 68, 0.3);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.05);
}
.is-highlight:hover {
  border-color: rgba(239, 68, 68, 0.6);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.2);
}

.card-img-container {
  height: 200px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.is-highlight .card-img-container {
  height: 200px; /* Mesma altura agora */
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
  background: linear-gradient(135deg, var(--bg-main), var(--primary));
  opacity: 0.5;
}

.card-img-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, var(--bg-main) 0%, transparent 100%);
  z-index: 1;
}

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
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.mr-1 { margin-right: 4px; }

.category-badge {
  color: var(--text-main);
  text-transform: uppercase;
  font-size: 0.75rem;
  padding: 0;
  letter-spacing: 1px;
}

.impact-high {
  background: rgba(239, 68, 68, 0.15);
  color: #ff6b6b;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.impact-medium {
  background: rgba(234, 179, 8, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.impact-low {
  background: rgba(156, 163, 175, 0.15);
  color: #9ca3af;
  border: 1px solid rgba(156, 163, 175, 0.3);
}

.card-content {
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: var(--bg-main);
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 10px;
  color: var(--text-main);
}

.is-highlight .card-title {
  font-size: 1.15rem; /* Removido o tamanho extra grande */
}

.card-summary {
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin-bottom: 16px;
  flex-grow: 1;
}

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
  font-size: 0.8rem;
  color: var(--text-muted);
}

.favicon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.source { font-weight: 600; color: #d1d5db; }
.dot { opacity: 0.5; }
</style>
