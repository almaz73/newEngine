import {defineConfig} from 'vite'
import {fileURLToPath, URL} from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        proxy: {
            '/api': {
                // target: 'http://localhost:5000', // локальный сервер
                target: 'https://dev.autonet.pro/', // удаленный сервер
                changeOrigin: true,
                withCredentials: true
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
