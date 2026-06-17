import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 路径别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  // 开发服务器配置
  server: {
    port: 3002,
    host: '0.0.0.0',
    open: true,
    // 代理配置，解决跨域问题
    proxy: {
      // 代理 /api 开头的请求到本地 Mock 后端服务
      '/api': {
        target: 'http://localhost:3001', // Mock 后端服务地址
        changeOrigin: true,
      },
    },
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          elementPlus: ['element-plus', '@element-plus/icons-vue'],
        },
      },
    },
  },
})