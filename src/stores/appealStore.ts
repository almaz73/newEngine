import {defineStore} from "pinia";
import axios from "axios";
import cach from "@/utils/globalCach";

const path = 'api/appeals/list/'
export const useAppealStore = defineStore("appealStore", {
    state: () => ({}),
    actions: {
        async getAppeals(params: any) {
            const res = await getAppeals(params)
            return res.data
        },
        async getAppeal(id: number) {
            const res = await axios.get('api/workflow/' + id)
            return res.data
        },
        async getEvents(id: number, noCach: boolean) {
            // @ts-ignore
            if (!noCach && cach['getEventsAppeal' + id]) return cach['getEventsAppeal' + id]
            const res = await axios.get('api/event/get/items/appeal?id=' + id)
            // @ts-ignore
            return (cach['getEventsAppeal' + id] = res.data)
        },
        async getHistory(id: number) {
            const res = await axios.get(`api/History/getHistory/${id}/20`)
            return res.data
        },
        async getStatuses(id: number) {
            const res = await axios.get(`api/deal/${id}/getStatuses`)
            return res.data
        },
        async getRoles(id: number) {
            const res = await axios.get(`api/user/list/policy?WorkflowLeadType=${id}`).then(q => q)
            return res.data
        },
        async sendSMS(obj: any) {
            return await axios.post('api/sms/', obj).then(q => q, err => err)
        },
        async getSMS(id: number, noCach: boolean) {
            // @ts-ignore
            if (!noCach && cach['getSMS' + id]) return cach['getSMS' + id]
            const res = await axios.get(`api/sms/getSMSItems/${id}`).then(q => q)
            // @ts-ignore
            return (cach['getSMS' + id] = res.data)
        },
        async getSmsTemplates() {
            if (cach.getSmsTemplates) return cach.getSmsTemplates
            const res = await axios.get('api/sms/getTemplates').then(q => q)
            return (cach.getSmsTemplates = res.data)
        },
        async getComments(id: number) {
            const res = await axios.get(`api/comment/20/${id}`)
            return res.data
        },
        async saveComment(obj: any) {
            return await axios.post('api/comment', obj).then(q => q)
        },
        async closeComment(id: number) {
            const res = await axios.get(`api/event/${id}/updateeventstatus`)
            return res.data
        },
        async saveEvent(obj: any) {
            const res = await axios.post('api/event', obj).then(q => q)
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

