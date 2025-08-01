import {defineStore} from 'pinia'
import axios from 'axios'
import cache from '@/utils/globalCach'

export const useGlobalStore = defineStore('globalStore', {
    state: () => ({
        /** @type {{boolean}} */
        title: '#### NEW ENGINE',
        version: '0.10.0',
        leftMenuindex: null, // выбранное меню
        isAuthorized: false,
        isMobileView: false, // мобильный режим
        isShowPanel: false, // при узких экранах, гамбургер открывает левую панель
        isNarrowPanel: true, // Когда панель не раскрывается с описанием
        isWaiting: false, // для ромашки ожидания
        isNeedTop: false, // показ кнопки прокрутки наверх
        listOpenModals: [], // для закрытия по esc
        appealIdForShowCounter : 392800, // посещаемость
        account: {
            // настройки аккаунта
            lastName: '',
            firstName: '',
            roleTitle: '',
            orgElementName: '',
            storage: '',
            role:'',
            avatarUrl:'',
            dateTime: ''
        },
        steps: [
          // приходит с сервера внутри workflowsChain
        ]
    }),
    actions: {
        setTitle(title: string) {
            document.title = this.title = title
        },
        async signIn(login: string, password: string) {
            return await axios.post(`/api/account/signin`, {login, password}).then(q => q)
        },
        async signOut(): Promise<void> {
            await axios.post(`/api/account/signout`).then(q => q)
        },
        async getBrands() {
            if (cache.getBrands) return cache.getBrands // список статичный - кэшируем
            const res = await axios.get(`/api/auto/getBrands`).then(q => q)
            return (cache.getBrands = res.data)
        },
        async getModels(brandId: number) {
            // @ts-ignore
            if (cache['getModels' + brandId]) return cache['getModels' + brandId] // список статичный - кэшируем
            const res = await axios.get(`/api/auto/getModels?brandId=${brandId}`).then(q => q)
            // @ts-ignore
            return (cache['getModels' + brandId] = res.data)
        },
        async getPlaces() {
            if (cache.getPlaces) return cache.getPlaces // список статичный - кэшируем
            const res = await axios.get(`/api/location/get/list`).then(q => q)
            return (cache.getPlaces = res.data)
        },
        async getOrganizations(isActive?: boolean){
            if (cache.getOrganizations && isActive === undefined) return cache.getOrganizations // список статичный — кэшируем
          
            const res = await axios.get('/api/orgelement/get/organizations', {
              params: isActive !== undefined ? { IsActive: isActive } : undefined
            }).then(q => q)
          
            return (cache.getOrganizations = res.data)
        },
        async getTreatments() {
            if (cache.getTreatments) return cache.getTreatments // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentsource/get/list`).then(q => q)
            return (cache.getTreatments = res.data)
        },
        async getRoles(params:{roles:any, filterType:number}) {
            if (cache['getModels' + params.roles.join('-')]) return cache['getModels' + params.roles.join('-')] // список статичный - кэшируем
            // @ts-ignore
            let link = String(params.roles.reduce((acc: string, el: string) => (acc + 'roles=' + el + '&'), '?'))
            if (params.filterType) link += '&filterType=' + String(params.filterType)
            const res = await axios.get(`/api/user/list/policy${link}`).then(q => q)
            // @ts-ignore
            return (cache['getModels' + params.roles.join('-')] = res.data)
        },
        async getTeatments() {
            if (cache.getTeatments) return cache.getTeatments // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentsource/get/list`).then(q => q)
            return (cache.getTeatments = res.data)
        },
        async getColors(type = 10) {
            const res = await axios.get(`/api/bodycolor/getbytype/${type}`).then(res => res)
            return res.data
        },
        async getAppeals() {
            if (cache.getAppeals) return cache.getAppeals // список статичный - кэшируем
            const res = await axios.get(`/api/appeals/get/types`).then(q => q)
            return (cache.getAppeals = res.data)
        },
        async getUsers(link: string = '') {
            if (cache['getUsers' + link]) return cache['getUsers' + link] // список статичный - кэшируем
            const res = await axios.get(`/api/appeals/get/filter/users?${link}`).then(q => q)
            return (cache['getUsers' + link] = res.data)
        },
        async getenabledemployeers() {
            if (cache.getenabledemployeers) return cache.getenabledemployeers // список статичный - кэшируем
            const res = await axios.get(`/api/user/getenabledemployeers`).then(q => q)
            return (cache.getenabledemployeers = res.data)
        },
        async getClientStatuses() {
            if (cache.getClientStatuses) return cache.getClientStatuses // список статичный - кэшируем
            const res = await axios.get(`/api/lead/get/client/statuses`).then(q => q)
            return (cache.getClientStatuses = res.data)
        },
        async getTreatmentSources() {
            if (cache.getTreatmentSources) return cache.getTreatmentSources // список статичный - кэшируем
            const res = await axios.get(`/api/treatmentSource/getTreatmentSources`).then(q => q)
            return (cache.getTreatmentSources = res.data)
        },
        async getTradeInDirectionTypes() {
            if (cache.getTradeInDirectionTypes) return cache.getTradeInDirectionTypes // список статичный - кэшируем
            const res = await axios.get(`/api/buy/GetTradeInDirectionTypes`).then(q => q)
            return (cache.getTradeInDirectionTypes = res.data)
        },
        async getServerTime() {
            const res = await axios.get(`/api/deal/getServerTime`).then(q => q)
            return res.data
        },

        async getTradeinDirectionTypes() {
            if (cache.getTradeinDirectionTypes) return cache.getTradeinDirectionTypes // список статичный - кэшируем
            const res = await axios.get(`/api/Lead/GetTradeinDirectionTypes`).then(q => q)
            return (cache.getTradeinDirectionTypes = res)
        },
        async getComments(type: number, id: number) {
            const res = await axios.get(`/api/comment/${type}/${id}`)
            return res.data
        },
        async sendComment(obj: any) {
            console.log('obj = ',obj)
           //  return await axios.post('/api/comment/', obj).then(q => q)
        },
        async getTypeCompanies() {
            if (cache.getTypeCompanies) return cache.getTypeCompanies // список статичный - кэшируем
            const res = await axios.get(`/api/lead/get/types/company`).then(q => q)
            return (cache.getTypeCompanies = res.data)
        },
        async getTypesLegal() {
            if (cache.getTypesLegal) return cache.getTypesLegal // список статичный - кэшируем
            const res = await axios.get(`/api/lead/get/types/legal`).then(q => q)
            return (cache.getTypesLegal = res.data)
        },
        async getPositions() {
            if (cache.getPositions) return cache.getPositions // список статичный - кэшируем
            const res = await axios.get(`/api/lead/get/types/position`).then(q => q)
            return (cache.getPositions = res.data)
        },
        async getFias(text: string) {
            return await axios.get(`/api/address/get/list?search=${text}`).then(q => q)
        },
        async getByInn(inn: string) {
            return await axios.get(`/api/lead/getLegalByInn?inn=${inn}`).then(q => q)
        },
        async getLegalByInn(inn: string) {
            return await axios.get(`/api/lead/getLegalByInn?inn=${inn}`).then(q => q)
        },
        async saveLegal(params: any) {
            return await axios.post('/api/lead/add/legal', params).then(q => q)
        },
        async saveClientDocument(params: any) {
            return await axios.post('/api/client-documents/add', params).then(q => q)
        },

        // сохранение файла
        async uploadFile(params: { fileName: string; roles: number[]; access: string; file: any }) {
            let fd: FormData = new FormData();
            fd.append('file', params.file);
            return await axios.post(`/api/file/upload-auto-photo?fileName=${params.fileName}&roles=&access=public`, fd).then(q => q)
        },
        async deleteFile(id: number) {
            return await axios.delete('/api/autophoto/'+id).then(q => q)
        },
        async attachFile(params: any) {// прикрепление сохраненного файла
            return await axios.post(`/api/autophoto`, params).then(q => q)
        },
        async rotatoPhoto(id: number, type: number) {
            return await axios.post(`/api/autophoto/photorotate/${id}/${type}`).then(q => q)
        },
        async rotatoPhotoInspection(idSmall: number,idBig: number, type: number) {
            return await axios.post(`/api/inspectionitem/photosrotate/${idSmall},${idBig}/${type}`).then(q => q)
        },
        async getWorkflowHistory(id: number) { // история изменения при оценки автомобиля
            return await axios.get(`/api/workflow/getWorkflowHistory?workflowId=${id}`)
        },
        async getLeadActivityHistory(id: number) {
            if (cache['getLeadActivityHistory'+id]) return cache['getLeadActivityHistory'+id]
            const res = await axios.get(`/api/Lead/GetLeadActivityHistory/${id}`)
            return (cache['getLeadActivityHistory'+id] = res.data)
        },
        async getBuyCategories() {
            if (cache.getBuyCategories) return cache.getBuyCategories // список статичный - кэшируем
            const res = await axios.get(`/api/Buy/GetBuyCategories`).then(q => q)
            return (cache.getBuyCategories = res.data)
        },
        async getRoleCategories() {
            if (cache.getRoleCategories) return cache.getRoleCategories // список статичный - кэшируем
            const res = await axios.get(`/api/Enum/GetRoleCategories`).then(q => q)
            return (cache.getRoleCategories = res.data)
        },
        async getWorkflowLeadTypesForDataMart() {
            if (cache.GetWorkflowLeadTypesForDataMart) return cache.GetWorkflowLeadTypesForDataMart
            const res = await axios.get(`/api/Enum/GetWorkflowLeadTypesForDataMart`).then(q => q)
            return (cache.GetWorkflowLeadTypesForDataMart = res.data)
        },
        async getDataMart(params: any) {
            const res = await axios.get(`/api/Dashboard/GetDataMart`,
                {params, paramsSerializer: {indexes: true}}).then(q => q)
            return res.data
        },
        async getDepartmentsByOrgs(orgIds: number[]) {
            let link = ''
            orgIds && orgIds.forEach((el: number) => link += '&orgIds=' + el)
            const res = await axios
                .get(`/api/OrgElement/GetDepartmentsByOrgs`,
                    {params: {orgIds}, paramsSerializer: {indexes: true}}).then(q => q)
            return res.data
        },


        async getRegularlyQueryingEvents() {
            const res = await axios.get(`/api/notification/getUnread`).then(q => q)
            return res.data
        },
        async readedQueryingEvents(id: number) {
            return await axios.post(`/api/notification/${id}/markReaded`).then(q => q)
        },
    }
})
