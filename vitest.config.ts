import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/',
        '**/build/',
      ],
    },
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@builders': path.resolve(__dirname, 'src/builders'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@modules': path.resolve(__dirname, 'modules'),
    },
  },
});

