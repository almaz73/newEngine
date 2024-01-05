import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/call/getCallList'
export const useCallsStore = defineStore("callsStore", {
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
        async getCalls(params: any) {
            const res = await getCalls(params)
            if (res.data) this.list = res.data.calls
            else this.list = []
            return res.data
        },
    }
})

function getCalls(params: any) {
    const {filter, limit, mainFilter, offset, search} = params
    let url = path;
    if (filter) url += '?filter=' + filter
    if (offset) url += '&offset=' + offset
    if (search) url += '&quickSearch=' + search
    if (mainFilter) url += '&mainFilter=' + mainFilter
    if (limit) url += '&limit=' + limit
    return axios.get(url).then(res => res)
}

