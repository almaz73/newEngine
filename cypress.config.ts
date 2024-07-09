import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  },
  env: {
    LOGIN: '____',
    PASSWORD: '____',
    BASE_URL: 'http://localhost:5173',
  },
})
