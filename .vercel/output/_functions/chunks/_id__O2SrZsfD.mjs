import { c as createComponent } from './astro-component_Bl3vXr-4.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute } from './entrypoint_CK4VxcsY.mjs';
import { $ as $$BaseLayout } from './BaseLayout_Dd1eon7v.mjs';
import { g as getLatestNews } from './workflow-service_C9Sh3Fno.mjs';

async function getStaticPaths() {
  return [];
}
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  const news = await getLatestNews({ });
  const item = news.find((n) => n.id === id);
  if (!item) {
    return Astro2.redirect("/404");
  }
  const related = news.filter((n) => n.category === item.category && n.id !== item.id).slice(0, 3);
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": item.title }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-4xl mx-auto animate-fade-in pb-20"> <div class="mb-10"> <div class="flex flex-wrap gap-3 mb-6"> <span${addAttribute(`badge ${item.impact === "Alta" ? "bg-red-500" : "bg-blue-600"}`, "class")}>${item.impact} IMPACTO</span> <span class="badge bg-white/5 text-gray-400">${item.type}</span> <span class="badge bg-white/5 text-gray-400">${item.category}</span> </div> <h1 class="text-3xl lg:text-6xl font-black mb-6 leading-tight tracking-tighter uppercase italic">${item.title}</h1> <div class="flex items-center gap-6 text-gray-500 text-sm font-bold uppercase tracking-widest"> <div class="flex items-center gap-2"> <span class="w-8 h-8 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center text-[10px]">OS</span> <span>${item.source}</span> </div> <span>•</span> <span>${new Date(item.pubDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span> </div> </div> ${item.thumbnail && renderTemplate`<div class="relative rounded-[3rem] overflow-hidden mb-12 shadow-2xl border border-white/5 aspect-video"> <img${addAttribute(item.thumbnail, "src")} class="w-full h-full object-cover" alt=""> <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div> </div>`} <div class="prose prose-invert max-w-none"> <p class="text-xl lg:text-2xl text-white font-bold leading-relaxed mb-8 border-l-4 border-red-500 pl-6 py-2"> ${item.summary} </p> <div class="text-gray-400 text-lg leading-loose space-y-6"> <p>Esta notícia foi coletada via RSS e processada automaticamente pelo motor de inteligência do Noticias Premium.</p> <p><strong>Motivo da Classificação:</strong> ${item.classificationReason}</p> </div> </div> <div class="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center"> <a${addAttribute(item.link, "href")} target="_blank" class="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white font-black py-5 px-12 rounded-2xl transition-all shadow-xl shadow-red-500/20 active:scale-95 text-center uppercase tracking-widest">
Ler Matéria Original ➔
</a> <button onclick="window.history.back()" class="text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors text-sm">
[ B ] Voltar ao Dashboard
</button> </div> ${related.length > 0 && renderTemplate`<div class="mt-20"> <h3 class="text-xl font-black uppercase tracking-widest mb-8 italic">Notícias Relacionadas</h3> <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> ${related.map((r) => renderTemplate`<a${addAttribute(`/noticia/${r.id}`, "href")} class="flex flex-col gap-3 group"> <div class="aspect-video rounded-2xl overflow-hidden border border-white/5"> <img${addAttribute(r.thumbnail, "src")} class="w-full h-full object-cover transition-transform group-hover:scale-110" alt=""> </div> <h4 class="text-sm font-bold line-clamp-2 leading-tight group-hover:text-red-500 transition-all uppercase">${r.title}</h4> </a>`)} </div> </div>`} </div> ` })}`;
}, "C:/xampp/htdocs/Noticias/src/pages/noticia/[id].astro", void 0);

const $$file = "C:/xampp/htdocs/Noticias/src/pages/noticia/[id].astro";
const $$url = "/noticia/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  getStaticPaths,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
