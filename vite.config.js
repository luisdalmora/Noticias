import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// No Vercel, as funções em /api são servidas automaticamente no mesmo domínio.
// Para desenvolvimento local, utilize 'vercel dev' em vez de 'npm run dev'.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  }
});
