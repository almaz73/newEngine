import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/workflow/'
export const useWorkflowStore = defineStore("workflowStore", {
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
        async getBuyWorkflows(params: any) {
            const res = await getBuyWorkflows(params)

            if (res.data) this.list = res.data.deals
            else this.list = []
            return res.data
        },
    }
})

function getBuyWorkflows(params) {
    const {filter, limit, mainFilter, offset, search} = params
    let url = path + 'GetBuyWorkflows';
    if (filter) url += '?filter=' + filter
    if (offset) url += '&offset=' + offset
    if (search) url += '&search=' + search
    if (mainFilter) url += '&mainFilter=' + mainFilter
    if (limit) url += '&limit=' + limit
    return axios.get(url).then(res => res)
}

