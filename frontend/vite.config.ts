import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
