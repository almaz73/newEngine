import {defineStore} from 'pinia'
import axios from 'axios'

export const useDesktopStore = defineStore('desktopStore', {
    state: () => ({}),
    actions: {
        async saveAppeal(obj: any) {
            return await saveAppeal(obj)
        },
        async saveAppealComission(obj: any) {
            return await saveAppealComission(obj)
        },
        async saveAppealSalon(obj: any) {
            return await saveAppealSalon(obj)
        },
        async getLeadsByPhone(tel: string) {
            return axios.get(`/api/lead/GetLeadsByPhone/` + tel).then((res) => res.data)
        },
        async getAutoVIN(vin: string) {
            return await axios.get(`/api/auto/vin/` + vin).then((res) => res.data)
        },
        async getHostessUser() {
            return await axios.get(`/api/user/get`).then((res) => res.data)
        },
        async getDepartmentsByPolicy() {
            return await axios.get(`/api/OrgElement/GetDepartmentsByPolicy`).then((res) => res.data)
        },
        async getLocation() {
            return await axios.get(`/api/location`).then((res) => res.data)
        },
        async getByPolicy(roles: Array) {
            return axios.get(`/api/user/list/policy` , {params: roles}).then((res) => res.data)
        },

        //api/user/list/policy?roles=50&roles=51&roles=52&roles=20&roles=21&roles=120&roles=150
        async getHostess() {
            return await axios.get(`/api/appeals/hostess/list?date=08.04.2024&limit=15&mainFilter=30&offset=0`).then((res) => res.data)
        }



        //https://dev.autonet.pro/api/appeals/hostess/list?date=08.04.2024&limit=15&mainFilter=30&offset=0
    }
})

function saveAppeal(obj: any) {
    return axios.post(`/api/communication/callCenterCommunication`, obj).then((res) => res)
}

function saveAppealComission(obj: any) {
    return axios.post(`/api/commission/add`, obj).then((res) => res)
}

function saveAppealSalon(obj: any) {
    return axios.post(`/api/salon-deal/add`, obj).then((res) => res)
}

