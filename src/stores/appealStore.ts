import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/appeals/list/'
export const useAppealStore = defineStore("appealStore", {
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
        async getAppeals(params: any) {
            const res = await getAppeals(params)

            if (res.data) this.list = res.data.appeals
            else this.list = []
            return res.data
        },
    }
})

function getAppeals(params: any) {
    const {filter, limit, mainFilter, offset, search} = params
    let url = path;
    if (filter) url += '?filter=' + filter
    if (offset) url += '&offset=' + offset
    if (search) url += '&search=' + search
    if (mainFilter) url += '&mainFilter=' + mainFilter
    if (limit) url += '&limit=' + limit
    return axios.get(url).then(res => res)
}

