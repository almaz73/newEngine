import {defineConfig} from 'vite'
import {fileURLToPath, URL} from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [
        vue(),
    ],
    base: '/v2/',
    server: {
        proxy: {
            '/api': {
                // target: 'http://localhost:5000', // локальный сервер
                target: 'https://dev.autonet.pro/', // удаленный сервер
                changeOrigin: true
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    define: {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
})
