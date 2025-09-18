// Service Worker регистрация
import {onMounted} from "vue";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('sw_pub.js')
            .then(function (registration) {
                console.log('ServiceWorker зарегистрирован успешно:', registration)
            })
            .catch(function (error) {
                console.log('Ошибка регистрации ServiceWorker:', error)
            })
    })
}

