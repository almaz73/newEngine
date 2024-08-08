import { defineStore } from 'pinia'
import axios from 'axios'
import cache from '@/utils/globalCach'

export const useDealStore = defineStore('dealStore', {
  state: () => ({
    deal: {} // используем модель, чтобы иметь доступ в модулях
  }),
  actions: {
    async getDeals(params: any) {
      const { filter, limit, mainFilter, offset, search } = params
      let url = '/api/workflow/GetBuyWorkflows'
      if (filter) url += '?filter=' + filter
      if (offset) url += '&offset=' + offset
      if (search) url += '&search=' + search
      if (mainFilter) url += '&mainFilter=' + mainFilter
      if (limit) url += '&limit=' + limit
      const res = await axios.get(url).then(res => res)
      return res.data
    },
    async getDeal(id: string) {
      const res = await axios.get('/api/deal/' + id)
      return res.data
    },
    async getStatuses(id: number) {
      const res = await axios.get(`/api/deal/${id}/getStatuses`)
      return res.data
    },
    async setConfirmation(params: { comment: string; buyId: number; newStatus: number }) {
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
    }

  }
})

