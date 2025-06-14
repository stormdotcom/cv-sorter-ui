import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'pdfjs-worker',
      transform(code, id) {
        if (id.includes('pdf.worker.min.js')) {
          return {
            code: code.replace(/self\.document/g, 'self'),
            map: null
          };
        }
      }
    } as Plugin
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist/build/pdf'],
          'pdfjs-worker': ['pdfjs-dist/build/pdf.worker.min.js'],
        },
      },
    },
  }
}); 
