import {defineStore} from 'pinia'
import axios from 'axios'
import cache from '@/utils/globalCach'

export const useDealStore = defineStore('dealStore', {
    state: () => ({
        deal: {dealId: null, inspectionId: 0} // используем модель, чтобы иметь доступ в модулях
    }),
    actions: {
        async getDeals(params: any, noCach: boolean ) {
            const {filter, limit, mainFilter, offset, search} = params
            let url = '/api/workflow/GetBuyWorkflows'
            if (filter) url += '?filter=' + filter
            if (offset) url += '&offset=' + offset
            if (search) url += '&search=' + search
            if (mainFilter) url += '&mainFilter=' + mainFilter
            if (limit) url += '&limit=' + limit

            if (!noCach && cache['getDeals' + url]) return cache['getDeals' + url]
            localStorage.setItem('dealListTime', Date.now())
            const res = await axios.get(url).then(res => res)
            return (cache['getDeals' + url] = res.data)
        },
        async getDeal(id: string, noCach: boolean) {
            if (!noCach && cache.getDeal) return cache.getDeal
            const res = await axios.get('/api/deal/' + id)
            return (cache.getDeal = res.data)
        },
        async getStatuses(id: number) {
            const res = await axios.get(`/api/deal/${id}/getStatuses`)
            return res.data
        },
        async setConfirmation(params: { comment: string; buyId: number; newStatus: number, priceDemanded: number }) {
            return await axios.post('/api/buy/status/set', params).then(q => q)
        },
        async clientRefusal(params: { id: number; price: number; }) {
            return await axios.post(`/api/deal/${params.id}/changeClientPrice/${params.price}`, params).then(q => q)
        },
        async getBuyEditHistory(id: number) {
            if (cache.getBuyEditHistory) return cache.getBuyEditHistory
            const res = await axios.get('/api/History/GetBuyEditHistory?buyId=' + id)
            return (cache.getBuyEditHistory = res.data)
        },

        async getInspection(id: number, noCach: boolean) {
            // @ts-ignore
            if (!noCach && cache['getInspection' + id]) return cache['getInspection' + id]
            const res = await axios.get('/api/inspection/' + id)
            // @ts-ignore
            return (cache['getInspection' + id] = res.data)
        },

        // проверка гиббдд
        async getGibddCache(type: number, vin: number) {
            return await axios.get(`/api/auto/getGibddCache?type=${type}&vin=${vin}`)
        },
        async getGibddCaptcha() {
            return await axios.get(`/api/auto/getGibddCaptcha`)
        },
        async getDataByParams(params: any) {
            let link = '?captcha=' + params.captcha + '&captchaToken=' + encodeURIComponent(params.captchaToken)
            link += '&type=' + params.type + '&vin=' + params.vin
            return await axios.post('/api/auto/setGibddCaptcha' + link, params)
        },

        async getDealsByVin(id: number) {
            if (cache.getDealsByVin) return cache.getDealsByVin
            const res = await axios.get('/api/deal/getDealsByVin/' + id)
            // @ts-ignore
            return (cache.getDealsByVin = res)
        },

        async setBuyCategory(dealId: number, id: number) {
            return await axios.post(`/api/buy/setBuyCategory?dealId=${dealId}&categoryId=${id}`)
        },
        async changeTradeInDirectionType(dealId: number, id: number) {
            return await axios.post(`/api/Deal/ChangeTradeInDirectionType?dealId=${dealId}&directionTypeId=${id}`)
        },

        // шаюлоны документов для скачивания / разные варианты
        async getNecessaryDocs(dealId: number) {
            // cскачивает бинарник, и название файла
            return await axios.get(`/api/print/buy/${dealId}/printnecessarydocs`)
        },
        async getBuyPrint(dealId: number, form: string) {
            return await axios.get(`/api/print/buy/get?form=${form}&id=${dealId}`)
        },
        async getDealPrint(dealId: number, path: string) {
            // скачивает файлом
            window.location.href = `/api/print/buy/${path}/${dealId}`
        },
        async getSimularCars(params: any) {
            const res = await axios.get(`/api/workflow/analystCarHelp?filter=${params}`)
            return res.data
        },
        async getBuyAutoEditHistory(id: number) {
            const res = await axios.get('/api/History/GetBuyAutoEditHistory?buyId=' + id)
            return res.data
        },
        async getSimularDeals(dealId: number) {
            return await axios.get(`/api/deal/getSimilarDeals/${dealId}`)
        },
        async GetInspectionComplect(inspectionId: number) {
            const res = await axios.get(`/api/inspectionitem/GetInspectionComplect/${inspectionId}`)
            return res.data
        },
        async getInspectionComplectation(dealId: number) {
            const res = await axios.get(`/api/inspectionitem/GetInspectionComplectation/${dealId}`)
            return res.data
        },
        async getPhoto(dealId: number, noCach: true) {
            // @ts-ignore
            if (!noCach && cache['getPhoto' + dealId]) return cache['getPhoto' + dealId]
            const res = await axios.get(`/api/autophoto/getbydeal/${dealId}?showArchive=false`)
            // @ts-ignore
            return (cache['getPhoto' + dealId] = res)
        },


        //:::: Лист осмотра :::://
        async getInspectionitem(inspectionId: number) {
            if (cache['getInspectionitem']) return cache['getInspectionitem']
            const res = await axios.get(`/api/inspectionitem/getcountchanged/${inspectionId}`)
            return (cache['getInspectionitem'] = res.data)
        },
        async getPlanedWork(inspectionId: number) {
            if (cache['getPlanedWork']) return cache['getPlanedWork']
            const res = await axios.get(`/api/plannedwork/getcountchanged/${inspectionId}`)
            return (cache['getPlanedWork'] = res)
        },
        async getDamages() {
          if (cache['getDamages']) return cache['getDamages']
          const res = await axios.get(`/api/damageitem/`)
          return (cache['getDamages'] = res)
        },
        async getPlannedWork(dealId: number) {
          if (cache['getPlannedWork' + dealId]) return cache['getPlannedWork' + dealId]
          const res = await axios.get(`/api/plannedwork/getbydeal/${dealId}`)
          return (cache['getPlannedWork' + dealId] = res)
        },
        async getDWorkChanged(inspectionId: number) {
            return await axios.get(`/api/plannedwork/getchanged/${inspectionId}`)
        },
        async getservicework(dealId: number) {
            return await axios.get(`/api/servicework/getservicework/${dealId}`)
        },
        async saveServiceworks(params: number) {
            return await axios.post(`/api/servicework/`, params)
        },
        async getDamageitem() {
            if (cache['getDamageitem']) return cache['getDamageitem']
            const res= await axios.get(`/api/damageitem/`)
            return (cache['getDamageitem'] = res)
        },
        async getWorks() {
            if (cache['getWorks']) return cache['getWorks']
            const res= await axios.get(`/api/work/`)
            return (cache['getWorks'] = res)
        },
        async getByInspection(inspectionId: number) {
            if (cache['getWorks']) return cache['getWorks']
            const res = await axios.get(`/api/inspectionitem/getbyinspection/${inspectionId}`)
            return (cache['getWorks'] = res)
        },
        async getChangedItems(inspectionId: number, category: number) {
            if (cache['getChangedItems' + inspectionId + category]) return cache['getChangedItems' + inspectionId + category]
            const res = await axios.get(`/api/inspectionitem/getchanged/${inspectionId}/${category}`)
            return (cache['getChangedItems' + inspectionId + category] = res.data)
        },
        async getExploitationHistoryTypes() {
            if (cache['getExploitationHistoryTypes']) return cache['getExploitationHistoryTypes']
            const res = axios.get(`/api/Auto/GetExploitationHistoryTypes`)
            return (cache['getExploitationHistoryTypes'] = res)
        },
        async getbyinspectionbycategory(autoId: number, categoryId: number) {
            return await axios.get(`/api/inspectionitem/getbyinspectionbycategory/${autoId}/${categoryId}`)
        },
        async saveInspection(params: { params: any }) {
            return await axios.post('/api/inspectionitem/', params).then(q => q)
        },
        async saveInspection40(params: { params: any }) {
            return await axios.post('/api/inspectionitem/buy', params).then(q => q)
        },
        async getbycategories(arr: Array) {
            let link=''
            arr.forEach((el:number)=>link+='categories='+el+'&')
            return await axios.get(`/api/InspectionItemType/getbycategories?`+link)
        },
        async savePostExploitationHistoryType(params: { params: any }) {
            return await axios.post('/api/Auto/PostExploitationHistoryType', params).then(q => q)
        },
        async savePlannedWork(params: { params: any }) {
            return await axios.post('/api/plannedwork/', params).then(q => q)
        },
        async deletePlannedWork (id: number) {
            return await axios.get(`/api/plannedwork/delete/${id}`)
        },
        async getbycto() {
            if (cache['getbycto']) return cache['getbycto']
            const res = await axios.get(`/api/work/getbycto`)
            return (cache['getbycto'] = res)
        },
        async getWorkflowHistory(dealId: number) {
            return await axios.get(`/api/workflow/getWorkflowHistory?workflowId=${dealId}`)
        },
        async GetMarkupMatrix(storageId: number, fullSumm: number, buyCategory: number) {
          if (cache['GetMarkupMatrix' + storageId + fullSumm + buyCategory]) return cache['GetMarkupMatrix' + storageId + fullSumm + buyCategory]
          const res = await axios.get(`/api/MarkupMatrix/GetByLocation?locationId=${storageId}&priceMarket=${fullSumm}&buyCategory=${buyCategory}`)
          return (cache['GetMarkupMatrix' + storageId + fullSumm + buyCategory] = res.data)
        },
        async GetMarkupCategory(locationId: number, fullSumm: number) {
            if (cache['GetMarkupCategory' + locationId + fullSumm]) return cache['GetMarkupCategory' + locationId + fullSumm]
            const res = await axios.get(`/api/MarkupCategory/GetByLocation?locationId=${locationId}&priceMarket=${fullSumm}`)
            return (cache['GetMarkupCategory' + locationId + fullSumm] = res.data)
        },
        async GetTurnoverRate(locationId: number) {
            if (cache['GetTurnoverRate'+locationId]) return cache['GetTurnoverRate'+locationId]
            const res = await axios.get(`/api/TurnoverRate/GetByLocation?locationId=${locationId}`)
            return (cache['GetTurnoverRate'+locationId] = res)
        },
        async GetMileageRate(locationId: number) {
            if (cache['GetMileageRate'+locationId]) return cache['GetMileageRate'+locationId]
            const res = await axios.get(`/api//MileageRate/GetByLocation?locationId=${locationId}`)
            return (cache['GetMileageRate'+locationId] = res)
        },
        async getWorkflowHistory(dealId: number) {
            return await axios.get(`/api/workflow/getWorkflowHistory?workflowId=${dealId}`)
        },
        async getCommissionFee() {
            if (cache['getCommissionFee']) return cache['getCommissionFee']
            const res = await axios.get(`/api/buy/get/available/commission-fee`)
            return (cache['getCommissionFee'] = res)
        },
        async getMaxPriceByLocation(storageId: number) {
            return await axios.get(`/api/Analytic/GetMaxPriceByLocation?locationId==${storageId}`)
        },
        async getLocations(workflowLeadType: number | null, BuyTypes: number | null, DealStatus: number | null, UserId: number | null) {
            return await axios.get(`/api/Location/GetLocations?workflowLeadType=${workflowLeadType}&BuyTypes=${BuyTypes}&DealStatus=${DealStatus}&UserId=${UserId}`);
        },
        async setLocations(dealId: number | null, storageId: number | null) {
            return await axios.post(`/api/buy/set/location/${dealId}/${storageId}`);
        },

        async saveCheckList(params: {params: any}) {
            return await axios.post("/api/Buy/SaveCheckList", params);
        }

    }
})

