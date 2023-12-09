import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/workflow/'
export const useWorkflowStore = defineStore("workflowStore", {
    state: () => ({
        list: [{
            rowmileage:'',
            vin:'',
            brand:'',
            model:'',
            yearReleased:'',
            userName:'',
            locationCity:'',
            location:'',
            statusTitle:'',
            clientTitle:'',
            created:'',
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
    const {filter, limit, mainFilter, id, offset, search} = params
    let url = path + 'GetBuyWorkflows';
    url += '?filter=' + filter + '&id=' + id + '&limit=' + limit + '&mainFilter=' + mainFilter + '&offset=' + offset + '&search=' + search
    return axios.get(url).then(res => res)
}

