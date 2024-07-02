import {defineStore} from "pinia";
import axios from "axios";

export const useDealStore = defineStore("dealStore", {
    state: () => ({
        list: [{
            rowmileage: '',
            vin: '',
            brand: '',
            model: '',
            yearReleased: '',
            userName: '',
            locationCity: '',
            location: '',
            statusTitle: '',
            clientTitle: '',
            created: '',
        }]
    }),
    actions: {
        async getDeals(params: any) {
            const res = await getDeals(params)

            if (res.data) this.list = res.data.deals
            else this.list = []
            return res.data
        },
    }
})

function getDeals(params: any) {
    const {filter, limit, mainFilter, offset, search} = params
    let url = '/api/workflow/GetBuyWorkflows';
    if (filter) url += '?filter=' + filter
    if (offset) url += '&offset=' + offset
    if (search) url += '&search=' + search
    if (mainFilter) url += '&mainFilter=' + mainFilter
    if (limit) url += '&limit=' + limit
    return axios.get(url).then(res => res)
}

