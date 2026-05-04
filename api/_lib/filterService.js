// ============================================================
// FILTER SERVICE — 3 Classificadores Determinísticos (Sem IA)
// ============================================================

// ---- UTILITÁRIOS ----
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
}

function normalizeText(str) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ============================================================
// CLASSIFICADOR NINTENDO
// ============================================================
const NINTENDO_HIGH_KEYWORDS = [
  /nintendo.?direct/i, /switch\s*2/i, /nintendo.?switch/i,
  /mario.kart/i, /zelda/i, /metroid/i, /splatoon/i,
  /launch|release.date|data.de.lancamento/i,
  /review|analise/i, /oficial|official/i,
  /direct.mini/i, /bank.direct/i, /indie.world/i
];

const NINTENDO_MEDIUM_KEYWORDS = [
  /trailer/i, /rumor|leak|vazamento/i, /update|atualiz/i,
  /dlc|expansion/i, /gameplay/i, /announce|anuncio/i,
  /pre.order|pre.venda/i, /patch/i, /nso|nintendo.online/i
];

function classifyNintendo(title, summary) {
  const text = normalizeText(title + ' ' + summary);

  let score = 0;
  for (const kw of NINTENDO_HIGH_KEYWORDS) {
    if (kw.test(text)) score += 3;
  }
  for (const kw of NINTENDO_MEDIUM_KEYWORDS) {
    if (kw.test(text)) score += 1;
  }

  let type = 'Oficial';
  if (/rumor|leak|vazament|vazou/i.test(text)) type = 'Rumor';
  else if (/direct|evento|event|nintendo.live/i.test(text)) type = 'Evento';

  return {
    impact: score >= 6 ? 'Alta' : score >= 3 ? 'Média' : 'Baixa',
    type,
    subcategory: detectNintendoSubcategory(text)
  };
}

function detectNintendoSubcategory(text) {
  if (/switch\s*2/i.test(text)) return 'Switch 2';
  if (/direct/i.test(text)) return 'Nintendo Direct';
  if (/mario/i.test(text)) return 'Mario';
  if (/zelda/i.test(text)) return 'Zelda';
  if (/pokemon/i.test(text)) return 'Pokémon';
  if (/metroid/i.test(text)) return 'Metroid';
  if (/splatoon/i.test(text)) return 'Splatoon';
  if (/kirby/i.test(text)) return 'Kirby';
  if (/donkey.kong/i.test(text)) return 'Donkey Kong';
  return 'Nintendo';
}

// ============================================================
// CLASSIFICADOR SAMSUNG
// ============================================================
const SAMSUNG_PRIORITY = [
  // Galaxy S25 Ultra / ZTO — pontuação máxima
  { regex: /s25.?ultra|sm.?s938/i, score: 10 },
  { regex: /\bzto\b/i,              score: 8 },
  // One UI / Android
  { regex: /one.?ui\s*\d/i,         score: 6 },
  { regex: /android\s*1[5-9]/i,     score: 5 },
  // Outros Galaxy
  { regex: /galaxy\s*s2[0-9]/i,     score: 4 },
  { regex: /galaxy\s*z.fold|galaxy\s*z.flip/i, score: 4 },
  // Firmware / segurança
  { regex: /firmware|update/i,      score: 3 },
  { regex: /security.patch|patch.de.seguran/i, score: 3 },
  // Apps Samsung
  { regex: /galaxy.store|game.launcher|gaming.hub/i, score: 2 }
];

function classifySamsung(title, summary) {
  const text = normalizeText(title + ' ' + summary);

  let score = 0;
  for (const { regex, score: s } of SAMSUNG_PRIORITY) {
    if (regex.test(text)) score += s;
  }

  let subcategory = 'Samsung';
  if (/firmware|one.?ui|android/i.test(text)) subcategory = 'Firmware';
  else if (/security|patch.de.seguran/i.test(text)) subcategory = 'Segurança';
  else if (/galaxy.store|game.launcher|gaming.hub/i.test(text)) subcategory = 'Apps';
  else if (/s25.?ultra|sm.?s938/i.test(text)) subcategory = 'S25 Ultra';

  return {
    impact: score >= 10 ? 'Alta' : score >= 5 ? 'Média' : 'Baixa',
    type: 'Oficial',
    subcategory
  };
}

