import {defineStore} from 'pinia'
import axios from 'axios'
import cash from '@/utils/globalCash'

export const useGlobalStore = defineStore('globalStore', {
    state: () => ({
        /** @type {{boolean}} */
        isAuthorized: true,
        isMobileView: false, // мобильный режим
        isShowPanel: false, // при узких экранах, гамбургер открывает левую панель
        isNarrowPanel: true, // Когда панель не раскрывается с описанием
        isWaiting: false, // для ромашки ожидания
        isNeedTop: false, // показ кнопки прокрутки наверх
        account: {
            // настройки аккаунта
            lastName: '',
            firstName: '',
            roleTitle: '',
            orgElementName: '',
            storage: ''
        }
    }),
    actions: {
        async signIn(login: string, password: string) {
            return await signIn(login, password)
        },
        async signOut(): Promise<void> {
            await signOut()
        },
        async getBrands() {
            if (cash.getBrands) return cash.getBrands // список статичный - кэшируем
            const res = await getBrands()
            return (cash.getBrands = res.data)
        },
        async getModels(brandId: number) {
            if (cash['getModels' + brandId]) return cash['getModels' + brandId] // список статичный - кэшируем
            const res = await getModels(brandId)
            return (cash['getModels' + brandId] = res.data)
        },
        async getPlaces() {
            if (cash.getPlaces) return cash.getPlaces // список статичный - кэшируем
            const res = await getPlaces()
            return (cash.getPlaces = res.data)
        },
        async getOrganizations() {
            if (cash.getOrganizations) return cash.getOrganizations // список статичный - кэшируем
            const res = await getOrganizations()
            return (cash.getOrganizations = res.data)
        },
        async getRoles(roles) {
            if (cash['getModels' + roles.join('-')]) return cash['getModels' + roles.join('-')] // список статичный - кэшируем
            const res = await getRoles(roles)
            return (cash['getModels' + roles.join('-')] = res.data)
        },
        async getTeatments() {
            if (cash.getTeatments) return cash.getTeatments // список статичный - кэшируем
            const res = await getTeatments()
            return (cash.getTeatments = res.data)
        },
        async getColors() {
            if (cash.getColors) return cash.getColors // список статичный - кэшируем
            const res = await getColors()
            return (cash.getColors = res.data)
        },
    }
})

function signIn(login: string, password: string) {
    return axios.post(`/api/account/signin`, {login, password}).then(
        (res) => res,
        (err) => err
    )
}

function signOut() {
    return axios.post(`/api/account/signout`).then((res) => res)
}

function getBrands() {
    return axios.get(`api/auto/getBrands`).then((res) => res)
}

function getModels(brandId) {
    return axios.get(`api/auto/getModels?brandId=${brandId}`).then((res) => res)
}

function getPlaces() {
    return axios.get(`api/location/get/list`).then((res) => res)
}

function getOrganizations() {
    return axios.get(`api/orgelement/get/organizations`).then((res) => res)
}

function getRoles(roles) {
    const params = roles.reduce((acc, el) => (acc += 'roles=' + el + '&'), '?')
    return axios.get(`api/user/list/policy${params}`).then((res) => res)
}

function getTeatments() {
    return axios.get(`api/treatmentsource/get/list`).then((res) => res)
}

function getColors() {
    return axios.get(`api/bodycolor/getbytype/10`).then((res) => res)
}


