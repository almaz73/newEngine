import {defineStore} from "pinia";
import axios from "axios";

export const useAppealStoreStatus = defineStore("appealStoreStatus", {
    state: () => ({
        currentRow: null
    }),
    actions: {
        async setStatus(params: { comment: string; id: number; newStatus: number; }) {
            const res = await axios.post('/api/deal/' + params.id + '/updatedealstatus', params).then(q => q)
            return res.data
        },
        async getReasonTemplates(workflowLeadType: number) {
            const res = await axios.get('/api/ReasonTemplates/getTemplates/10/'+workflowLeadType).then(q => q)
            return res.data
        },
        async getAppealArchiveRequestReasons(id: number) {
            const res = await axios.get('/api/deal/GetAppealArchiveRequestReasons?id='+ id).then(q => q)
            return res.data
        },
        async setArchive(params: { comment: string; id: number; status: number; reason: number[]}) {
            const {comment, id, status, reason} = params
            let link = '?comment='+comment+'&status='+status+'&id='+id
            reason.forEach(el=>link+='&reasons='+el)
            const res = await axios.post('/api/deal/appealToArchiveRequest' + link).then(q => q)
            return res.data
        },
        async setDirectionType(params: { comment: string; appealId: number; directionType: number; }) {
            const link = '?appealId='+params.appealId+'&directionType='+params.directionType;  // ???
            const res = await axios.post('/api/appeals/SetDirectionType'+link, params).then(q => q)
            return res.data
        },

    }
})
