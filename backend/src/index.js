import cron from 'node-cron';
import { runDailyWorkflow } from './services/workflowService.js';
import { startServer } from './server.js';

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
