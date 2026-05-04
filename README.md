# 🎮 Noticias Premium OS

Um portal de notícias de alta performance inspirado na interface de consoles modernos (Switch 2 Style), construído com tecnologias puras e arquitetura serverless.

## 🚀 Objetivo
Transformar a curadoria de notícias gamer e tech em uma experiência visual imersiva, rápida e inteligente. O sistema monitora fontes globais, classifica impactos via IA e apresenta tudo em uma interface premium de "Sistema Operacional".

## 🛠 Stack Tecnológica
- **Frontend**: HTML5 Semântico, Vanilla JavaScript (ES6+), Tailwind CSS 3.
- **Tooling**: Vite (Multi-Page Application), PostCSS, Autoprefixer.
- **Backend**: Node.js Serverless Functions (Vercel API).
- **IA**: Google Gemini 1.5 Flash para classificação e resumo.
- **Dados**: RSS Parser, LocalStorage para persistência de preferências.

## 📂 Estrutura de Pastas
```text
/api                # Serverless Functions (Vercel)
  /_lib             # Serviços modulares (IA, RSS, Cache)
/pages              # Páginas HTML (Nintendo, Samsung, etc.)
/src
  /assets
    /css            # Design System (Base, Layout, Components)
    /js             # Lógica Modular (API, Renderer, UI)
  /partials         # Componentes HTML reutilizáveis
index.html          # Dashboard Principal
```

## ⚙️ Instalação e Uso Local

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/luisdalmora/Noticias.git
   cd Noticias
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Configurar variáveis de ambiente**:
   Crie um arquivo `.env` baseado no `.env.example` e adicione sua `GEMINI_API_KEY`.

4. **Rodar em desenvolvimento**:
   ```bash
   npm run dev
   ```

5. **Gerar Build**:
   ```bash
   npm run build
   ```

## 🔐 Segurança e Atualização
O endpoint `/api/update` é protegido. Para disparar a atualização das notícias, é necessário enviar um header de autorização:
- **Header**: `Authorization: Bearer <CRON_SECRET>`

## 🧠 Classificação de Impacto
O sistema utiliza IA para definir o peso de cada notícia:
- **Alta**: Lançamentos oficiais, Nintendo Directs, Firmwares críticos (ZTO).
- **Média**: Rumores de fontes confiáveis, reviews, atualizações de jogos.
- **Baixa**: Rumores fracos, curiosidades, notícias genéricas.

## 🎨 Design System (Console Style)
- **Cores**: Profundo #0a0a0a com acentos em Vermelho Neon e Ciano Tech.
- **Cards**: Estilo "Tiles" de console com bordas arredondadas (24px) e efeitos de foco.
- **UX**: Navegação lateral no desktop e barra inferior no mobile.

---
Desenvolvido com ❤️ por Antigravity.
