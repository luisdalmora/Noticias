import axios from 'axios';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

const configPath = join(process.cwd(), 'config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));

export async function sendDiscordNotification(newsData) {
  if (!config.notificacoes_ativas) {
    console.log('Notificações no Discord estão desativadas na configuração.');
    return;
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || config.discord_webhook;
  if (!webhookUrl) {
    console.warn('Discord Webhook URL não configurado. Pulando notificação.');
    return;
  }

  try {
    const today = new Date().toLocaleDateString('pt-BR');
    
    // Top 3 Highlights (Impacto Alta)
    const highImpact = newsData.filter(n => n.impact === 'Alta').slice(0, 3);
    const highlightedIds = new Set(highImpact.map(n => n.id));

    const highlightsText = highImpact.length > 0 
      ? highImpact.map(n => {
          const aiTag = n.aiEnhanced ? ' ✨ *(IA)*' : '';
          return `🔥 **[${n.title.substring(0, 100)}](${n.link})**${aiTag}\n*${n.summary.substring(0, 200)}...*`;
        }).join('\n\n').substring(0, 1020)
      : 'Nenhum destaque de alto impacto hoje.';

    // Thumbnail principal para o Embed (usa a imagem do top 1 destaque)
    const mainImage = highImpact.length > 0 && highImpact[0].thumbnail 
      ? highImpact[0].thumbnail 
      : null;

    // Nintendo Summary (Excluindo destaques)
    const nintendoNews = newsData.filter(n => n.category === 'Nintendo' && !highlightedIds.has(n.id));
    const nintendoText = nintendoNews.length > 0
      ? nintendoNews.slice(0, 4).map(n => `• [${n.title.substring(0, 80)}](${n.link})\n  *${n.summary.substring(0, 60)}...*`).join('\n').substring(0, 950) + (nintendoNews.length > 4 ? `\n\n*...e mais ${nintendoNews.length - 4} notícias*` : '')
      : 'Nenhuma nova notícia regular.';

    // Samsung Summary (Excluindo destaques)
    const samsungNews = newsData.filter(n => n.category === 'Samsung' && !highlightedIds.has(n.id));
    const samsungText = samsungNews.length > 0
      ? samsungNews.slice(0, 4).map(n => `• [${n.title.substring(0, 80)}](${n.link})\n  *${n.summary.substring(0, 60)}...*`).join('\n').substring(0, 950) + (samsungNews.length > 4 ? `\n\n*...e mais ${samsungNews.length - 4} notícias*` : '')
      : 'Nenhuma nova notícia regular.';

    // Breaking News
    const breakingNews = newsData.filter(n => n.impact === 'Alta' && n.title.toLowerCase().includes('urgente'));
    const breakingText = breakingNews.length > 0
      ? breakingNews.map(n => `🚨 **${n.title}**\n${n.summary} - [Ver Fonte](${n.link})`).join('\n\n')
      : null;

    const embed = {
      title: '🧠 Resumo Diário de Monitoramento',
      url: 'http://localhost:5173', // Link para o dashboard local
      color: 0x0B0B0F, // Dark mode premium (quase preto)
      description: `**Data:** ${today}\n\nO sistema processou automaticamente as notícias. Abaixo estão os destaques e resumos estruturados.`,
      fields: [
        {
          name: '🔥 PRINCIPAIS DESTAQUES',
          value: highlightsText,
          inline: false
        },
        {
          name: '🎮 NINTENDO (Outras notícias)',
          value: nintendoText,
          inline: false
        },
        {
          name: '📱 SAMSUNG (Outras notícias)',
          value: samsungText,
          inline: false
        }
      ],
      footer: {
        text: 'Sistema de Monitoramento Automatizado Multi-IA • Premium Dashboard',
        icon_url: 'https://cdn-icons-png.flaticon.com/512/8636/8636836.png' // Icone generico de IA/Bot
      },
      timestamp: new Date().toISOString()
    };

    if (mainImage) {
      embed.image = { url: mainImage };
    }

    if (breakingText) {
      embed.fields.unshift({
        name: '🔴 BREAKING NEWS',
        value: breakingText,
        inline: false
      });
      embed.color = 0xff0000; // Vermelho para quebra de notícia
    }

    await axios.post(webhookUrl, {
      username: 'News Intel Premium',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/8636/8636836.png',
      embeds: [embed]
    });

    console.log('Notificação Premium enviada ao Discord com sucesso.');
  } catch (error) {
    console.error('Erro ao enviar notificação pro Discord:', error.message);
  }
}
