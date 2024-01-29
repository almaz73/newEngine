import {defineStore} from 'pinia'
import axios from 'axios'

export const useDesktopStore = defineStore('desktopStore', {
    state: () => ({}),
    actions: {
        async saveAppeal(obj) {
            const res = await saveAppeal(obj)
            return res.data
        }
    }
})

function saveAppeal(obj) {
    return axios.post(`api/communication/callCenterCommunication`, obj).then((res) => res)
}
