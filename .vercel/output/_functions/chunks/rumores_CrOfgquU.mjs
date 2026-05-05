import { c as createComponent } from './astro-component_Bl3vXr-4.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_CK4VxcsY.mjs';
import { $ as $$BaseLayout } from './BaseLayout_Dd1eon7v.mjs';
import { $ as $$NewsCard } from './NewsCard_jRwfSWP4.mjs';
import { g as getLatestNews } from './workflow-service_C9Sh3Fno.mjs';

const $$Rumores = createComponent(async ($$result, $$props, $$slots) => {
  const news = await getLatestNews({ });
  const filtered = news.filter((n) => n.type === "Rumor");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Rumores" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"> <div class="flex items-center gap-6"> <span class="w-2 h-12 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/40"></span> <h1 class="text-4xl font-black uppercase tracking-widest italic">Central de <span class="text-yellow-500">Rumores</span></h1> </div> <div class="glass-panel px-6 py-3 border-yellow-500/20 bg-yellow-500/5 max-w-md"> <p class="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-1">⚠️ AVISO DE CONFIABILIDADE</p> <p class="text-[9px] text-gray-500 font-bold leading-relaxed">Rumores não são confirmações oficiais. Verifique sempre a fonte original e o nível de confiança atribuído.</p> </div> </div> ${filtered.length === 0 ? renderTemplate`<div class="py-20 text-center"> <p class="text-gray-500 font-bold uppercase tracking-widest">Nenhum rumor encontrado nas últimas 24 horas.</p> </div>` : renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> ${filtered.map((item) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": item })}`)} </div>`}` })}`;
}, "C:/xampp/htdocs/Noticias/src/pages/rumores.astro", void 0);

const $$file = "C:/xampp/htdocs/Noticias/src/pages/rumores.astro";
const $$url = "/rumores";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Rumores,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
