/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias para imports: "@/..."
    },
  },
  server: {
    port: 8080, // Porta local
  },
  build: {
    chunkSizeWarningLimit: 1000, // Suprime aviso de chunk grande
    // Removido manualChunks personalizado para evitar possíveis problemas de ordem de inicialização em libs com múltiplos pacotes (ex.: Sentry)
    // Mantemos a configuração padrão de chunking do Vite/Rollup por estabilidade
  },
  // Configuração de testes para Vitest
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
