import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
 
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider:'v8'
    },
    globals: true,
    setupFiles: ['./test/setup.js'],
  },
})