import {defineStore} from 'pinia'
import axios from 'axios'

export const useDesktopStore = defineStore('desktopStore', {
    state: () => ({}),
    actions: {
        async saveAppeal(obj) {
            const res = await saveAppeal(obj)
            return res
        },
        async saveAppealComission(obj) {
            const res = await saveAppealComission(obj)
            return res
        }
        ,
        async saveAppealSalon(obj) {
            const res = await saveAppealSalon(obj)
            return res
        }
    }
})

function saveAppeal(obj) {
    return axios.post(`api/communication/callCenterCommunication`, obj).then((res) => res)
}

function saveAppealComission(obj) {
    return axios.post(`api/commission/add`, obj).then((res) => res)
}

function saveAppealSalon(obj) {
    return axios.post(`api/salon-deal/add`, obj).then((res) => res)
}
