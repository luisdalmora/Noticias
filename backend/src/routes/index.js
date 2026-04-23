import { Router } from 'express';
import { getLatestNews } from '../controllers/newsController.js';
import { getHealthCheck, forceRunWorkflow } from '../controllers/systemController.js';

const router = Router();

// System Routes
router.get('/health', getHealthCheck);
router.post('/run', forceRunWorkflow); // Novo endpoint manual solicitado
router.post('/api/force-run', forceRunWorkflow); // Mantendo compatibilidade legada se o Vue chamar isso

// API Routes
router.get('/api/news', getLatestNews);

export default router;
