import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // Ensure the matchMedia polyfill loads first
    setupFiles: ['./src/test-utils/matchMediaPolyfill.ts', './src/setupTests.ts'],
    globals: true,
    css: true,
    // Exclude larger e2e/test helper directories and node_modules from unit test collection
    exclude: ['e2e/**', 'test/**', '.removed_tests/**', 'node_modules/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@features': resolve(__dirname, 'src/features'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/shared/ui/components'),
    },
  },
  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
