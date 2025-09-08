import {defineStore} from "pinia";
import cache from '@/utils/globalCach'
import axios from "axios";

export const usePubStore = defineStore("pubStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getBrands() {
            if (cache['getBrands']) return cache['getBrands']
            const res = await axios.get(`/api/auto/getBrands`)
            return (cache['getBrands'] = res)
        },
        async getModels(id) {
            return await axios.get(`/api/auto/getModels?brandId=${id}`)
        },
        async getGenerations(id) {
            return await axios.get(`/api/auto/getGenerations?modelId=${id}`)
        },

    }
})
