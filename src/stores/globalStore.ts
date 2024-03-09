import {defineStore} from 'pinia'
import axios from 'axios'
import cach from '@/utils/globalCach'

export const useGlobalStore = defineStore('globalStore', {
    state: () => ({
        /** @type {{boolean}} */
        title: '#### NEW ENGINE',
        version: '0.9.8',
        isAuthorized: false,
        isMobileView: false, // мобильный режим
        isShowPanel: false, // при узких экранах, гамбургер открывает левую панель
        isNarrowPanel: true, // Когда панель не раскрывается с описанием
        isWaiting: false, // для ромашки ожидания
        isNeedTop: false, // показ кнопки прокрутки наверх
        oldPath: '', // запоминаем перед переходом на страницу логирования, чтобы вернуться
        listOpenModals: [], // для закрытия по esc
        account: {
            // настройки аккаунта
            lastName: '',
            firstName: '',
            roleTitle: '',
            orgElementName: '',
            storage: ''
        },
        steps: [
            {name: 'Обращение', done: true},
            {name: 'Осмотр', done: true},
            {name: 'Оценка', done: true},
            {name: 'Договор', done: true},
            {name: 'Банк'},
            {name: 'Выкуп'},
        ]
    }),
    actions: {
        setTitle(title: string) {
            document.title = this.title = title
        },
        async signIn(login: string, password: string) {
            return await axios.post(`/api/account/signin`, {login, password}).then(q => q)
        },
        async signOut(): Promise<void> {
            await axios.post(`/api/account/signout`).then(q => q)
        },
        async getBrands() {
            if (cach.getBrands) return cach.getBrands // список статичный - кэшируем
            const res = await axios.get(`/api/auto/getBrands`).then(q => q)
            return (cach.getBrands = res.data)
        },
        async getModels(brandId: number) {
            // @ts-ignore
            if (cach['getModels' + brandId]) return cach['getModels' + brandId] // список статичный - кэшируем
            const res = await axios.get(`/api/auto/getModels?brandId=${brandId}`).then(q => q)
            // @ts-ignore
            return (cach['getModels' + brandId] = res.data)
        },
        async getPlaces() {
            if (cach.getPlaces) return cach.getPlaces // список статичный - кэшируем
            const res = await axios.get(`/api/location/get/list`).then(q => q)
            return (cach.getPlaces = res.data)
        },
        async getOrganizations() {
            if (cach.getOrganizations) return cach.getOrganizations // список статичный - кэшируем
            const res = await axios.get(`/api/orgelement/get/organizations`).then(q => q)
            return (cach.getOrganizations = res.data)
        },
        async getTreatments() {
            if (cach.getTreatments) return cach.getTreatments // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentsource/get/list`).then(q => q)
            return (cach.getTreatments = res.data)
        },
        async getRoles(roles: any) {
            // @ts-ignore
            if (cach['getModels' + roles.join('-')]) return cach['getModels' + roles.join('-')] // список статичный - кэшируем

            const params = roles.reduce((acc: string, el: string) => (acc + 'roles=' + el + '&'), '?')
            const res = await axios.get(`/api/user/list/policy${params}`).then(q => q)
            // @ts-ignore
            return (cach['getModels' + roles.join('-')] = res.data)
        },
        async getTeatments() {
            if (cach.getTeatments) return cach.getTeatments // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentsource/get/list`).then(q => q)
            return (cach.getTeatments = res.data)
        },
        async getColors() {
            const res = await axios.get('/api/bodycolor/getbytype/10').then(res => res)
            return res.data
        },
        async getAppeals() {
            if (cach.getAppeals) return cach.getAppeals // список статичный - кэшируем
            const res = await axios.get(`/api/appeals/get/types`).then(q => q)
            return (cach.getAppeals = res.data)
        },
        async getUsers() {
            if (cach.getUsers) return cach.getUsers // список статичный - кэшируем
            const res = await axios.get(`/api/appeals/get/filter/users`).then(q => q)
            return (cach.getUsers = res.data)
        },
        async getClientStatuses() {
            if (cach.getClientStatuses) return cach.getClientStatuses // список статичный - кэшируем
            const res = await axios.get(`/api/lead/get/client/statuses`).then(q => q)
            return (cach.getClientStatuses = res.data)
        },
        async getTreatmentSources() {
            if (cach.getTreatmentSources) return cach.getTreatmentSources // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentSource/getTreatmentSources`).then(q => q)
            return (cach.getTreatmentSources = res.data)
        },
    }
})
