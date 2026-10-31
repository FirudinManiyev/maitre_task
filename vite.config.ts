import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { securityHeaders } from './config/securityHeaders.ts'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: { headers: securityHeaders },
})
