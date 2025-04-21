import {defineStore} from "pinia";
import axios from "axios";

export const useAppealStoreStatus = defineStore("appealStoreStatus", {
    state: () => ({
        currentRow: null
    }),
    actions: {
        async setStatus(params: { comment: string; id: number; newStatus: number; }) {
            return await axios.post('/api/deal/' + params.id + '/updatedealstatus', params).then(q => q)
        },
        async getReasonTemplates(workflowLeadType: number) {
            const res = await axios.get('/api/ReasonTemplates/getTemplates/10/' + workflowLeadType).then(q => q)
            return res.data
        },
        async getAppealArchiveRequestReasons(id: number) {
            const res = await axios.get('/api/deal/GetAppealArchiveRequestReasons?id=' + id).then(q => q)
            return res.data
        },
        async setArchive(params: { comment: string; id: number; status: number; reason: number[] }) {
            const {comment, id, status, reason} = params
            let link = '?comment=' + comment + '&status=' + status + '&id=' + id
            reason.forEach(el => link += '&reasons=' + el)
            return await axios.post('/api/deal/appealToArchiveRequest' + link).then(q => q)
        },
        async setDirectionType(params: { comment: string; appealId: number; directionType: number; }) {
            const link = '?appealId=' + params.appealId + '&directionType=' + params.directionType;  // ???
            return await axios.post('/api/appeals/SetDirectionType' + link, params).then(q => q)
        },
        async setBuyCategory(params: { comment: string; appealId: number; buyCategory: number; }) {
            const link = '?appealId=' + params.appealId + '&buyCategory=' + params.buyCategory;  // ???
            return await axios.post('/api/appeals/setBuyCategory' + link, params).then(q => q)
        },
        async setToArchive(params: { comment: string; id: number; status: number; reasons: number[] }) {
            const {comment, id, status, reasons} = params
            let link = '?comment=' + comment + '&status=' + status + '&id=' + id
            reasons.forEach(el => link += '&reasons=' + el)
            return await axios.post('/api/deal/appealToArchiveRequest' + link).then(q => q)
        },
        async getUsersSearch(roles: any) {
            let link= roles.join('&roles=')
            return await axios.get('/api/user/search?byOrganization=true&roles=' + link).then(q => q)
        },

        // комиссионные
        async setComissionStatus(params: { id: number, status: number, title: string }) {
            return await axios.post('/api/commission/set/status', params).then(q => q)
        },
        async getComission(id: number) {
            const res = await axios.get(`/api/commission/get?id=${id}`)
            return res.data
        },
        async getComissionStatuses(id: number) {
            const res = await axios.get(`/api/commission/get/status/available?id=${id}`)
            return res.data
        },
        async getArchiveRequestReasons(){
            const res = await axios.get(`/api/Enum/GetArchiveRequestReasons`)
            return res.data
        }

    }
})
