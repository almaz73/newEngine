import {defineStore} from "pinia";
import axios from "axios";

const path = '/api/sell/get/list'
export const useWarehousStore = defineStore("warehousStore", {
    state: () => ({
        list: [{}]
    }),
    actions: {
        async getWarehouses(params: any) {
            const res = await getWarehouses(params)
            if (res.data) this.list = res.data.items
            else this.list = []
            return res.data
        },
        async getCharts() {
            return axios.get(`/api/sell/get/chart/storage?quickFilter=10&skip=0`).then(res => res.data)
        }
    }
})

function getWarehouses(params: any) {
    // кучковый способ запросов
    const newUrl = Object.entries(params).reduce((sum, el) => {
        if (el[0]  && el[1]) return sum + '&' + el[0] + '=' + el[1]
        else return sum
    }, path + '?zzzz')
    return axios.get(newUrl).then(res => res)
}

