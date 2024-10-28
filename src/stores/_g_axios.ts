import axios from "axios";
import {useGlobalStore} from "@/stores/globalStore";
import router from "@/router";
import {ElMessage} from "element-plus";

axios.interceptors.response.use(resp => resp
    , err => {
        console.warn(' П е р е х в а т ы в а ю   в с е   о ш и б к и')
        console.warn(" err.request.status = ", err)

        if (!navigator.onLine) {
            console.log('Связи нет, сайт работает офлайн!')
            // return ElMessage({message: 'Связи нет, сайт работает офлайн!', type: 'warning',})
        }

        if (!err.request.status && err.code === "ERR_NETWORK") {
            // возможно у токена вышел срок, перекидываем на страницу авторизации

            console.log('возможно у токена вышел срок, = ')

            localStorage.removeItem('account')
            useGlobalStore().isAuthorized = false
            navigator.onLine && router.push('login')
        }

        if (err.code === 'ERR_BAD_REQUEST') {
            console.log('err = ',err)
          if (err.response.statusText === 'Unauthorized') return ElMessage.error('Вы не авторизовались')
          if (err.response.data) ElMessage({ message: err.response.data.errorText, type: 'error',
            showClose: true, duration: 7000 })
        }
        if (err.request.status === 404 && (!err.request.response)) {
            ElMessage({message: 'Ошибка 404. Не найдено ', type: 'warning'})
        }
        if (err.request.status === 500) {
            ElMessage({message: 'Ошибка 500. Внутрення ошибка сервера', type: 'warning',})
        }
        if (err.request.status === 404 && err.response.statusText === 'Not Found' && useGlobalStore().isAuthorized) {
            console.log('9 - - - - - 99 = ',9 - - - - - 99)
            // после потери связи с сервером

        }
        return err
    })

