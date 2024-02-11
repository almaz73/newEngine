import {defineStore} from "pinia";
import axios from "axios";
import cach from "@/utils/globalCach";

export const useAdminStore = defineStore("adminStore", {
    state: () => ({
        list: []
    }),
    actions: {
        async getUsers(filter: any) {
            const url: string = 'api/user/GetUsers?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async addColor(row: any) {
            const params = {entityType: '10'}
            Object.assign(params, row)
            const res = await axios.post('api/bodycolor', params).then(q => q)
            return res.data
        },
        async deleteColor(id: number) {
            const res = await axios.delete('api/bodycolor/' + id).then(q => q)
            return res.data
        },
        async switchUser(id: number) {
            const res = await axios.post(`api/user/${id}/switchuser`).then(q => q)
            return res.data
        },
        async getUserForModal(id: number) {
            const res = await axios.get(`api/user/get?id=${id}`).then(res => res)
            return res.data
        },
        async getDepartments() {
            if (cach.getDepartments) return cach.getDepartments
            const res = await axios.get('api/user/get/departmens').then(q => q)
            return (cach.getDepartments = res.data)
        },
        async getUserLocations() {
            if (cach.getUserLocations) return cach.getUserLocations
            const res = await axios.get('api/user/get/locations').then(q => q)
            return (cach.getUserLocations = res.data)
        },
        async getTimeZones() {
            if (cach.getTimeZones) return cach.getTimeZones
            const res = await axios.get('api/user/get/time-zones').then(res => res)
            return (cach.getTimeZones = res.data)
        },
        async getUserRoles() {
            if (cach.getUserRoles) return cach.getUserRoles
            const res = await axios.get('api/user/get/roles').then(q => q)
            return (cach.getUserRoles = res.data)
        },
        async saveUser(obj: any) {
            const res = await axios.post(`api/user/save`, obj).then(q => q)
            return res.data
        },
        async getUserHistory(id: number) {
            const res = await axios.get(`api/user/get/audit?id=${id}`).then(q => q)
            return res.data
        },
        async deleteUser(id: number) {
            const res = await axios.delete('api/user/' + id).then(q => q)
            return res.data
        },
        async getAllOrganizations() {
            if (cach.getAllOrganizations) return cach.getAllOrganizations
            const res = await axios.get('api/orgElement/0').then(q => q)
            return (cach.getAllOrganizations = res.data)
        },
        async getOrganization(id: number) {
            if (cach.getOrganization) return cach.getOrganization
            const res = await axios.get('api/orgelement/get?id=' + id).then(q => q)
            return (cach.getOrganization = res.data)
        },
        async getPolicy() {
            if (cach.getPolicy) return cach.getPolicy
            const res = await axios.get('api/policy/getPolicyList').then(q => q)
            return (cach.getPolicy = res.data)
        },
        async getInspection(id: number | null) {
            let url = 'api/inspectionitemtype'
            if (id) url += id
            const res = await axios.get(url).then(q => q)
            return res.data
        },
        async saveInspection(obj: any) {
            const res = await axios.post(`api/inspectionitemtype`, obj).then(q => q)
            return res.data
        },
        async deleteInspection(id: number) {
            const res = await axios.delete(`api/inspectionitemtype/` + id).then(q => q)
            return res.data
        },
        async getDomage() {
            if (cach.getDomage) return cach.getDomage
            const res = await axios.get('api/damageitem').then(q => q)
            return (cach.getDomage = res.data)
        },
        async getWork(id: number | null) {
            let url = 'api/work'
            if (id) url += '/' + id
            const res = await axios.get(url).then(q => q)
            return res.data
        },
        async saveWork(obj: any) {
            const res = await axios.post(`api/work`, obj).then(q => q)
            return res.data
        },
        async getRepaired(type = 10) {
            const res = await axios.get('api/repairedItem/getByType/' + type).then(q => q)
            return res.data
        },
        async deleteWork(id: number) {
            const res = await axios.delete(`api/work/` + id).then(q => q)
            return res.data
        },

    }
})
