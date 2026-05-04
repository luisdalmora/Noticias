# 🎮 Noticias Premium - Static Edition

Uma central de notícias gamer e tech premium, inspirada na interface de consoles modernos (Switch 2 Style), 100% estática e direta.

## 🚀 Objetivo
Oferecer uma experiência visual de alto nível sem a complexidade de frameworks ou ferramentas de build. Ideal para visualização local imediata ou hospedagem em qualquer servidor de arquivos estáticos.

## 🛠 Stack Tecnológica
- **Linguagens**: HTML5 Semântico, CSS3 Moderno, JavaScript Vanilla (ES6).
- **Estilização**: Tailwind CSS via CDN.
- **Dados**: Arquivos JSON locais em `data/`.
- **Persistência**: LocalStorage para preferências do usuário.

## 📂 Estrutura do Projeto
```text
Noticias/
├── index.html           # Dashboard principal
├── nintendo.html        # Central Nintendo
├── samsung.html         # Central Samsung/Android
├── rumores.html         # Central de Vazamentos
├── noticia.html         # Visualização detalhada
├── assets/
│   ├── css/            # Estilos organizados por responsabilidade
│   └── js/             # Lógica modular pura
└── data/
    ├── noticias.json    # Banco de dados de notícias
    └── fontes.json      # Cadastro de fontes monitoradas
```

## ⚙️ Como Utilizar

### 1. Acesso Direto
Basta abrir o arquivo `index.html` em qualquer navegador moderno. 

> [!IMPORTANT]
> Alguns navegadores (como o Chrome) possuem restrições de segurança (CORS) ao carregar arquivos JSON locais via `file://`. Caso os dados não apareçam, recomenda-se abrir a pasta com uma extensão de servidor local (ex: **Live Server** no VS Code) ou desativar temporariamente as restrições de arquivos locais.

### 2. Sem Dependências
Não é necessário rodar `npm install`, `npm run dev` ou qualquer outro comando de terminal. O projeto é autossuficiente.

### 3. Personalização
Para adicionar novas notícias, basta editar o arquivo `data/noticias.json` seguindo o padrão estabelecido.

## 🎨 Design System
- **Fundo**: Deep Graphite (#0a0a0a).
- **Acentos**: Red Neon (#ff2d55) e Cyan Tech (#00e5ff).
- **Tipografia**: Inter (via Google Fonts).
- **UX**: Sidebar persistente no desktop e Bottom Bar otimizada para mobile.

---
Desenvolvido com foco em performance e simplicidade.
