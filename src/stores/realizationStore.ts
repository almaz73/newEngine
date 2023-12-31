import {defineStore} from "pinia";
import axios from "axios";

const path = 'api/realization/get/list'
export const useRealizationStore = defineStore("realizationStore", {
    state: () => ({
        list: [{}]
    }),
    actions: {
        async getRealization(params: any) {
            const res = await getRealization(params)

            if (res.data) this.list = res.data.items
            else this.list = []
            return res.data
        },
    }
})

function getRealization(params: any) {
    // кучковый способ запросов
    const newUrl = Object.entries(params).reduce((sum, el) => {
        if (el[0] != 'filter' && el[1]) return sum + '&' + el[0] + '=' + el[1]
        else return sum
    }, path + '?z=0')
    return axios.get(newUrl).then(res => res)
}

