import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': '/src/Components',
      '@pages': '/src/Pages',
    },
    dedupe: ['react', 'react-dom'],
  },
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    hmr: true,
    open: true,
  },
});
