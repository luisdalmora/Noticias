import 'dotenv/config';
import express from 'express';

const app = express();
const port = 3001;

app.use(express.json());

// ---- Importa handlers ----
import newsHandler    from './api/news.js';
import updateHandler  from './api/update.js';
import samsungHandler from './api/samsung.js';
import gamesHandler   from './api/games.js';

// ---- Rotas ----
app.get('/api/news',    newsHandler);
app.get('/api/samsung', samsungHandler);
app.get('/api/games',   gamesHandler);
app.post('/api/update', updateHandler);

// ---- Status ----
app.get('/api/status', (req, res) => {
  import('./api/_lib/cache.js').then(({ getCacheStats }) => {
    res.json({ ok: true, cache: getCacheStats(), ts: new Date().toISOString() });
  }).catch(() => res.json({ ok: true }));
});

// ---- Start ----
app.listen(port, () => {
  console.log(`\x1b[32m[API] Servidor local rodando em http://localhost:${port}\x1b[0m`);
  console.log(`\x1b[36m[API] Rotas: GET /api/news | GET /api/samsung | GET /api/games | POST /api/update\x1b[0m`);
});
