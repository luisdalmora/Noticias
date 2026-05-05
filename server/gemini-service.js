export async function enhanceWithGemini(newsItems) {
  if (process.env.GEMINI_ENABLED !== 'true' || !process.env.GEMINI_API_KEY) {
    return newsItems;
  }

  const itemsToProcess = newsItems.slice(0, parseInt(process.env.GEMINI_MAX_ITEMS_PER_RUN || '5'));
  
  try {
    const prompt = `Melhore o resumo, tags e classificação das seguintes notícias gamer/tech.
    Retorne APENAS um array JSON com objetos contendo: id, summary (pt-BR, conciso), tags (array), impact (Alta/Média/Baixa), classificationReason.
    
    Notícias:
    ${JSON.stringify(itemsToProcess.map(i => ({ id: i.id, title: i.title, summary: i.summary })))}
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (response.ok) {
      const data = await response.json();
      const enhancements = JSON.parse(data.candidates[0].content.parts[0].text);
      
      return newsItems.map(item => {
        const enhancement = enhancements.find(e => e.id === item.id);
        if (enhancement) {
          return {
            ...item,
            summary: enhancement.summary || item.summary,
            tags: Array.from(new Set([...item.tags, ...(enhancement.tags || [])])),
            impact: enhancement.impact || item.impact,
            classificationReason: enhancement.classificationReason || item.classificationReason,
            aiEnhanced: true
          };
        }
        return item;
      });
    }
  } catch (e) {
    console.error('❌ Gemini Error:', e.message);
  }

  return newsItems;
}
