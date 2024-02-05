import {defineStore} from "pinia";
import axios from "axios";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getUsers(filter: any) {
            const res = await getUsers(filter)
            return res.data
        },
        async getColors() {
            const res = await getColors()
            return res.data
        }
    }
})

function getUsers(filter: any) {
    const url: string = 'api/user/GetUsers?filter=' + JSON.stringify(filter)
    return axios.get(url).then(res => res)
}

function getColors() {
    const url: string = 'api/bodycolor/getbytype/10'
    return axios.get(url).then(res => res)
}


