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
            return await getLeadsByPhone(tel)
        },
        async getAutoVIN(vin: string) {
            return await getAutoVIN(vin)
        }
    }
})

function saveAppeal(obj: any) {
    return axios.post(`api/communication/callCenterCommunication`, obj).then((res) => res)
}

function saveAppealComission(obj: any) {
    return axios.post(`api/commission/add`, obj).then((res) => res)
}

function saveAppealSalon(obj: any) {
    return axios.post(`api/salon-deal/add`, obj).then((res) => res)
}

function getLeadsByPhone(val: string) {
    return axios.get(`api/lead/GetLeadsByPhone/` + val).then((res) => res.data)
}

function getAutoVIN(val: string) {
    return axios.get(`api/auto/vin/` + val).then((res) => res.data)
}
