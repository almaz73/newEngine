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
        async getHostess() {
            return await axios.get(`/api/user/get`).then((res) => res.data)
        },
        async getDepartmentsByPolicy() {
            return await axios.get(`/api/OrgElement/GetDepartmentsByPolicy`).then((res) => res.data)
        }
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

