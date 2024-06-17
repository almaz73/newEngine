import {defineStore} from "pinia";
import axios from "axios";
import cache from "@/utils/globalCach";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getUsers(filter: any) {
            const url: string = '/api/user/GetUsers?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getClients(filter: any) {
            const {quickSearch, offset, limit} = filter
            let url = '/api/lead/get/individuals';
            url += '?offset=' + offset
            if (limit) url += '&limit=' + limit
            if (quickSearch) url += '&quickSearch=' + quickSearch
            return await axios.get(url).then(res => res)
        },

        async addColor(row: any) {
            const params = {entityType: '10'}
            Object.assign(params, row)
            const res = await axios.post('/api/bodycolor', params).then(q => q)
            return res.data
        },
        async deleteColor(id: number) {
            const res = await axios.delete('/api/bodycolor/' + id).then(q => q)
            return res.data
        },
        async switchUser(id: number) {
            const res = await axios.post(`/api/user/${id}/switchuser`).then(q => q)
            return res.data
        },
        async getUserForModal(id: number) {
            const res = await axios.get(`/api/user/get?id=${id}`).then(res => res)
            return res.data
        },
        async getClientForModal(id: number) {
            const res = await axios.get(`/api/lead/get/individual?id=${id}`).then(res => res)
            return res.data
        },
        async getDepartments() {
            if (cache.getDepartments) return cache.getDepartments
            const res = await axios.get('/api/user/get/departmens').then(q => q)
            return (cache.getDepartments = res.data)
        },
        async getUserLocations() {
            if (cache.getUserLocations) return cache.getUserLocations
            const res = await axios.get('/api/user/get/locations').then(q => q)
            return (cache.getUserLocations = res.data)
        },
        async getTimeZones() {
            if (cache.getTimeZones) return cache.getTimeZones
            const res = await axios.get('/api/user/get/time-zones').then(res => res)
            return (cache.getTimeZones = res.data)
        },
        async getUserRoles() {
            if (cache.getUserRoles) return cache.getUserRoles
            const res = await axios.get('/api/user/get/roles').then(q => q)
            return (cache.getUserRoles = res.data)
        },
        async saveUser(obj: any) {
            const res = await axios.post(`/api/user/save`, obj).then(q => q)
            return res.data
        },
        async saveClient(obj: any) {
            return await axios.post(`/api/lead/add/individual`, obj).then(q => q)
        },
        async getUserHistory(id: number) {
            const res = await axios.get(`/api/user/get/audit?id=${id}`).then(q => q)
            return res.data
        },
        async getClientHistory(id: number) {
            const res = await axios.get(`/api/person/get/history?id=${id}`).then(q => q)
            return res.data
        },
        async getDocumentTypes() {
            if (cache.getDocumentTypes) return cache.getDocumentTypes
            const res = await axios.get('/api/client-documents/types').then(q => q)
            return (cache.getDocumentTypes = res.data)
        },
        async getClientDocunets(id: number) {
            const res = await axios.get(`/api/client-documents/get?personId=${id}`).then(q => q)
            return res.data
        },

        async deleteUser(id: number) {
            const res = await axios.delete('/api/user/' + id).then(q => q)
            return res.data
        },
        async getAllOrganizations() {
            if (cache.getAllOrganizations) return cache.getAllOrganizations
            const res = await axios.get('/api/orgElement/0').then(q => q)
            return (cache.getAllOrganizations = res.data)
        },
        async getOrganization(id: number) {
            if (cache.getOrganization) return cache.getOrganization
            const res = await axios.get('/api/orgelement/get?id=' + id).then(q => q)
            return (cache.getOrganization = res.data)
        },
        async getPolicy() {
            if (cache.getPolicy) return cache.getPolicy
            const res = await axios.get('/api/policy/getPolicyList').then(q => q)
            return (cache.getPolicy = res.data)
        },
        async getInspection(id: number | null) {
            let url = '/api/inspectionitemtype'
            if (id) url += '/' + id
            const res = await axios.get(url).then(q => q)
            return res.data
        },
        async saveInspection(obj: any) {
            const res = await axios.post(`/api/inspectionitemtype`, obj).then(q => q)
            return res.data
        },
        async deleteInspection(id: number) {
            const res = await axios.delete(`/api/inspectionitemtype/` + id).then(q => q)
            return res.data
        },
        async getDomage() {
            if (cache.getDomage) return cache.getDomage
            const res = await axios.get('/api/damageitem').then(q => q)
            return (cache.getDomage = res.data)
        },
        async getBanks() {
            if (cache.getBanks) return cache.getBanks
            const res = await axios.get('/api/bank/get/list').then(q => q)
            return (cache.getBanks = res.data)
        },
        async getBankFilials(id: number | null) {
            const res = await axios.get(`/api/bankitem/get/list?bankId=${id}`).then(q => q)
            return res.data
        },
        async getWork(id: number | null) {
            let url = '/api/work'
            if (id) url += '/' + id
            const res = await axios.get(url).then(q => q)
            return res.data
        },
        async saveWork(obj: any) {
            const res = await axios.post(`/api/work`, obj).then(q => q)
            return res.data
        },
        async getRepaired(type = 10) {
            const res = await axios.get('/api/repairedItem/getByType/' + type).then(q => q)
            return res.data
        },
        async deleteWork(id: number) {
            const res = await axios.delete(`/api/work/` + id).then(q => q)
            return res.data
        },
        async getMaxPrices(filter: any) {
            const {quickSearch, offset, limit} = filter
            let url = '/api/Analytic/GetMaxPrices';
            url += '?offset=' + offset
            if (limit) url += '&limit=' + limit
            if (quickSearch) url += '&quickSearch=' + quickSearch
            return await axios.get(url).then(res => res.data)
        },
        async saveMaxPrice(obj: any) {
            const res = await axios.post(`/api/Analytic/PostMaxPrice`, obj).then(q => q)
            return res.data
        },
        async deleteMaxPrice(id: number) {
            const res = await axios.delete(`/api/Analytic/DeleteMaxPrice?id=` + id).then(q => q)
            return res.data
        },
        async getMalfunctions() {
            return await axios.get('/api/Malfunctions').then(res => res.data)
        },
        async switchMalfunction(id: number) {
            const res = await axios.post(`/api/Malfunctions/${id}/ToggleBlock`).then(q => q)
            return res.data
        },
        async getMalfunctionsById(id: any) {
            return await axios.get('/api/Malfunctions/' + id).then(res => res.data)
        },
        async saveMalfunctionsById(params: any) {
            return await axios.post('/api/Malfunctions/', params).then(res => res.data)
        },
        async getAutoTypes() {
            return await axios.get('/api/auto/get/auto-types').then(res => res.data)
        },
        async getModels(brandId: number, autoType: number) {
            const res = await axios.get(`/api/auto/getModels?brandId=${brandId}&autoType=${autoType}`).then(q => q)
            return res.data
        },
        async getGenerations(id: any) {
            return await axios.get('/api/auto/getGenerations?modelId=' + id).then(res => res.data)
        },
        async getModifications(ids: any) {
            let params = '?z'
            ids.forEach((el: number) => params += '&generationId=' + el)
            return await axios.get('/api/auto/getModifications?generationId=' + params).then(res => res.data)
        },
        async deleteModification(id: number) {
            const res = await axios.delete(`/api/Malfunctions/` + id).then(q => q)
            return res.data
        },
        async getOrg(id: number) {
            return await axios.get('/api/orgelement/get?id=' + id).then(res => res.data)
        },
        async getTireBrands() {
            return await axios.get('/api/wheelbrands').then(res => res.data)
        },
        async getTires(brandId: string) {
            return await axios.get('/api/wheelbrands/' + brandId).then(res => res.data)
        },
        async getTire(modelId: string) {
            return await axios.get('/api/wheelmodel/' + modelId).then(res => res.data)
        },
        async saveTire(params: any) {
            return await axios.post('/api/wheelmodel', params).then(q => q)
        },
        async deleteTire(id:number){
            return await axios.delete('/api/wheelmodel/'+id).then(q => q)
        }
    }
})
