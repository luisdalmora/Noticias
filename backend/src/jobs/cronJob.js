import cron from 'node-cron';
import { runDailyWorkflow } from '../services/workflowService.js';
import { logger } from '../utils/logger.js';

let isWorkflowRunning = false;

export const startCronJobs = () => {
  // Agendamento: 08:00 AM no horário de São Paulo (America/Sao_Paulo)
  const cronSchedule = '0 8 * * *';

  cron.schedule(
    cronSchedule,
    async () => {
      if (isWorkflowRunning) {
        logger.warn('Cron job tentou iniciar, mas o workflow anterior ainda está rodando.');
        return;
      }

      try {
        isWorkflowRunning = true;
        logger.info('Iniciando execução da tarefa agendada (Cron)...');
        await runDailyWorkflow();
        logger.info('Tarefa agendada concluída com sucesso.');
      } catch (error) {
        logger.error('Erro durante a execução do cron job:', error);
      } finally {
        isWorkflowRunning = false;
      }
    },
    {
      scheduled: true,
      timezone: 'America/Sao_Paulo'
    }
  );

  logger.info(`Cron job configurado para rodar todos os dias às 08:00 (America/Sao_Paulo).`);
};

export const runWorkflowManually = async () => {
  if (isWorkflowRunning) {
    throw new Error('O workflow já está em execução no momento.');
  }

  try {
    isWorkflowRunning = true;
    logger.info('Iniciando execução manual do workflow...');
    await runDailyWorkflow();
    logger.info('Execução manual concluída com sucesso.');
  } finally {
    isWorkflowRunning = false;
  }
};
