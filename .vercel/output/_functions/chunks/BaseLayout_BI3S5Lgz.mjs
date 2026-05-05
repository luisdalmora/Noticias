import { c as createComponent } from './astro-component_CEH83wsb.mjs';
import 'piccolore';
import { o as createRenderInstruction, m as maybeRenderHead, h as addAttribute, r as renderTemplate, p as renderHead, n as renderComponent, q as renderSlot } from './entrypoint_ClfmAdsr.mjs';
import 'clsx';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const $$Sidebar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Sidebar;
  const navItems = [
    { href: "/", label: "Dashboard", icon: "🏠" },
    { href: "/nintendo", label: "Nintendo", icon: "🎮" },
    { href: "/samsung", label: "Samsung", icon: "📱" },
    { href: "/rumores", label: "Rumores", icon: "🕵️" },
    { href: "/historico", label: "Histórico", icon: "📚" },
    { href: "/fontes", label: "Fontes", icon: "🌐" },
    { href: "/configuracoes", label: "Ajustes", icon: "⚙️" }
  ];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<aside class="hidden lg:flex flex-col w-72 bg-[#0a0a0a] border-r border-white/5 h-screen sticky top-0 p-8 z-50"> <div class="mb-12 flex items-center gap-4"> <div class="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/40 transform -rotate-6"> <span class="text-white font-black text-2xl">N</span> </div> <div class="flex flex-col"> <span class="text-xl font-black tracking-tighter leading-none">NOTICIAS</span> <span class="text-red-500 font-black text-[10px] tracking-[0.3em] mt-1">PREMIUM OS</span> </div> </div> <nav class="flex-1 flex flex-col gap-2"> <p class="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4 px-4">Menu</p> ${navItems.map((item) => {
    const isLocalFilter = ["/", "/nintendo", "/samsung", "/rumores"].includes(item.href);
    const filterType = item.label === "Dashboard" ? "all" : item.label === "Rumores" ? "Rumor" : item.label;
    return renderTemplate`<a${addAttribute(isLocalFilter ? "#" : item.href, "href")}${addAttribute(`nav-link flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all duration-300 group ${currentPath === item.href || item.href !== "/" && currentPath.startsWith(item.href) ? "bg-red-500/10 text-red-500 border border-red-500/20 active-nav" : "text-gray-500 hover:bg-white/5 hover:text-white"}`, "class")}${addAttribute(isLocalFilter ? filterType : null, "data-filter")}${addAttribute(item.href, "data-href")}> <span class="text-xl group-hover:scale-110 transition-transform">${item.icon}</span> <span class="tracking-tight">${item.label}</span> </a>`;
  })} </nav> ${renderScript($$result, "C:/xampp/htdocs/Noticias/src/components/layout/Sidebar.astro?astro&type=script&index=0&lang.ts")} <div class="mt-auto"> <div class="glass-panel p-4 text-center"> <p class="text-[10px] font-black text-gray-600 tracking-widest uppercase">Version 2.3.0</p> </div> </div> </aside>`;
}, "C:/xampp/htdocs/Noticias/src/components/layout/Sidebar.astro", void 0);

const $$Topbar = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="h-20 bg-black/50 backdrop-blur-2xl border-bottom border-white/5 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40"> <div class="flex items-center gap-4 flex-1 max-w-2xl"> <div class="relative w-full group"> <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors">🔍</span> <input type="text" id="topbar-search" placeholder="Buscar no sistema..." class="w-full bg-[#111] border border-white/5 rounded-2xl py-3 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"> </div> </div> <div class="flex items-center gap-4 ml-6"> <button id="refresh-btn" class="w-12 h-12 rounded-2xl bg-[#111] border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all active:scale-90 shadow-xl"> <span class="text-xl">🔄</span> </button> <div id="status-indicator" class="hidden lg:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5"> <div class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div> <span class="text-[10px] font-black uppercase tracking-widest">Online Mode</span> </div> </div> </header> ${renderScript($$result, "C:/xampp/htdocs/Noticias/src/components/layout/Topbar.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/xampp/htdocs/Noticias/src/components/layout/Topbar.astro", void 0);

const $$MobileNav = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$MobileNav;
  const items = [
    { href: "/", icon: "🏠", label: "Home" },
    { href: "/nintendo", icon: "🎮", label: "Nin" },
    { href: "/samsung", icon: "📱", label: "Sam" },
    { href: "/rumores", icon: "🕵️", label: "Rum" },
    { href: "/historico", icon: "📚", label: "Hist" }
  ];
  const currentPath = Astro2.url.pathname;
  return renderTemplate`${maybeRenderHead()}<nav class="lg:hidden fixed bottom-6 left-6 right-6 z-[100] glass-panel flex items-center justify-between px-6 py-4 shadow-2xl"> ${items.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`flex flex-col items-center gap-1 transition-all ${currentPath === item.href ? "text-red-500 scale-110" : "text-gray-500 hover:text-white"}`, "class")}> <span class="text-2xl">${item.icon}</span> <span class="text-[8px] font-black uppercase tracking-widest">${item.label}</span> </a>`)} </nav>`;
}, "C:/xampp/htdocs/Noticias/src/components/layout/MobileNav.astro", void 0);

const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="pt-BR" class="bg-[#050505] text-white overflow-x-hidden"> <head><meta charset="UTF-8"><meta name="description" content="Noticias Premium - OS Dashboard"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title} | Noticias Premium</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">${renderHead()}</head> <body class="min-h-screen flex"> ${renderComponent($$result, "Sidebar", $$Sidebar, {})} <main class="flex-1 flex flex-col min-w-0"> ${renderComponent($$result, "Topbar", $$Topbar, {})} <div class="p-6 lg:p-10 max-w-7xl mx-auto w-full pb-32 lg:pb-10"> ${renderSlot($$result, $$slots["default"])} </div> ${renderComponent($$result, "MobileNav", $$MobileNav, {})} </main> ${renderScript($$result, "C:/xampp/htdocs/Noticias/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "C:/xampp/htdocs/Noticias/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, renderScript as r };