// ============================================================
// CLASSIFICADOR MOBILE GAMES
// ============================================================
const FRANCHISE_MAP = {
  'Pokémon':       /pok[eé]mon|pikachu|niantic|pokemon.go/i,
  'Mario':         /\bmario\b|super.mario/i,
  'Zelda':         /\bzelda\b|breath.of.the.wild|tears.of.kingdom/i,
  'Donkey Kong':   /donkey.kong/i,
  'Dragon Ball':   /dragon.ball/i,
  'Minecraft':     /minecraft/i,
  'Monster Hunter': /monster.hunter/i,
  'Kirby':         /\bkirby\b/i,
  'GTA':           /\bgta\b|grand.theft.auto/i,
  'Story of Seasons': /story.of.seasons|harvest.moon/i,
  'Digimon':       /digimon/i
};

// Contexto mobile
const MOBILE_CONTEXT = /mobile|android|ios|app.store|google.play|pre.?regist|apk|f2p|free.to.play|gacha|smartphone/i;
// Fontes mobile-first — conteúdo aceito sem restrição
const MOBILE_FIRST_SOURCES = /toucharcade/i;
// Fontes gaming gerais — aceitar se tiver franquia OU contexto gaming
const GAMING_SOURCES = /gamerant|ign|eurogamer|kotaku/i;
// Contexto gaming geral
const GAMING_CONTEXT = /game|jogo|gaming|play|rpg|release|dlc|sequel|remake|review|trailer/i;

function classifyMobileGame(title, summary, sourceName = '') {
  const text = normalizeText(title + ' ' + summary);
  const src  = normalizeText(sourceName);

  const isMobileFirst = MOBILE_FIRST_SOURCES.test(src);
  const isGamingSource = GAMING_SOURCES.test(src);

  // Detecta franquia específica
  let franchise = null;
  for (const [name, regex] of Object.entries(FRANCHISE_MAP)) {
    if (regex.test(text)) { franchise = name; break; }
  }

  // Regras de aceitação:
  // 1. TouchArcade → sempre aceita (mobile-first)
  // 2. Gaming source + franquia conhecida → aceita
  // 3. Gaming source + contexto gaming → aceita (sem franquia → "Mobile Games")
  // 4. Qualquer fonte + contexto mobile + franquia → aceita
  if (!isMobileFirst && !franchise) {
    if (isGamingSource && GAMING_CONTEXT.test(text)) {
      // Aceita como "Mobile Games" genérico
    } else if (MOBILE_CONTEXT.test(text)) {
      // Aceita se tem contexto mobile explícito
    } else {
      return null; // Descarta
    }
  }

  const subcategory = franchise || 'Mobile Games';

  let impact = 'Baixa';
  if (/launch|release|novo.jogo|lancamento|lançamento|announced|new.game/i.test(text)) impact = 'Alta';
  else if (/update|patch|evento|event|pre.?regist|trailer|dlc/i.test(text)) impact = 'Média';

  let type = 'Oficial';
  if (/rumor|leak/i.test(text)) type = 'Rumor';
  else if (/evento|event|direct/i.test(text)) type = 'Evento';

  return { impact, type, subcategory };
}

// ============================================================
// DEDUPLICAÇÃO
// ============================================================
function normalizeTitle(title) {
  return normalizeText(title).replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim().substring(0, 80);
}

// ============================================================
// EXPORTAÇÃO PRINCIPAL
// ============================================================
export function filterAndRankAll(rawNews) {
  const seenTitles = new Set();
  const result = [];

  for (const item of rawNews) {
    if (!item.title) continue;

    // Deduplicação
    const normTitle = normalizeTitle(item.title);
    if (seenTitles.has(normTitle)) continue;
    seenTitles.add(normTitle);

    // Classificar por categoria
    const summary = stripHtml(item.summary || item.content || '').substring(0, 280);
    let classification;

    if (item.category === 'Nintendo') {
      classification = classifyNintendo(item.title, summary);
    } else if (item.category === 'Samsung') {
      classification = classifySamsung(item.title, summary);
    } else if (item.category === 'MobileGames') {
      classification = classifyMobileGame(item.title, summary, item.source || '');
      if (!classification) continue; // Descarta sem contexto mobile
    } else {
      continue;
    }

    result.push({
      ...item,
      summary,
      impact: classification.impact,
      type: classification.type,
      subcategory: classification.subcategory
    });
  }

  // Ordenar: Alta primeiro, depois data
  const impactScore = { Alta: 3, Média: 2, Baixa: 1 };
  return result.sort((a, b) => {
    const impactDiff = (impactScore[b.impact] || 0) - (impactScore[a.impact] || 0);
    if (impactDiff !== 0) return impactDiff;
    return new Date(b.pubDate) - new Date(a.pubDate);
  });
}
