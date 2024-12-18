import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"",
  server:
  {

  },
  preview:
  {
    host:true,
    port:6173,
    strictPort:true
  }
})
