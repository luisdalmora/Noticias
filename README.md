# 🎮 Noticias Premium - OS v2.4.0

O portal definitivo de notícias gamer/tech, focado em **atualidade real**, **integridade visual** e **performance**.

## 🚀 Arquitetura de Integridade (Novidades)

### 1. Filtro de Atualidade Real
O sistema descarta automaticamente qualquer notícia com mais de **24 horas** (configurável via `MAX_NEWS_AGE_HOURS`). Se nenhuma notícia fresca for encontrada, o sistema exibe um estado vazio informativo em vez de mostrar conteúdo antigo.

### 2. Garantia de Imagem (Zero-Blank Policy)
Nunca exibimos um card sem imagem. O pipeline de imagem possui 5 camadas de extração:
1.  Tags de mídia do RSS (`media:content`).
2.  Extração de `og:image` e `twitter:image` via busca dinâmica na página original.
3.  Análise de conteúdo HTML via Cheerio.
4.  Imagens do Google News.
5.  **Fallback Local**: Imagens premium por categoria (`Nintendo`, `Samsung`, etc.) para garantir a estética do Dashboard.

### 3. Inteligência Opcional (Gemini AI)
A Gemini API é utilizada apenas para enriquecer as **TOP 5 notícias** mais impactantes. O sistema continua 100% funcional sem IA, garantindo disponibilidade e economia de limites.

### 4. Fontes Híbridas
Combinamos RSS tradicionais com o poder de busca do **Google News RSS**, monitorando termos específicos como "Switch 2", "Galaxy S25 Ultra" e "One UI ZTO Brasil".

## 🛠 Configuração Técnica

### Variáveis Críticas
- `GEMINI_ENABLED`: Ativa o processamento de IA.
- `MAX_NEWS_AGE_HOURS`: Define o limite de "notícia nova".
- `CRON_SECRET`: Protege o endpoint de atualização forçada.

## 📡 Endpoints
- `GET /api/news`: Feed principal com status detalhado do sistema.
- `POST /api/update`: Invalida o cache e força a sincronização global.

---
*Este portal não utiliza notícias fakes ou mockadas. Toda informação é sincronizada de fontes reais em tempo real.*
