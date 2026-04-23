import cron from 'node-cron';
import { sources } from './config/sources.js';
import { fetchAndFilterFeeds } from './services/rssService.js';
import { filterAndRankNews } from './services/filterService.js';
import { enhanceTopNewsWithAI } from './services/aiService.js';
import { storage } from './services/storageService.js';
import { sendDiscordNotification } from './services/discordService.js';
import { startServer } from './server.js';

async function runDailyWorkflow() {
  console.log(`\n--- Iniciando Workflow de Monitoramento (${new Date().toLocaleString('pt-BR')}) ---`);
  
  try {
    // 1. Coleta de Dados via RSS
    console.log('\n[1/4] Coletando feeds RSS das fontes configuradas...');
    const rawNews = await fetchAndFilterFeeds(sources);
    console.log(`Foram coletadas ${rawNews.length} notícias nas últimas 24 horas.`);

    if (rawNews.length === 0) {
      console.log('Nenhuma notícia recente. Encerrando workflow.');
      return;
    }

    // 2. Classificação, Filtros e IA Híbrida
    console.log('\n[2/4] Processando dados e enriquecendo com IA...');
    const rankedNews = filterAndRankNews(rawNews);
    
    // Passa pela IA apenas os top destaques para economizar a cota gratuita
    const processedData = await enhanceTopNewsWithAI(rankedNews);
    
    console.log(`Sistema classificou e refinou ${processedData.length} notícias únicas válidas.`);

    // 3. Armazenamento
    console.log('\n[3/4] Salvando dados localmente (JSON/Storage)...');
    storage.saveData(processedData);

    // 4. Notificação Discord Premium
    console.log('\n[4/4] Enviando notificação para o Discord...');
    await sendDiscordNotification(processedData);

    console.log('\n--- Workflow Finalizado com Sucesso ---');
  } catch (error) {
    console.error('\nErro Crítico no Workflow:', error);
  }
}

// Iniciar o Servidor API para o Dashboard Frontend
startServer();

// Agendamento Cron: 08:00 AM no horário de São Paulo
const cronSchedule = '0 8 * * *';

cron.schedule(cronSchedule, () => {
  console.log('\nExecutando tarefa agendada (Cron)...');
  runDailyWorkflow();
}, {
  scheduled: true,
  timezone: 'America/Sao_Paulo'
});

console.log(`Cron job configurado para rodar todos os dias às 08:00 (America/Sao_Paulo).`);

// Opcional: Para testar instantaneamente
// runDailyWorkflow();
