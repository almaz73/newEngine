import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/appeals/list/'
export const useAppealStore = defineStore("appealStore", {
    state: () => ({
    }),
    actions: {
        async getAppeals(params: any) {
            const res = await getAppeals(params)
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
            const res = await axios.get(`api/History/getHistory/${id}/${type}`)
            return res.data
        },
        async getStatuses(id: number) {
            const res = await axios.get(`api/deal/${id}/getStatuses`)
            return res.data
        },
        async getRoles(id: number) {
            const res = await axios.get(`api/user/list/policy?WorkflowLeadType=${id}`).then(q => q)
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

