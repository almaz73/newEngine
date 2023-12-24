import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/workflow/'
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
        async getDeal(params: any) {
            const res = await getDeal(params)

            if (res.data) this.list = res.data.deals
            else this.list = []
            return res.data
        },
    }
})

function getDeal(params: any) {
    const {filter, limit, mainFilter, offset, search} = params
    let url = path + 'GetBuyWorkflows';
    if (filter) url += '?filter=' + filter
    if (offset) url += '&offset=' + offset
    if (search) url += '&quickSearch=' + search
    if (mainFilter) url += '&mainFilter=' + mainFilter
    if (limit) url += '&limit=' + limit
    return axios.get(url).then(res => res)
}

