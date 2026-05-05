import { c as createComponent } from './astro-component_CEH83wsb.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_ClfmAdsr.mjs';
import { $ as $$BaseLayout } from './BaseLayout_BI3S5Lgz.mjs';
import { F as FIXED_SOURCES, G as GOOGLE_NEWS_QUERIES } from './sources_CaozJTAi.mjs';

const $$Fontes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Fontes" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex items-center gap-6 mb-12"> <span class="w-2 h-12 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/40"></span> <h1 class="text-4xl font-black uppercase tracking-widest italic">Fontes <span class="text-cyan-500">Monitoradas</span></h1> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> ${FIXED_SOURCES.map((s) => renderTemplate`<div class="glass-panel p-8 animate-slide-up"> <div class="flex justify-between items-start mb-6"> <div class="w-14 h-14 bg-gray-900 rounded-3xl flex items-center justify-center text-3xl border border-white/5"> ${s.category === "Nintendo" ? "🎮" : "📱"} </div> <span${addAttribute(`badge ${s.enabled ? "bg-green-600" : "bg-gray-600"} text-white`, "class")}>${s.enabled ? "Ativo" : "Inativo"}</span> </div> <h3 class="font-black text-xl mb-1 uppercase tracking-tight">${s.name}</h3> <p class="text-[10px] text-gray-500 font-bold mb-6 tracking-widest">${s.url}</p> <div class="space-y-4"> <div class="flex justify-between text-[10px] font-black uppercase tracking-widest"> <span class="text-gray-500">Confiabilidade</span> <span class="text-cyan-500">${s.reliability}</span> </div> <div class="flex justify-between text-[10px] font-black uppercase tracking-widest"> <span class="text-gray-500">Origem</span> <span class="text-white">${s.country}</span> </div> <div class="flex justify-between text-[10px] font-black uppercase tracking-widest"> <span class="text-gray-500">Tipo</span> <span class="text-white">${s.type}</span> </div> </div> <a${addAttribute(s.url, "href")} target="_blank" class="mt-8 block w-full text-center py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest">
Visitar Site ➔
</a> </div>`)} ${GOOGLE_NEWS_QUERIES.map((q) => renderTemplate`<div class="glass-panel p-8 animate-slide-up border-purple-500/10"> <div class="flex justify-between items-start mb-6"> <div class="w-14 h-14 bg-purple-500/10 rounded-3xl flex items-center justify-center text-3xl border border-purple-500/20">
🔍
</div> <span class="badge bg-purple-600 text-white">Inteligente</span> </div> <h3 class="font-black text-xl mb-1 uppercase tracking-tight">${q.label}</h3> <p class="text-[10px] text-purple-400 font-bold mb-6 tracking-widest italic">Google News Query</p> <div class="space-y-4"> <div class="flex justify-between text-[10px] font-black uppercase tracking-widest"> <span class="text-gray-500">Prioridade</span> <span class="text-white">${q.priority}</span> </div> <div class="flex justify-between text-[10px] font-black uppercase tracking-widest"> <span class="text-gray-500">Termo</span> <span class="text-white truncate max-w-[100px]">${q.query}</span> </div> </div> </div>`)} </div> ` })}`;
}, "C:/xampp/htdocs/Noticias/src/pages/fontes.astro", void 0);

const $$file = "C:/xampp/htdocs/Noticias/src/pages/fontes.astro";
const $$url = "/fontes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Fontes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
