import { sources } from '../config/sources.js';
import { fetchAndFilterFeeds } from './rssService.js';
import { filterAndRankNews } from './filterService.js';
import { enhanceTopNewsWithAI } from './aiService.js';
import { storage } from './storageService.js';
import { sendDiscordNotification } from './discordService.js';

export async function runDailyWorkflow() {
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
    
    // Passa pela IA
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
