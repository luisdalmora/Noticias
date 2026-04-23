import { logger } from '../utils/logger.js';
import { runWorkflowManually } from '../jobs/cronJob.js';

export const getHealthCheck = (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};

export const forceRunWorkflow = async (req, res) => {
  try {
    await runWorkflowManually();
    res.json({ status: 'success', message: 'Workflow executado com sucesso' });
  } catch (error) {
    logger.error('Error in forceRunWorkflow controller:', error);
    // Verifica se é o erro de 'já em execução' ou outro erro genérico
    if (error.message.includes('já está em execução')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro ao executar o workflow manualmente' });
    }
  }
};
