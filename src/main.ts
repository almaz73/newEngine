import './assets/css/__index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
// @ts-ignore
import ru from 'element-plus/dist/locale/ru.min.mjs'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, {locale: ru})
app.use(router)

app.mount('#app')
