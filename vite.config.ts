/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias for imports: "@/..."
    },
  },
  server: {
    port: 8080, // Porta local
  },
  build: {
    chunkSizeWarningLimit: 1000, // Suppress large chunk warning
    // Removed custom manualChunks to avoid possible initialization order issues in libs with multiple packages (e.g.: Sentry)
    // We keep the default Vite/Rollup chunking configuration for stability
  },
  // Test configuration for Vitest
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
