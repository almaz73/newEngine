import axios from "axios";
import {useGlobalStore} from "@/stores/globalStore";
import router from "@/router";

axios.interceptors.response.use(resp => resp
    , err => {
        console.log('Перехватываею все ошибкиь err=', err)
        console.log(" err.request.status = ", err.request.status)

        if (!err.request.status && err.code === "ERR_NETWORK") {
            // возможно у токена вышел срок, перекидываем на cтраницу авторизации
            useGlobalStore().isAuthorized = false
            router.push('login')
        }
        return err
    })

