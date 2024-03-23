import {defineStore} from "pinia";
import axios from "axios";

export const useReportStore = defineStore("reportStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getEmployee(filter: any) {
            const url: string = '/api/report/callcenter/employee?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },

    }
})
