import { c as createComponent } from './astro-component_Bl3vXr-4.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, n as renderComponent } from './entrypoint_CK4VxcsY.mjs';
import 'clsx';

const $$ImpactBadge = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ImpactBadge;
  const { impact } = Astro2.props;
  const styles = {
    Alta: "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    Média: "bg-yellow-500 text-black",
    Baixa: "bg-blue-600 text-white"
  };
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(`badge ${styles[impact] || "bg-gray-700"}`, "class")}> ${impact} IMPACTO
</span>`;
}, "C:/xampp/htdocs/Noticias/src/components/badges/ImpactBadge.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$NewsCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$NewsCard;
  const { news } = Astro2.props;
  const pubDate = new Date(news.pubDate);
  const timeAgo = pubDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const fallbackImg = `/images/fallback/${news.category.toLowerCase()}-news.webp`;
  return renderTemplate(_a || (_a = __template(["", '<div class="news-card-wrapper"', "> <a", ' class="console-card group flex flex-col gap-4 animate-slide-up h-full"> <div class="relative aspect-video rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5"> <img', ' alt="" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"', '> <div class="absolute top-4 left-4"> ', " </div> ", ' </div> <div class="flex flex-col gap-2 flex-1"> <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"> <span class="flex items-center gap-2"> <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> ', " </span> <span>", '</span> </div> <h3 class="text-lg font-black leading-tight group-hover:text-red-500 transition-colors line-clamp-2 uppercase italic"> ', ' </h3> <p class="text-xs text-gray-400 line-clamp-3 leading-relaxed"> ', ' </p> <div class="mt-auto pt-4 flex items-center justify-between"> <div class="flex gap-2"> ', " </div> <span", "> ", " </span> </div> </div> </a> </div> <script>\n  // Global handler for critical image failures\n  document.addEventListener('error', (e) => {\n    if (e.target.tagName === 'IMG' && e.target.src.includes('fallback')) {\n       const wrapper = e.target.closest('.news-card-wrapper');\n       if (wrapper) wrapper.remove(); // Remove card if even fallback fails\n    }\n  }, true);\n<\/script>"])), maybeRenderHead(), addAttribute(`card-${news.id}`, "id"), addAttribute(`/noticia/${news.id}`, "href"), addAttribute(news.thumbnail, "src"), addAttribute(`this.onerror=null; this.src='${fallbackImg}'; this.closest('.news-card-wrapper').dataset.imgStatus='fallback';`, "onerror"), renderComponent($$result, "ImpactBadge", $$ImpactBadge, { "impact": news.impact }), news.aiEnhanced && renderTemplate`<div class="absolute top-4 right-4 bg-purple-600/80 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-white border border-purple-400/20">
AI Enhanced
</div>`, news.source, timeAgo, news.title, news.summary, news.tags.slice(0, 2).map((tag) => renderTemplate`<span class="badge bg-white/5 text-gray-500 tracking-tighter">#${tag}</span>`), addAttribute(`badge ${news.type === "Rumor" ? "text-yellow-500 border-yellow-500/20" : "text-cyan-500 border-cyan-500/20"}`, "class"), news.type);
}, "C:/xampp/htdocs/Noticias/src/components/news/NewsCard.astro", void 0);

export { $$NewsCard as $ };
