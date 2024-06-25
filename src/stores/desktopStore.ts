import {defineStore} from 'pinia'
import axios from 'axios'

export const useDesktopStore = defineStore('desktopStore', {
    state: () => ({}),
    actions: {
        async saveAppeal(obj: any) {
            return await saveAppeal(obj)
        },
        async saveAppealComission(obj: any) {
            return await saveAppealComission(obj)
        },
        async saveAppealSalon(obj: any) {
            return await saveAppealSalon(obj)
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
        async getByPolicy(roles: []) {
            return axios.get(`/api/user/list/policy`, {params: roles}).then((res) => res.data)
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
        }
    }
})

function saveAppeal(obj: any) {
    return axios.post(`/api/communication/callCenterCommunication`, obj).then((res) => res)
}

function saveAppealComission(obj: any) {
    console.log('obj', obj)
    return axios.post(`/api/commission/add`, obj).then((res) => res)
}

function saveAppealSalon(obj: any) {
    return axios.post(`/api/salon-deal/add`, obj).then((res) => res)
}

