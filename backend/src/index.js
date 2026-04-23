import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { startCronJobs } from './jobs/cronJob.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 3001;

// Inicializa o servidor Express
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 API Server running on port ${PORT} (Environment: ${process.env.NODE_ENV || 'development'})`);
});

// Inicializa os jobs em background
startCronJobs();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM recebido, encerrando servidor graciosamente...');
  server.close(() => {
    logger.info('Servidor encerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT recebido, encerrando servidor graciosamente...');
  server.close(() => {
    logger.info('Servidor encerrado.');
    process.exit(0);
  });
});
