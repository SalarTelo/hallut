import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  resolve: {
    alias: {
      // Core application aliases
      '@core': path.resolve(__dirname, 'src/core'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@ui': path.resolve(__dirname, 'src/ui'),
      '@builders': path.resolve(__dirname, 'src/builders'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@config': path.resolve(__dirname, 'src/config'),
      // Game content modules (outside src/)
      '@modules': path.resolve(__dirname, 'modules'),
    },
  },
  server: {
    proxy: {
      '/api/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, ''),
      },
    },
  },
  // Modules are served as static files from the public directory or via Vite's static file serving
  // Module components can be imported dynamically using Vite's import() function
  // Module components can also use @src alias to import from the main app
})
