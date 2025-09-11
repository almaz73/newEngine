import {defineStore} from "pinia";
import cache from '@/utils/globalCach.ts'
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
        async getModels(id:number) {
            return await axios.get(`/api/auto/getModels?brandId=${id}`)
        },
        async getGenerations(id:number) {
            return await axios.get(`/api/auto/getGenerations?modelId=${id}`)
        },
        async getModifications(id:number) {
            return await axios.get(`/api/auto/getModifications?generationId=${id}`)
        },
        async getComplectations(id:number) {
            return await axios.get(`/api/auto/getComplectations?modificationId=${id}`)
        },
        async saveExternalAppeal(params: any) {
            return await axios.post(`/api/Lead/PostExternalAppeal`, params)
        },


    }
})
