import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@features': resolve(__dirname, 'src/features'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },
});
