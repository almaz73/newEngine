import axios from "axios";
import {useGlobalStore} from "@/stores/globalStore";
import router from "@/router";
import {ElMessage} from "element-plus";

axios.interceptors.response.use(resp => resp
    , err => {
        console.error('Перехватываю все ошибки')
        console.warn(" err.request.status = ", err.request.status)

        if (!navigator.onLine) {
            console.log('Связи нет, сайт работает офлайн!')
            // return ElMessage({message: 'Связи нет, сайт работает офлайн!', type: 'warning',})
        }

        if (!err.request.status && err.code === "ERR_NETWORK") {
            // возможно у токена вышел срок, перекидываем на страницу авторизации
            useGlobalStore().isAuthorized = false
            navigator.onLine && router.push('login')
        }

        if (err.code === 'ERR_BAD_REQUEST') {
          if (err.response.statusText === 'Unauthorized') return ElMessage.error('Вы не авторизовались')
          if (err.response.data) return ElMessage({ message: err.response.data.errorText, type: 'error' })
        }
        if (err.request.status === 404) {
            ElMessage({message: 'Ошибка 404. Не найдено ', type: 'warning',})
        }
        if (err.request.status === 500) {
            ElMessage({message: 'Ошибка 500. Внутрення ошибка сервера', type: 'warning',})
        }
        return err
    })

