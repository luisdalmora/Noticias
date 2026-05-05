import { c as createComponent } from './astro-component_Bl3vXr-4.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_CK4VxcsY.mjs';
import { $ as $$BaseLayout, r as renderScript } from './BaseLayout_Dd1eon7v.mjs';
import { $ as $$NewsCard } from './NewsCard_jRwfSWP4.mjs';
import { g as getLatestNews } from './workflow-service_C9Sh3Fno.mjs';

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
