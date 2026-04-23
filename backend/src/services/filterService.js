export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

function classifyImpact(title, content) {
  const t = title.toLowerCase();
  const c = (content || '').toLowerCase();
  
  if (t.includes('zto') || t.includes('urgente') || t.includes('nintendo direct') || 
      t.includes('lançamento') || t.includes('anunciado') || t.includes('oficial') ||
      t.includes('review') || t.includes('análise') || t.includes('vazamento grave') ||
      t.includes('galaxy s2') || t.includes('switch 2') || t.includes('galaxy z')) {
    return 'Alta';
  }
  
  if (t.includes('trailer') || t.includes('rumor') || t.includes('data de') || 
      t.includes('atualização') || t.includes('update') || t.includes('vazou') ||
      t.includes('patch')) {
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

function extractImage(item) {
  // Try media:content
  if (item['media:content'] && item['media:content']['$'] && item['media:content']['$']['url']) {
    return item['media:content']['$']['url'];
  }
  // Try enclosure
  if (item.enclosure && item.enclosure.url && item.enclosure.url.match(/\.(jpeg|jpg|gif|png)$/i)) {
    return item.enclosure.url;
  }
  // Extract from HTML content
  const content = item['content:encoded'] || item.content || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  // Fallback placeholder
  return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80';
}

export function filterAndRankNews(rawNews) {
  const processedData = [];
  const seenTitles = new Set();

  for (const item of rawNews) {
    const cleanTitle = item.title.toLowerCase().trim();
    if (seenTitles.has(cleanTitle)) continue;
    seenTitles.add(cleanTitle);

    let summary = stripHtml(item.content || item.summary || '');
    if (summary.length > 200) {
      summary = summary.substring(0, 200) + '...';
    }

    const impact = classifyImpact(item.title, summary);
    const type = classifyType(item.title);
    const thumbnail = extractImage(item);

    processedData.push({
      id: Math.random().toString(36).substr(2, 9),
      title: item.title,
      summary: summary,
      link: item.link,
      category: item.category,
      impact: impact,
      type: type,
      source: item.source,
      pubDate: item.pubDate,
      thumbnail: thumbnail,
      aiEnhanced: false // Flag para o frontend
    });
  }

  // Ordenar por relevância
  return processedData.sort((a, b) => {
    const impactScores = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
    return impactScores[b.impact] - impactScores[a.impact];
  });
}
