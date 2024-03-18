import './assets/css/__index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import {createApp} from 'vue'
import {createPinia} from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
// @ts-ignore
import ru from 'element-plus/dist/locale/ru.min.mjs'
import 'dayjs/locale/ru.js'
import 'element-plus/dist/index.css'
import dayjs from 'dayjs'


/*** Для работы без интернета, например Байеры смогут на телефоне создать обращение, сфоткать и загрузить фотки
*/
// setTimeout(() => {
//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker
//             .register('sw.js')
//             .then(() => console.log('SW started'))
//     }
// }, 3000)


const app = createApp(App)
dayjs.Ls.en.weekStart = 1 // Неделя начинается с понедельника


app.use(createPinia())
app.use(ElementPlus, {locale: ru})
app.use(router)

app.mount('#app')
