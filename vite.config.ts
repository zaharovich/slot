import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  base: '/slot/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
      '@game': path.resolve(__dirname, 'src/game'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
});

