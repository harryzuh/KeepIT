import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Em desenvolvimento, /api/* vai para a API local sem problema de CORS.
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
        rewrite: (caminho) => caminho.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    css: false,
  },
});
