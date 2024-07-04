import { defineStore } from 'pinia'
import axios from 'axios'

export const useDealStore = defineStore('dealStore', {
  state: () => ({}),
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
    }

  }
})

