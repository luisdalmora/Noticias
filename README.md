# 🎮 Noticias Premium - OS v2.2.0

Uma central de notícias gamer e tech premium com arquitetura 100% estática e suporte a modo online/offline inteligente.

## ✨ Novidades da Versão 2.2.0
- **Modo Online/Offline**: Suporte a endpoints externos com fallback automático para JSON local.
- **Sistema de Status**: Indicadores visuais em tempo real (Online, Offline, Erro).
- **Busca Avançada**: Pesquisa em títulos, resumos, tags, fontes e categorias.
- **Histórico Completo**: Novos filtros por impacto, tipo, categoria e ordenação cronológica.
- **Design Refinado**: Interface inspirada em sistemas operacionais de consoles de nova geração (estilo Switch 2) com animações fluidas e glassmorphism.

## 🚀 Como Abrir o Projeto
Como o projeto utiliza `fetch` para carregar os dados JSON, você deve abri-lo usando um servidor local para evitar bloqueios de CORS do navegador.

1.  **VS Code**: Use a extensão **Live Server**.
2.  **Hospedagem**: Publique em qualquer serviço estático (GitHub Pages, Vercel, Netlify).

## ⚙️ Configuração (Modo Online)
Edite o arquivo `assets/js/config.js` para conectar o sistema a um endpoint real:

```javascript
const CONFIG = {
  USE_ONLINE_MODE: true,
  ONLINE_NEWS_URL: "https://seu-endpoint.com/api/news",
  // ...
};
```

O sistema validará e normalizará os dados recebidos automaticamente. Se o endpoint falhar, o sistema ativará o **Offline Mode** usando o `data/noticias.json`.

## 📂 Estrutura de Dados
- **`data/noticias.json`**: Banco de dados local para demonstração (fallback).
- **`data/fontes.json`**: Lista de fontes monitoradas pelo sistema.

## 🛠 Tecnologias
- HTML5 Semântico
- CSS3 (Variáveis, Flexbox, Grid, Animações)
- JavaScript Vanilla (ES6+, AbortController, LocalStorage)
- Tailwind CSS via CDN

---
*Este projeto não utiliza frameworks (Vue/React/Next) ou ferramentas de build (npm/Vite), mantendo a simplicidade e portabilidade total.*
