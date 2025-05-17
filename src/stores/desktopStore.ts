import {defineStore} from 'pinia'
import axios from 'axios'

export const useDesktopStore = defineStore('desktopStore', {
    state: () => ({}),
    actions: {
        async saveAppeal(obj: any) {
            return axios.post(`/api/communication/callCenterCommunication`, obj).then((res) => res)
        },
        async saveAppealComission(obj: any) {
            return axios.post(`/api/commission/add`, obj).then((res) => res)
        },
        async saveAppealSalon(obj: any) {
            return axios.post(`/api/salon-deal/add`, obj).then((res) => res)
        },
        async getLeadsByPhone(tel: string) {
            return axios.get(`/api/lead/GetLeadsByPhone/` + tel).then((res) => res.data)
        },
        async getAutoVIN(vin: string) {
            return await axios.get(`/api/auto/vin/` + vin).then((res) => res.data)
        },
        async getHostessUser() {
            return await axios.get(`/api/user/get`).then((res) => res.data)
        },
        async getDepartmentsByPolicy() {
            return await axios.get(`/api/OrgElement/GetDepartmentsByPolicy`).then((res) => res.data)
        },
        async getLocation() {
            return await axios.get(`/api/location`).then((res) => res.data)
        },
        async getHostess(params: any) {
            let filters = ''
            if (params.date) filters = '&date=' + params.date
            if (params.mainFilter) filters += '&mainFilter=' + params.mainFilter
            if (params.clientStatus) filters += '&clientStatus=' + params.clientStatus
            if (params.hostesId) filters += '&hostesId=' + params.hostesId
            return await axios.get(`/api/appeals/hostess/list?limit=15&offset=0` + filters).then((res) => res.data)
        },
        async saveHostess(params: any) {
            return await axios.post(`/api/workflow/`, params).then((res) => res.data)
        },
        async saveEditHostes(obj: any) {
            return axios.post(`/api/lead`, obj).then(res => res.data)
        },
        async saveEditHostesFinish(params: any) {
            const filter = `?dateEnd=${params.dateEnd}&dateStart=${params.dateStart}&id=${params.id}`
            return await axios.post(`/api/event/changeeventdates/` + filter).then((res) => res.data)
        },
        async getHostesUser() {
            return axios.get(`/api/user/list/policy?roles=53`).then(res => res.data)
        },
        async getleadworkflowsbydate(date: Date) {
            return axios.get(`/api/workflow/getleadworkflowsbydate/${date}?limit=12&offset=0`).then(res => res.data)
        },
        async getResponsible(locationId: number, workflowLeadType: number) {
            return axios.get(`/api/orgElement/users/${locationId}/${workflowLeadType}`).then(res => res.data)
        },


        async getDashboardInfoSalesManager(filter: any) {
            console.log('filter = ', filter)
            return axios.get(`/api/dashboard/getDashboardInfoSalesManager/?filter=%7B%22type%22:%22day%22,%22date%22:%2215.05.2025%22%7D`).then(res => res.data)
        },
        async getDashboardInfoBuyer(month: number) {
            return axios.get(`/api/workflow/getDashboardInfoBuyer?id=&month=${month}`).then(res => res.data)
        },
        async getDashboardInfoSales(month: number) {
            console.log('month = ', month)
            return axios.get(`/api/workflow/getDashboardInfoSales/${month}`).then(res => res.data)
        },
        async getLeadWorkflowsByStatus(filter: string, limit: number = 25, offset: number = 0) {
            return axios.get(`/api/workflow/getLeadWorkflowsByStatus?limit=${limit}&offset=${offset}&filter=${filter}`)
                .then(res => res.data)
        },
        async getEventsByStatus(filter: string, limit: number = 25, offset: number = 0) {
            return axios.get(`/api/event/getEventsByStatus?limit=${limit}&offset=${offset}&filter=${filter}`)
                .then(res => res.data)
        }


    }


})



