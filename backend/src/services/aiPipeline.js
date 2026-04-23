// Módulo reescrito para processar notícias de forma nativa (SEM Inteligência Artificial)
// Usando regras lógicas em JavaScript

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

function classifyImpact(title) {
  const t = title.toLowerCase();
  
  // Palavras-chave para Impacto Alto
  if (t.includes('zto') || t.includes('urgente') || t.includes('nintendo direct') || 
      t.includes('lançamento') || t.includes('anunciado') || t.includes('oficial') ||
      t.includes('review') || t.includes('análise') || t.includes('vazamento grave') ||
      t.includes('galaxy s2') || t.includes('switch 2')) {
    return 'Alta';
  }
  
  // Palavras-chave para Impacto Médio
  if (t.includes('trailer') || t.includes('rumor') || t.includes('data de') || 
      t.includes('atualização') || t.includes('update') || t.includes('vazou')) {
    return 'Média';
  }
  
  return 'Baixa';
}

function classifyType(title) {
  const t = title.toLowerCase();
  if (t.includes('rumor') || t.includes('leak') || t.includes('vazamento') || t.includes('vazou')) {
    return 'Rumor';
  }
  return 'Oficial';
}

export async function processNewsPipeline(rawNews) {
  if (!rawNews || rawNews.length === 0) return [];
  
  console.log('Iniciando processamento nativo via JavaScript (SEM IA)...');
  
  const processedData = [];
  const seenTitles = new Set(); // Para deduplicação

  for (const item of rawNews) {
    const cleanTitle = item.title.toLowerCase().trim();
    
    // Deduplicação básica: Verifica se já existe um título idêntico
    // (Não é tão inteligente quanto a IA, mas evita feeds duplicados do mesmo site)
    if (seenTitles.has(cleanTitle)) {
      continue;
    }
    seenTitles.add(cleanTitle);

    // Gerar resumo a partir do conteúdo (Removendo tags HTML e pegando os primeiros 150 caracteres)
    let summary = stripHtml(item.content);
    if (summary.length > 150) {
      summary = summary.substring(0, 150) + '...';
    }

    // Classificação
    const impact = classifyImpact(item.title);
    const type = classifyType(item.title);

    processedData.push({
      title: item.title,
      summary: summary,
      link: item.link,
      category: item.category,
      impact: impact,
      type: type,
      source: item.source
    });
  }
  
  // Opcional: Para evitar flood no Discord (já que a IA condensava tudo), 
  // vamos limitar o retorno aos 15 itens mais relevantes
  const sortedData = processedData.sort((a, b) => {
    const impactScores = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
    return impactScores[b.impact] - impactScores[a.impact];
  });

  return sortedData.slice(0, 15);
}
