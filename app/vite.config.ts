import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the build works from any subpath (GitHub Pages, Netlify, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
})
