import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path'; // Para paths absolutos

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Mantido: Alias para dynamic imports
    },
  },
  server: {
    port: 8080, // Mantido: Seu port local
  },
  build: {
    chunkSizeWarningLimit: 1000, // Novo: Aumenta limite para 1000kB – suprime o aviso (ajuste para 2000 se precisar mais)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Opcional: Otimização manual para splitting chunks grandes (ex.: vendor para dependências)
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});