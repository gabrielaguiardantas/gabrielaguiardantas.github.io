import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rolldownOptions: {
      // duas páginas: a v2 abre por padrão, e a v1 é carregada num iframe
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        v1: resolve(import.meta.dirname, 'v1.html'),
      },
    },
  },
})
