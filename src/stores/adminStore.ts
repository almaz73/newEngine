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
        },
        async addColor(row: any) {
            const res = await addColor(row)
            return res.data
        },
        async deleteColor(row: any) {
            const res = await deleteColor(row)
            return res.data
        },
        async switchuser(id: number) {
            const res = await switchuser(id)
            return res.data
        },
        async getUserForModal(id: number) {
            const res = await getUserForModal(id)
            return res.data
        },
        async getDepartments() {
            const res = await getDepartments()
            return res.data
        },
        async getUserLocarions() {
            const res = await getUserLocarions()
            return res.data
        },
        async getTimeZones() {
            const res = await getTimeZones()
            return res.data
        },
        async getUserRoles() {
            const res = await getUserRoles()
            return res.data
        },
        async saveUser(obj: any) {
            const res = await saveUser(obj)
            return res.data
        },
        async getUserHistory(id: number) {
            const res = await getUserHistory(id)
            return res.data
        },

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


function addColor(row: any) {
    const params = {entityType: '10'}
    Object.assign(params, row)
    return axios.post('api/bodycolor', params).then(res => res)
}

function deleteColor(id: number) {
    return axios.delete('api/bodycolor/' + id).then(res => res)
}

function switchuser(id: number) {
    return axios.post(`api/user/${id}/switchuser`).then(res => res)
}

function getUserForModal(id: number) {
    return axios.get(`api/user/get?id=${id}`).then(res => res)
}

function getDepartments() {
    return axios.get('api/user/get/departmens').then(res => res)
}

function getUserLocarions() {
    return axios.get('api/user/get/locations').then(res => res)
}

function getTimeZones() {
    return axios.get('api/user/get/time-zones').then(res => res)
}

function getUserRoles() {
    return axios.get('api/user/get/roles').then(res => res)
}

function saveUser(obj: any) {
    return axios.post(`api/user/save`, obj).then(res => res)
}

function getUserHistory(id: number) {
    return axios.get(`api/user/get/audit?id=${id}`).then(res => res)
}

