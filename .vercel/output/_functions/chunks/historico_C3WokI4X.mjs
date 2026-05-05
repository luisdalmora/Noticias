import { c as createComponent } from './astro-component_CEH83wsb.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate, n as renderComponent } from './entrypoint_ClfmAdsr.mjs';
import { $ as $$BaseLayout, r as renderScript } from './BaseLayout_BI3S5Lgz.mjs';
import 'clsx';
import { a as getLatestNews } from './workflow-service_D2HR1-Ji.mjs';

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

const $$Historico = createComponent(async ($$result, $$props, $$slots) => {
  const news = await getLatestNews({ });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Histórico" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col lg:flex-row gap-8 items-start mb-12"> <div class="flex-1"> <div class="flex items-center gap-6 mb-4"> <span class="w-2 h-12 bg-blue-500 rounded-full shadow-lg shadow-blue-500/40"></span> <h1 class="text-4xl font-black uppercase tracking-widest italic">Histórico <span class="text-blue-500">Global</span></h1> </div> <p id="result-count" class="text-xs text-gray-500 font-bold uppercase tracking-widest px-8">${news.length} notícias nas últimas 24h</p> </div> <div class="w-full lg:w-auto flex flex-wrap gap-4 glass-panel p-6"> <select id="filter-category" class="bg-transparent text-xs font-black uppercase tracking-widest outline-none"> <option value="">Categoria: Todas</option> <option value="Nintendo">Nintendo</option> <option value="Samsung">Samsung</option> <option value="Gaming">Gaming</option> <option value="Tech">Tech</option> </select> <select id="filter-type" class="bg-transparent text-xs font-black uppercase tracking-widest outline-none"> <option value="">Tipo: Todos</option> <option value="Oficial">Oficial</option> <option value="Rumor">Rumor</option> <option value="Lançamento">Lançamento</option> </select> <select id="filter-impact" class="bg-transparent text-xs font-black uppercase tracking-widest outline-none"> <option value="">Impacto: Todos</option> <option value="Alta">Alta</option> <option value="Média">Média</option> <option value="Baixa">Baixa</option> </select> </div> </div> <div id="news-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> ${news.map((item) => renderTemplate`<div class="news-item"${addAttribute(item.category, "data-category")}${addAttribute(item.type, "data-type")}${addAttribute(item.impact, "data-impact")}> ${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": item })} </div>`)} </div> ${renderScript($$result2, "C:/xampp/htdocs/Noticias/src/pages/historico.astro?astro&type=script&index=0&lang.ts")} ` })}`;
}, "C:/xampp/htdocs/Noticias/src/pages/historico.astro", void 0);

const $$file = "C:/xampp/htdocs/Noticias/src/pages/historico.astro";
const $$url = "/historico";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Historico,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
