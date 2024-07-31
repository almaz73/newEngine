import {defineStore} from "pinia";
import axios from "axios";
import cache from "@/utils/globalCach";

const path = '/api/appeals/list/'
export const useAppealStore = defineStore("appealStore", {
    state: () => ({
        currentRow: null
    }),
    actions: {
        async getAppeals(params: any) {
            const res = await getAppeals(params)
            return res.data
        },
        async getAppeal(id: number) {
            const res = await axios.get('/api/workflow/' + id)
            return res.data
        },
        async saveAppeal(params: number) {
            const res = await axios.post('/api/workflow/', params)
            return res.data
        },
        async getEvents(id: number, noCach: boolean) {
            // @ts-ignore
            if (!noCach && cache['getEventsAppeal' + id]) return cache['getEventsAppeal' + id]
            const res = await axios.get('/api/event/get/items/appeal?id=' + id)
            // @ts-ignore
            return (cache['getEventsAppeal' + id] = res.data)
        },
        async getHistory(id: number) {
            const res = await axios.get(`/api/History/getHistory/${id}/20`)
            return res.data
        },
        async getRoles(id: number) {
            return await axios.get(`/api/user/list/policy?WorkflowLeadType=${id}`).then(q => q)
        },
        async sendSMS(obj: any) {
            return await axios.post('/api/sms/', obj).then(q => q)
        },
        async getSMS(id: number, noCach: boolean) {
            // @ts-ignore
            if (!noCach && cache['getSMS' + id]) return cache['getSMS' + id]
            const res = await axios.get(`/api/sms/getSMSItems/${id}`).then(q => q)
            // @ts-ignore
            return (cache['getSMS' + id] = res.data)
        },
        async getSmsTemplates() {
            if (cache.getSmsTemplates) return cache.getSmsTemplates
            const res = await axios.get('/api/sms/getTemplates').then(q => q)
            return (cache.getSmsTemplates = res.data)
        },
        async saveComment(obj: any) {
            return await axios.post('/api/comment', obj).then(q => q)
        },
        async closeComment(id: number) {
            const res = await axios.get(`/api/event/${id}/updateeventstatus`)
            return res.data
        },
        async saveEvent(obj: any) {
            const res = await axios.post('/api/event', obj).then(q => q)
            return res.data
        },
        async getEvent(obj: any) {
            const name = obj.filter.replaceAll('{', '').replaceAll('}', '').replaceAll('"', '').replaceAll(':', '').replaceAll(',', '')
            // @ts-ignore
            if (cache[name]) return cache[name] // список статичный - кэшируем
            const res = await axios.get('/api/event/?filter=' + obj.filter).then(q => q)
            // @ts-ignore
            return (cache[name] = res.data)
        },
        async getLead(id: number) {
            const res = await axios.get(`/api/lead/${id}`).then(q => q)
            return res.data
        },
        async getContragent(search: number, type: number) {
            const res = await axios.get(`/api/lead/getContragent/${type}/?search=` + search).then(q => q)
            return res.data
        },
        async getIndividual(search: number) {
            const res = await axios.get(`/api/lead/find/individual?search=${search}&take=5&type=phone`).then(q => q)
            return res.data
        },
        async getInn(search: number, type: number) {
            const res = await axios.get(`/api/lead/client/find?search=${search}&type=${type}`).then(q => q)
            return res.data
        },
        // async setComissionResponsible(mcodelId: number, userId: number) {
        //     const res = await axios.get('/api/commission/set/responsible/' + modelId + '/' + userId).then(q => q)
        //     return res.data
        // },
        async changeResponsible(appealId: number, managerId: number) {
            const res = await axios.post(`/api/workflow/changeResponsible/${appealId}/${managerId}`).then(q => q)
            return res.data
        },
        async getStatusHistory(id: number) {
            const res = await axios.get(`/api/deal/${id}/getStatusHistory`).then(q => q)
            return res.data
        },
        async saveCarDetails(params: any) {
            const res = await axios.post('/api/deal/', params)
            return res.data
        },
        async getSwapPhoneHistory(id: number) {
            if (cache.getSwapPhoneHistory) return cache.getSwapPhoneHistory
            const res = await axios.get(`/api/Workflow/GetSwapPhoneHistory/?appealId=${id}`).then(q => q)
            return (cache.getSwapPhoneHistory = res.data)
        },
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

