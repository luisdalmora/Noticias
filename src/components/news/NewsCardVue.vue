<template>
  <div class="news-card-wrapper" :id="`card-${news.id}`">
    <a :href="news.link" target="_blank" class="console-card group flex flex-col gap-4 animate-slide-up h-full">
      <div :class="['relative rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5', isHero ? 'aspect-[21/9]' : 'aspect-video']">
        <img 
          :src="currentImage" 
          alt="" 
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          @error="handleImageError"
        />
        <div class="absolute top-4 left-4">
          <div :class="['badge-impact', impactClass]">
            {{ news.impact }} Impacto
          </div>
        </div>
        <div v-if="news.aiEnhanced" class="absolute top-4 right-4 bg-purple-600/80 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-purple-400/20">
          AI Enhanced
        </div>
      </div>

      <div class="flex flex-col gap-2 flex-1">
        <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
          <span class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            {{ news.source }}
          </span>
          <span>{{ formattedTime }}</span>
        </div>
        
        <h3 :class="['font-black leading-tight group-hover:text-red-500 transition-colors line-clamp-2 uppercase italic', isHero ? 'text-2xl lg:text-4xl' : 'text-lg']">
          {{ news.title }}
        </h3>
        
        <p class="text-xs text-gray-400 line-clamp-3 leading-relaxed">
          {{ news.summary }}
        </p>

        <div class="mt-auto pt-4 flex items-center justify-between">
          <div class="flex gap-2">
            <span v-for="tag in news.tags.slice(0, 2)" :key="tag" class="badge bg-white/5 text-gray-500 tracking-tighter">
              #{{ tag }}
            </span>
          </div>
          <span :class="['badge', news.type === 'Rumor' ? 'text-yellow-500 border-yellow-500/20' : 'text-cyan-500 border-cyan-500/20']">
            {{ news.type }}
          </span>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  news: Object,
  isHero: Boolean
});

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
</script>

<style scoped>
.badge-impact {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.badge {
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
}
</style>
