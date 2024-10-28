import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(),
    visualizer({
      filename: './stats.html', // Archivo donde se genera el análisis
      open: true, // Abre el reporte automáticamente al generar el bundle
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify', // Ensure stream is aliased
      buffer: 'buffer/', // Ensure buffer is aliased
      util: 'util/', // Ensure util is aliased
      // Add other aliases if needed
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  optimizeDeps: {
    include: [
      'buffer',
      'crypto-browserify',
      'stream-browserify',
      'util',
      'events',
      // Add other dependencies if necessary
    ],
  },
});
