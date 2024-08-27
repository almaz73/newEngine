import {defineStore} from "pinia";
import axios from "axios";
import cache from '@/utils/globalCach'

const path = '/api/sell/get/list'
export const useWarehousStore = defineStore("warehousStore", {
    state: () => ({
        list: [{}]
    }),
    actions: {
        async getWarehouses(params: any, noCach: boolean) {
            const newUrl = Object.entries(params).reduce((sum, el) => {
                if (el[0]  && el[1]) return sum + '&' + el[0] + '=' + el[1]
                else return sum
            }, path + '?zzzz')

            if (!noCach && cache['getWarehouses' + newUrl]) return cache['getWarehouses' + newUrl]
            localStorage.setItem('warehousListTime', Date.now())

            const res = await axios.get(newUrl).then(res => res)

            return (cache['getWarehouses' + newUrl] = res.data)
        },
        async getCharts() {
            return axios.get(`/api/sell/get/chart/storage?quickFilter=10&skip=0`).then(res => res.data)
        }
    }
})

