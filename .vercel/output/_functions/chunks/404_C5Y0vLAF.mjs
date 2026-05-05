import { c as createComponent } from './astro-component_Bl3vXr-4.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead } from './entrypoint_CK4VxcsY.mjs';
import { $ as $$BaseLayout } from './BaseLayout_Dd1eon7v.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Página não encontrada" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-[60vh] flex flex-col items-center justify-center text-center"> <div class="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center text-6xl mb-8 animate-pulse">
🎮
</div> <h1 class="text-4xl lg:text-7xl font-black mb-4 uppercase tracking-tighter italic">Erro <span class="text-red-500">404</span></h1> <p class="text-gray-500 font-bold uppercase tracking-widest text-xs mb-10">Página não localizada no sistema operacional.</p> <a href="/" class="bg-red-500 hover:bg-red-600 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-red-500/20 active:scale-95 uppercase tracking-widest text-xs">
Voltar ao Dashboard
</a> </div> ` })}`;
}, "C:/xampp/htdocs/Noticias/src/pages/404.astro", void 0);

const $$file = "C:/xampp/htdocs/Noticias/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
