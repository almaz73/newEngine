import {defineStore} from "pinia";
import axios from "axios";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getUsers(params: any) {
            const res = await getUsers(params)
            return res.data
        },
    }
})

function getUsers(params: any) {
    const url:string = 'api/user/GetUsers?filter=' + JSON.stringify(params)
    return axios.get(url).then(res => res)
}

