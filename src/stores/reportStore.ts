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
        async getMonthly(filter: any) {
            const url: string = '/api/report/callcenter/monthly?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getArchiveClients(filter: any) {
            const url: string = '/api/report/callcenter/appeal/archivingreasons?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getCalls(filter: any) {
            const url: string = '/api/report/callcenter/phone/event?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getByuouts(filter: any) {
            const url: string = '/api/report/call-center/buy'
            const res = await axios.get(url, {params: filter}).then(res => res)
            return res.data
        },
        async getLocation(filter: any) {
            const url: string = '/api/location/get/list'
            const res = await axios.get(url, {params: filter}).then(res => res)
            return res.data
        },
        async getActual(filter: any) {
            const url: string = '/api/report/callcenter/appeal/days?filter=' + JSON.stringify(filter)
            const res = await axios.get(url).then(res => res)
            return res.data
        },
        async getDepartments() {
            const res = await axios.get('/api/orgelement/get/departmens').then(res => res)
            return res.data
        },
        async getSourceAppeals(params: any) {
            const {department, month, year} = params
            const res = await axios.get(
                `/api/report/common/appeal-source?department=${department}&month=${month}&year=${year}`)
                .then(res => res)
            return res.data
        },
        async getwWorkflowLeadTypes() {
            const res = await axios.get('/api/deal/getworkflowleadtypesforavailabledeals')
                .then(res => res)
            return res.data
        },
        async getDealsReport(params: any) {
            let req = '?startDate=' + params.startDate + '&endDate=' + params.endDate
            params.orgIds.forEach((el: string) => req += '&orgId=' + el)
            params.workflowLeadTypes.forEach((el: string) => req += '&workflowLeadType=' + el)
            const res = await axios.get('/api/report/GetDealsReport' + req)
                .then(res => res)
            return res.data
        },
        async getCreditReport(params: any) {
            let req = '?highDate=' + params.startDate + '&lowDate=' + params.endDate + '&reportType=' + params.reportType
            if (params.user) req += '&user=' + params.user
            if (params.manager) req += '&manager=' + params.manager
            if (params.organization) req += '&organization=' + params.organization
            if (params.bank) req += '&bank=' + params.bank
            const res = await axios.get('/api/report/common/credit' + req)
                .then(res => res)
            return res.data
        },
        async getCreditReportUsers() {
            return axios.get('/api/user/list/policy?roles=50&roles=51&roles=52&roles=90&roles=91').then(res => res.data)
        },
        async getAutoSellPerDay(params: any) {
            const link: string = `?filter={"year":${params.year},"month":${params.month}}`
            return axios.get('/api/report/getSellMonthByModel' + link).then(res => res.data)
        },
        async getSellAppeals() {
            return axios.get('/api/report/getSellAppeals/').then(res => res.data)
        },
        async getAppealsinorganizations(params: any) {
            const link: string = `?filter={"lowCreateDatePeriod":"${params.startDate}","highCreateDatePeriod":"${params.endDate}"}`
            return axios.get('/api/report/admin/appealsinorganizations' + link).then(res => res.data)
        },
        async getAppealsDays(params: any) {
            const link: string = `?filter={"year":${params.year},"month":${params.month}}`
            return axios.get('/api/report/getSalesmanAppointmentsAndWorksheetReport' + link).then(res => res.data)
        },
        async getEfficiencySell(params: any) {
            let link: string = `?lowDate=${params.startDate}&highDate=${params.endDate}`
            if (params.organization) link += '&organization=' + params.organization
            return axios.get('/api/report/getSellEfficiency' + link).then(res => res.data)
        },
        async getEfficiency(params: any) {
            const res = await axios.get(
                `/api/report/analytic/efficiency?highCreateDatePeriod=${params.endDate}&lowCreateDatePeriod=${params.startDate}`)
                .then(res => res)
            return res.data
        },
        async getCallCenterCalls(params: any) {
            const res = await axios.get(
              `/api/report/sell/callCenterCalls?highDate=${params.endDate}&lowDate=${params.startDate}&org=${params.organization}`)
              .then(res => res);
            return res.data;
        },
        async getCreditFunnel(params: any) {
            const res = await axios.get(
              `/api/report/sell/creditApplicationFunnel?highDate=${params.endDate}&lowDate=${params.startDate}&org=${params.organization}&communicationType=${params.communicationType}`)
              .then(res => res);
            return res.data;
        },
        async getExpiredEventsReport(DateStart: Date | null, DateEnd: Date | null, Roles: number[]|null, Skip: number|null, Take: number|null) {

            console.log('...DateStart', DateStart);
            let link  = `?DateStart=${DateStart}&DateEnd=${DateEnd}`
            if (Roles && Roles.length) Roles.forEach(el => link += "&Roles=" + el);
            link+= `&Skip=${Skip}&Take=${Take}`
            console.log('link', link);
            // return await axios.post('/api/report/call-center/GetExpiredEventsReport/?DateStart='+link);
        }

        /*
        https://dev.autonet.pro/api/report/call-center/GetExpiredEventsReport/?DateStart=01.10.2024&DateEnd=31.10.2024&Roles=110&Roles=111&Roles=112&Roles=113&Skip=0&Take=25


DateStart: 01.10.2024
DateEnd: 31.10.2024
Roles: 110
Roles: 111
Roles: 112
Roles: 113
Skip: 0
Take: 25
        * **/
    }
})
