import {defineStore} from "pinia";
import axios from "axios";

export const useReportStore = defineStore("reportStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getEmployee(filter: any) {
            const url: string = '/api/report/callcenter/employee?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getMonthly(filter: any) {
            const url: string = '/api/report/callcenter/monthly?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getArchiveClients(filter: any) {
            const url: string = '/api/report/callcenter/appeal/archivingreasons?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getCalls(filter: any) {
            const url: string = '/api/report/callcenter/phone/event?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getByuouts(filter: any) {
            const url: string = '/api/report/call-center/buy'
            const res = await axios.get(url, {params: filter}).then(res => res)
            return res.data
        },
        async getLocation(filter: any) {
            const url: string = '/api/location/get/list'
            const res = await axios.get(url, {params: filter}).then(res => res)
            return res.data
        },
        async getActual(filter: any) {
            const url: string = '/api/report/callcenter/appeal/days?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getDepartments() {
            const res = await axios.get('/api/orgelement/get/departmens').then(res => res)
            return res.data
        },
        async getSourceAppeals(params: any) {
            const {department, month, year} = params
            const res = await axios.get(
                `/api/report/common/appeal-source?department=${department}&month=${month}&year=${year}`)
                .then(res => res)
            return res.data
        },
        async getwWorkflowLeadTypes() {
            const res = await axios.get('/api/deal/getworkflowleadtypesforavailabledeals')
                .then(res => res)
            return res.data
        },
        async getDealsReport(params: any) {
            let req = '?startDate=' + params.startDate + '&endDate=' + params.endDate
            params.orgIds.forEach(el => req += '&orgId=' + el)
            params.workflowLeadTypes.forEach(el => req += '&workflowLeadType=' + el)
            const res = await axios.get('/api/report/GetDealsReport' + req)
                .then(res => res)
            return res.data
        },

    }
})
