import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['frontend/src/**/*.{test,spec}.{js,jsx,ts,tsx}']// Files to include for testing
    
  },
})
