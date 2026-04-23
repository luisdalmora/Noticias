import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Injeção de rotas
app.use(routes);

// Middleware de tratamento de erros global (para não crachar a aplicação)
app.use((err, req, res, next) => {
  logger.error(`Unhandled Express Error: ${err.message}`, err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
