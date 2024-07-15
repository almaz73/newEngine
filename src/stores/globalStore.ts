import {defineStore} from 'pinia'
import axios from 'axios'
import cache from '@/utils/globalCach'

export const useGlobalStore = defineStore('globalStore', {
    state: () => ({
        /** @type {{boolean}} */
        title: '#### NEW ENGINE',
        version: '0.9.19',
        isAuthorized: false,
        isMobileView: false, // мобильный режим
        isShowPanel: false, // при узких экранах, гамбургер открывает левую панель
        isNarrowPanel: true, // Когда панель не раскрывается с описанием
        isWaiting: false, // для ромашки ожидания
        isNeedTop: false, // показ кнопки прокрутки наверх
        listOpenModals: [], // для закрытия по esc
        account: {
            // настройки аккаунта
            lastName: '',
            firstName: '',
            roleTitle: '',
            orgElementName: '',
            storage: '',
            role:''
        },
        steps: [
          // приходит с сервера внутри workflowsChain
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
            if (cache.getBrands) return cache.getBrands // список статичный - кэшируем
            const res = await axios.get(`/api/auto/getBrands`).then(q => q)
            return (cache.getBrands = res.data)
        },
        async getModels(brandId: number) {
            // @ts-ignore
            if (cache['getModels' + brandId]) return cache['getModels' + brandId] // список статичный - кэшируем
            const res = await axios.get(`/api/auto/getModels?brandId=${brandId}`).then(q => q)
            // @ts-ignore
            return (cache['getModels' + brandId] = res.data)
        },
        async getPlaces() {
            if (cache.getPlaces) return cache.getPlaces // список статичный - кэшируем
            const res = await axios.get(`/api/location/get/list`).then(q => q)
            return (cache.getPlaces = res.data)
        },
        async getOrganizations() {
            if (cache.getOrganizations) return cache.getOrganizations // список статичный - кэшируем
            const res = await axios.get(`/api/orgelement/get/organizations`).then(q => q)
            return (cache.getOrganizations = res.data)
        },
        async getTreatments() {
            if (cache.getTreatments) return cache.getTreatments // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentsource/get/list`).then(q => q)
            return (cache.getTreatments = res.data)
        },
        async getRoles(roles: any) {
            // @ts-ignore
            if (cache['getModels' + roles.join('-')]) return cache['getModels' + roles.join('-')] // список статичный - кэшируем

            const params = roles.reduce((acc: string, el: string) => (acc + 'roles=' + el + '&'), '?')
            const res = await axios.get(`/api/user/list/policy${params}`).then(q => q)
            // @ts-ignore
            return (cache['getModels' + roles.join('-')] = res.data)
        },
        async getTeatments() {
            if (cache.getTeatments) return cache.getTeatments // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentsource/get/list`).then(q => q)
            return (cache.getTeatments = res.data)
        },
        async getColors(type = 10) {
            const res = await axios.get(`/api/bodycolor/getbytype/${type}`).then(res => res)
            return res.data
        },
        async getAppeals() {
            if (cache.getAppeals) return cache.getAppeals // список статичный - кэшируем
            const res = await axios.get(`/api/appeals/get/types`).then(q => q)
            return (cache.getAppeals = res.data)
        },
        async getUsers() {
            if (cache.getUsers) return cache.getUsers // список статичный - кэшируем
            const res = await axios.get(`/api/appeals/get/filter/users`).then(q => q)
            return (cache.getUsers = res.data)
        },
        async getenabledemployeers() {
            if (cache.getenabledemployeers) return cache.getenabledemployeers // список статичный - кэшируем
            const res = await axios.get(`/api/user/getenabledemployeers`).then(q => q)
            return (cache.getenabledemployeers = res.data)
        },
        async getClientStatuses() {
            if (cache.getClientStatuses) return cache.getClientStatuses // список статичный - кэшируем
            const res = await axios.get(`/api/lead/get/client/statuses`).then(q => q)
            return (cache.getClientStatuses = res.data)
        },
        async getTreatmentSources() {
            if (cache.getTreatmentSources) return cache.getTreatmentSources // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentSource/getTreatmentSources`).then(q => q)
            return (cache.getTreatmentSources = res.data)
        },
        async пetTradeInDirectionTypes() {
            if (cache.пetTradeInDirectionTypes) return cache.пetTradeInDirectionTypes // список статичный - кэшируем
            const res = await axios.get(`/api/buy/GetTradeInDirectionTypes`).then(q => q)
            return (cache.пetTradeInDirectionTypes = res.data)
        },
        async getServerTime() {
            const res = await axios.get(`/api/deal/getServerTime`).then(q => q)
            return res.data
        },

        async getTradeinDirectionTypes() {
            if (cache.getTradeinDirectionTypes) return cache.getTradeinDirectionTypes // список статичный - кэшируем
            const res = await axios.get(`/api/Lead/GetTradeinDirectionTypes`).then(q => q)
            return (cache.getTradeinDirectionTypes = res)
        },
    }
})
