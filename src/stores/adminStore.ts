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

        async addColor(row: any,entityType = '10') {
            const params = {entityType}
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
        async saveDamage(params:any) {
            cache.getDomage = null
            const res = await axios.post('/api/damageitem',params).then(q => q)
        },
        async deleteDamage(deleteId: number) {
            cache.getDomage = null
            const res = await axios.delete(`/api/damageitem/${deleteId}`).then(q => q)
            return res.data
        },
        async getBanks() {

            if (cache.getBanks) return cache.getBanks
            const res = await axios.get('/api/bank/').then(q => q)
            return (cache.getBanks = res.data)
        },
        async saveBanks(obj: any) {
            const res = await axios.post('/api/bank', obj).then(q => q)
            return res.data
        },
        async deleteBanks(deleteId: number) {
            const res = await axios.delete(`/api/bank/${deleteId}`).then(q => q)
            return res.data
        },
        async getBankFilials(id: number | null) {
            const res = await axios.get(`/api/bankitem/get/list?bankId=${id}`).then(q => q)
            return res.data
        },
        async deleteBankFilials(id: number | null) {
            const res = await axios.delete(`/api/bankitem/deletebyid/${id}?bankId=`).then(q => q)
            return res.data
        },
        async getAddress(query:string, count = 5){
            // НЕТ ДОСТУПА
            console.log({query,count})
            const  params = {query,count}
            const res = await axios.post(`https://dadata.ru/api/v2/suggest/address`,params).then(q => q)
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
        async deleteTire(id: number) {
            return await axios.delete('/api/wheelmodel/' + id).then(q => q)
        },
        async getMarkupCategory(params: any) {
            let link = '&limit=' + params.limit || 25
            if (params.search) link += '&' + params.search
            return await axios.get('/api/markupCategory/?offset=' + params.offset + link).then(res => res.data)
        },
        async getDepartmentsWithBuyLocations(orgId: number) {
            return await axios.get('/api/OrgElement/GetDepartmentsWithBuyLocations?orgId=' + orgId).then(res => res.data)
        },
        async saveMarkupCategory(params) {
            const res = await axios.post('/api/markupCategory', params).then(q => q)
            return res.data
        },
        async deleteMarkupCategory(id: number) {
            const res = await axios.delete(`/api/markupCategory/${id}`).then(q => q)
            return res.data
        },
        async getMarkupMatrix(params: any) {
            let link = '&limit=' + params.limit || 25
            if (params.search) link += '&' + params.search
            return await axios.get('/api/MarkupMatrix/?offset=' + params.offset + link).then(res => res.data)
        },
        async saveMarkupMatrix(params: any) {
            const res = await axios.post('/api/MarkupMatrix',params).then(q => q)
            return res.data
        },
        async deleteMarkupMatrix(id: number) {
            const res = await axios.delete(`/api/MarkupMatrix/${id}`).then(q => q)
            return res.data
        },
        async getMarkupHistory(params: any) {
            let link = '&limit=' + params.limit || 25
            if (params.search) link += '&' + params.search
            return await axios.get('/api/MileageRate/?offset=' + params.offset + link).then(res => res.data)
        },
        async saveMarkupHistory(params: any) {
            const res = await axios.post('/api/MileageRate',params).then(q => q)
            return res.data
        },
        async deleteMarkupHistory(id: number) {
            const res = await axios.delete(`/api/MileageRate/${id}`).then(q => q)
            return res.data
        },
        async switchActiveMarkupHistory(id: number) {
            const res = await axios.post(`/api/MileageRate/SwitchMileagerate/${id}`).then(q => q)
            return res.data
        },
        async getTurnoverRate(params: any) {
            let link = '&limit=' + params.limit || 25
            if (params.search) link += '&' + params.search
            return await axios.get('/api/TurnoverRate/?offset=' + params.offset + link).then(res => res.data)
        },
        async getTurnoverTypeRates() {
            return await axios.get('/api/TurnoverRate/GetRates').then(res => res.data)
        },
        async saveTurnoverRate(params: any) {
            const res = await axios.post('/api/TurnoverRate',params).then(q => q)
            return res.data
        },
        async deleteTurnoverRate(id: number) {
            const res = await axios.delete(`/api/TurnoverRate/${id}`).then(q => q)
            return res.data
        },
        async switchActiveTurnoverRate(id: number) {
            const res = await axios.post(`/api/TurnoverRate/SwitchTurnover/${id}`).then(q => q)
            return res.data
        },
        async getBrands(entityType = 20) {
            return await axios.get(`/api/brands/?entityType=${entityType}`).then(res => res.data)
        },
        async getMarks(brend:string,entityType = 20) {
            return await axios.get(`/api/brands/${brend}/?entityType=${entityType}`).then(res => res.data)
        },
        async saveBrands(params:any) {
            return await axios.post(`/api/carmodel/add`,params).then(res => res.data)
        },
        async deleteBrands(id:number){
            const res = await axios.delete(`/api/carmodel/${id}`).then(q => q)
            return res.data 
        },
        async getLocation(IsDeleted:boolean,IsActive:boolean){
            return  await axios.get(`/api/Location/GetAll?IsDeleted=${IsDeleted}&IsActive=${IsActive}`).then(res => res.data)
        },
        async saveLocation(params:any) {
            return await axios.post(`/api/location`,params).then(res => res.data)
        },
        async switchLocation(id: number){
            const res = await axios.post(`/api/Location/SwitchLocation?locationId=${id}`).then(q => q)
            return res.data
        },
        async deleteLocation(id:number){
            const res = await axios.delete(`/api/location/${id}`).then(q => q)
            return res.data 
        },
        async getAllOrgWithDep() {
            if (cache.getAllOrgWithDep) return cache.getAllOrgWithDep
            const res = await axios.get('/api/orgElement/').then(q => q)
            return (cache.getAllOrgWithDep = res.data)
        },
        async getCreditProgram(){
            return  await axios.get(`/api/creditprogram/`).then(res => res.data)
        },
        async saveCreditProgram(params:any){
            return await axios.post(`/api/creditprogram`,params).then(res => res.data)
        },
        async deleteCreditProgram(id:number){
            const res = await axios.delete(`/api/creditprogram/${id}`).then(q => q)
            return res.data 
        },
        async getBankFilials2(id: number | null) {
            const res = await axios.get(`/api/bankitem/${id}`).then(q => q)
            return res.data
        },
        async saveTreatment(params:any){
            cache.getTreatments = null
            return await axios.post(`/api/TreatmentSource`,params).then(res => res.data)
        },
        async deleteTreatment(id:number){
            const res = await axios.delete(`/api/TreatmentSource/${id}`).then(q => q)
            return res.data 
        },
        async getSMSTemplates(){
            const res = await axios.get(`/api/sms/getTemplates`).then(q => q)
            return res.data
        },
        async saveSMSTemplates(params:any){
            const res = await axios.post(`/api/sms/addTemplate`,params).then(q => q)
            return res.data
        },
        async deleteSMSTemplates(id:number){
            const res = await axios.delete(`/api/sms/${id}`).then(q => q)
            return res.data
        },
        async getReasonTemplates(){
            const res = await axios.get(`/api/ReasonTemplates/getItems/`).then(q => q)
            return res.data
        },
        async saveReasonTemplates(params:any){
            const res = await axios.post(`/api/ReasonTemplates/addTemplate`,params).then(q => q)
            return res.data
        },
        async deleteReasonTemplates(id:number){
            const res = await axios.delete(`/api/ReasonTemplates/${id}`).then(q => q)
            return res.data
        },
        async getCertification(id:number){
            const res = await axios.get(`/api/certification/${id}`).then(q => q)
            return res.data
        },
        async saveCertification(params:any){
            const res = await axios.post(`/api/certification`,params).then(q => q)
            return res.data
        },
        async deleteCertification(id:number){
            const res = await axios.delete(`/api/certification/${id}`).then(q => q)
            return res.data
        },
    }
    
})
