import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/appeals/list/'
export const useAppealStore = defineStore("appealStore", {
    state: () => ({
        list: [{}]
    }),
    actions: {
        async getAppeals(params: any) {
            const res = await getAppeals(params)

            if (res.data) this.list = res.data.appeals
            else this.list = []
            return res.data
        },
        async getAppeal(id: number) {
            const res = await axios.get('api/workflow/' + id)
            return res.data
        },
        async getEventAppeal(id: number) {
            const res = await axios.get('api/event/get/items/appeal?id=' + id)
            return res.data
        },
        async getHistoryAppeal(id: number, type: number) {
            console.log('? ?  ?id, type', id, type)
            const res = await axios.get(`api/History/getHistory/${id}/${type}`)
            console.log('  0 000 00res', res)
            return res.data
        }

    }
})

function getAppeals(params: any) {
    // кучковый способ запросов
    const newUrl = Object.entries(params).reduce((sum, el) => {
        if (el[0] != 'filter' && el[1]) return sum + '&' + el[0] + '=' + el[1]
        else return sum
    }, path + '?filter={}')
    return axios.get(newUrl).then(res => res)
}

