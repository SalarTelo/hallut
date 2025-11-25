import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow importing module components directly
      '@modules': path.resolve(__dirname, 'modules'),
      // Allow modules to import from src
      '@src': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api/ollama': {
        target: 'http://localhost:11434',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollama/, '/api'),
      },
    },
  },
  // Modules are served as static files from the public directory or via Vite's static file serving
  // Module components can be imported dynamically using Vite's import() function
  // Module components can also use @src alias to import from the main app
})
