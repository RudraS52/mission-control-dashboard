import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves this project from /mission-control-dashboard/
  base: '/mission-control-dashboard/',
  plugins: [react()],
})