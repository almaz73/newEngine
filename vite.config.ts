import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      '/api/': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        withCredentials: true
      }
    }
    // proxy: {
    //   '/api': {
    //     target: "http://localhost:5000",
    //     changeOrigin: true,
    //     secure: false,
    //     // rewrite: path => {
    //     //   console.log('====path', path)
    //     //   path.replace('/api', '')
    //     // },
    //     configure: (proxy, options) => {
    //       // proxy будет экземпляром 'http-proxy'
    //     },
    //     cors:false
    //   }
    // }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
