import { c as createComponent } from './astro-component_Bl3vXr-4.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_CK4VxcsY.mjs';
import { $ as $$BaseLayout } from './BaseLayout_Dd1eon7v.mjs';
import { $ as $$NewsCard } from './NewsCard_jRwfSWP4.mjs';
import { g as getLatestNews } from './workflow-service_C9Sh3Fno.mjs';

const $$Samsung = createComponent(async ($$result, $$props, $$slots) => {
  const news = await getLatestNews({ category: "Samsung" });
  const filtered = news.filter((n) => n.category === "Samsung" || n.category === "Android" || n.tags.includes("Samsung"));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Samsung" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-gradient-to-br from-blue-600 to-indigo-950 p-10 lg:p-16 rounded-[3rem] mb-12 relative overflow-hidden group shadow-2xl"> <div class="relative z-10"> <div class="flex items-center gap-4 mb-6"> <span class="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Mobile & OS</span> </div> <h1 class="text-5xl lg:text-8xl font-black text-white mb-4 tracking-tighter leading-none italic">GALAXY <span class="opacity-30 text-4xl lg:text-6xl">HUB</span></h1> <p class="text-white/70 font-bold uppercase tracking-[0.4em] text-xs max-w-lg">S25 Ultra, One UI, Firmwares ZTO e ecossistema Android</p> </div> <div class="absolute right-[-40px] bottom-[-40px] text-[240px] opacity-10 group-hover:scale-110 transition-all duration-1000 grayscale pointer-events-none">📱</div> </div> <div class="flex items-center gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar"> <button class="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Tudo</button> <button class="bg-white/5 text-gray-400 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">One UI</button> <button class="bg-white/5 text-gray-400 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">Firmware</button> <button class="bg-white/5 text-gray-400 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all">ZTO Brasil</button> </div> ${filtered.length === 0 ? renderTemplate`<div class="py-20 text-center"> <p class="text-gray-500 font-bold uppercase tracking-widest">Nenhuma notícia de Samsung/Android encontrada nas últimas 24 horas.</p> </div>` : renderTemplate`<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> ${filtered.map((item) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": item })}`)} </div>`}` })}`;
}, "C:/xampp/htdocs/Noticias/src/pages/samsung.astro", void 0);

const $$file = "C:/xampp/htdocs/Noticias/src/pages/samsung.astro";
const $$url = "/samsung";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Samsung,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
