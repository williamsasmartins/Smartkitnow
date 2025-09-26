import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path'; // Novo import para resolve paths

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // Novo: Alias '@' para 'src/' – corrige o erro de import
    },
  },
  server: {
    port: 8080, // Mantém sua config de port
  },
});