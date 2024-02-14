import axios from "axios";
import {useGlobalStore} from "@/stores/globalStore";
import router from "@/router";
import {ElMessage} from "element-plus";

axios.interceptors.response.use(resp => resp
    , err => {
        console.log('Перехватываею все ошибкиь err=', err)
        console.log(" err.request.status = ", err.request.status)

        if (!navigator.onLine) {
            console.log('Связи нет, сайт работает офлайн!')
            // return ElMessage({message: 'Связи нет, сайт работает офлайн!', type: 'warning',})
        }

        if (!err.request.status && err.code === "ERR_NETWORK") {
            // возможно у токена вышел срок, перекидываем на страницу авторизации
            useGlobalStore().oldPath = location.pathname != '/login' ? location.pathname : useGlobalStore().oldPath
            useGlobalStore().isAuthorized = false
            navigator.onLine && router.push('login')
        }

        if (err.request.status === 500) {
            ElMessage({message: 'Ошибка 500. Возможно нет связи!', type: 'warning',})
        }
        return err
    })

