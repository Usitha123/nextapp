import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider:'v8'
    },
    globals: true,
    setupFiles: ['./test/setup.js'],
  },
})