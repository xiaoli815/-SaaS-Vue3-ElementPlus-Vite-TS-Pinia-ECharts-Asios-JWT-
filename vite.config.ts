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
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/product': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 资源内联阈值：小于 4KB 的资源内联为 base64，减少 HTTP 请求数
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心运行时
          vendor: ['vue', 'vue-router', 'pinia'],
          // Element Plus UI 框架
          elementPlus: ['element-plus', '@element-plus/icons-vue'],
          // ECharts 图表库（独立 chunk，利于浏览器缓存）
          echarts: ['echarts'],
          // HTTP 请求库
          axios: ['axios'],
        },
        // 优化 chunk 文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
})
