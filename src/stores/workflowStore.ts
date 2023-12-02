import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/workflow/GetBuyWorkflows/'
export const useWorkflowStore = defineStore("workflowStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getBuyWorkflows(params) {
            const res = await getBuyWorkflows(params)
            if (res.data) this.list = res.data.content
            return res.data
        },
    }
})

function getBuyWorkflows(params) {
    const {filter, limit, mainFilter, id, offset, search} = params
    let url = path + 'GetBuyWorkflows';
    url += '?filter=' + filter + '&limit=' + limit + '&mainFilter=' + mainFilter + '&id=' + id + '&offset=' + offset + '&search=' + search
    // url += 'api/workflow/GetBuyWorkflows?filter=%7B%7D&id=&limit=25&mainFilter=10&offset=0&search='
    return axios.get(url).then(res => res)
}

