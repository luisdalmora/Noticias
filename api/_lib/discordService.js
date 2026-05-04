import axios from 'axios';
import { config } from './config.js';

function formatCategoryFeed(newsArray, category, limit = 4, excludeIds = new Set()) {
  const filtered = newsArray.filter(n => n.category === category && !excludeIds.has(n.id));
  if (filtered.length === 0) return 'Nenhuma nova notícia regular.';
  
  const text = filtered.slice(0, limit)
    .map(n => `• [${n.title.substring(0, 80)}](${n.link})\n  *${n.summary.substring(0, 60)}...*`)
    .join('\n')
    .substring(0, 950);
    
  return filtered.length > limit ? `${text}\n\n*...e mais ${filtered.length - limit} notícias*` : text;
}

export async function sendDiscordNotification(newsData) {
  if (!config.notificacoes_ativas) return;

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const today = new Date().toLocaleDateString('pt-BR');
    const highImpact = newsData.filter(n => n.impact === 'Alta').slice(0, 3);
    const highlightedIds = new Set(highImpact.map(n => n.id));

    const highlightsText = highImpact.length > 0 
      ? highImpact.map(n => `🔥 **[${n.title.substring(0, 100)}](${n.link})**\n*${n.summary.substring(0, 200)}...*`).join('\n\n').substring(0, 1020)
      : 'Nenhum destaque de alto impacto hoje.';

    const mainImage = highImpact.length > 0 && highImpact[0].thumbnail ? highImpact[0].thumbnail : null;
    const nintendoText = formatCategoryFeed(newsData, 'Nintendo', 4, highlightedIds);
    const samsungText = formatCategoryFeed(newsData, 'Samsung', 4, highlightedIds);

    const embed = {
      title: '🧠 Resumo Diário de Monitoramento (Serverless)',
      color: 0x0B0B0F,
      description: `**Data:** ${today}\n\nProcessado via Vercel.`,
      fields: [
        { name: '🔥 PRINCIPAIS DESTAQUES', value: highlightsText, inline: false },
        { name: '🎮 NINTENDO', value: nintendoText, inline: false },
        { name: '📱 SAMSUNG', value: samsungText, inline: false }
      ],
      timestamp: new Date().toISOString()
    };

    if (mainImage) embed.image = { url: mainImage };

    await axios.post(webhookUrl, {
      username: 'News Intel Vercel',
      embeds: [embed]
    });
  } catch (error) {
    console.error('Discord Notification Error:', error.message);
  }
}
