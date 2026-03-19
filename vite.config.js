import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    host: true, // 关键：让服务监听 0.0.0.0，不只是 localhost
    port: 5173,
    allowedHosts: true // 允许所有域名访问
  }
})
