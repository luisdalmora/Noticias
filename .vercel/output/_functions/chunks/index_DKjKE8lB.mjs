import { c as createComponent } from './astro-component_Bl3vXr-4.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_CK4VxcsY.mjs';
import { $ as $$BaseLayout, r as renderScript } from './BaseLayout_Dd1eon7v.mjs';
import { $ as $$NewsCard } from './NewsCard_jRwfSWP4.mjs';
import { g as getLatestNews } from './workflow-service_C9Sh3Fno.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  let data = { status: "loading", news: [] };
  try {
    const news = await getLatestNews();
    data = {
      status: news.length > 0 ? "success" : "empty",
      news,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      geminiEnabled: process.env.GEMINI_ENABLED === "true"
    };
  } catch (e) {
    data = { status: "error", message: "Não foi possível carregar notícias atuais no momento.", news: [] };
  }
  const featured = data.news[0];
  const remaining = data.news.slice(1);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Dashboard" }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="flex flex-wrap items-center justify-between gap-4 mb-10 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md"> <div class="flex items-center gap-6"> <div class="flex items-center gap-2"> <div${addAttribute(`w-2 h-2 rounded-full ${data.status === "success" ? "bg-green-500 shadow-[0_0_10px_#22c55e]" : "bg-yellow-500"}`, "class")}></div> <span class="text-[10px] font-black uppercase tracking-widest">${data.status === "success" ? "Online" : "Sistema Ativo"}</span> </div> <div class="hidden md:flex items-center gap-2 text-gray-500"> <span class="text-[10px] font-black uppercase tracking-widest">Atualizado:</span> <span class="text-[10px] font-bold">${new Date(data.updatedAt || Date.now()).toLocaleTimeString()}</span> </div> </div> <div class="flex items-center gap-4"> ${data.geminiEnabled && renderTemplate`<span class="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
✨ Gemini IA Ativa
</span>`} <button id="manual-refresh" class="text-[9px] font-black uppercase tracking-widest text-white hover:text-red-500 transition-colors">
[ R ] Atualizar
</button> </div> </div> ${data.status === "empty" && renderTemplate`<div class="py-32 text-center animate-slide-up"> <div class="text-6xl mb-6 opacity-20">📡</div> <h2 class="text-2xl font-black uppercase tracking-widest mb-4 italic">Nenhuma notícia atual encontrada</h2> <p class="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">As fontes foram verificadas, mas nenhuma notícia das últimas 24 horas com imagem válida foi localizada no momento.</p> <button onclick="window.location.reload()" class="mt-8 bg-white/5 hover:bg-white/10 text-white font-black px-8 py-3 rounded-xl transition-all uppercase text-[10px] tracking-widest border border-white/10">
Tentar novamente
</button> </div>`}${data.status === "error" && renderTemplate`<div class="py-32 text-center animate-slide-up"> <div class="text-6xl mb-6">⚠️</div> <h2 class="text-2xl font-black uppercase tracking-widest mb-4 italic">${data.message}</h2> <p class="text-gray-500 text-sm">Verifique sua conexão ou as variáveis de ambiente do sistema.</p> </div>`}${data.status === "success" && renderTemplate`<section class="animate-fade-in"> <div class="flex items-center gap-4 mb-10"> <span class="w-2 h-10 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444]"></span> <h1 class="text-4xl lg:text-7xl font-black tracking-tighter uppercase italic">Central <span class="text-red-500">Noticias</span></h1> </div> <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16"> <div class="xl:col-span-2"> ${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": featured })} </div> <div class="flex flex-col gap-6"> <div class="flex items-center justify-between"> <h3 class="text-sm font-black uppercase tracking-widest text-gray-500">Destaques Recentes</h3> <span class="text-[10px] font-black text-red-500">TOP ${remaining.length}</span> </div> <div class="grid grid-cols-1 gap-6 max-h-[600px] overflow-y-auto pr-4 no-scrollbar"> ${remaining.slice(0, 4).map((item) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": item })}`)} </div> </div> </div> <div class="flex items-center gap-4 mb-8 pt-10 border-t border-white/5"> <span class="w-2 h-6 bg-red-500 rounded-full"></span> <h2 class="text-2xl font-black uppercase tracking-widest italic">Feed Global</h2> </div> <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"> ${remaining.slice(4).map((item) => renderTemplate`${renderComponent($$result2, "NewsCard", $$NewsCard, { "news": item })}`)} </div> </section>`}` })} ${renderScript($$result, "C:/xampp/htdocs/Noticias/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
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
