import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nintendo: resolve(__dirname, 'pages/nintendo.html'),
        samsung: resolve(__dirname, 'pages/samsung.html'),
        rumores: resolve(__dirname, 'pages/rumores.html'),
        historico: resolve(__dirname, 'pages/historico.html'),
        fontes: resolve(__dirname, 'pages/fontes.html'),
        configuracoes: resolve(__dirname, 'pages/configuracoes.html'),
        noticia: resolve(__dirname, 'pages/noticia.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
