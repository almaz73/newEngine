import {defineStore} from 'pinia'
import axios from 'axios'

export const useCalendarStore = defineStore('calendarStore', {
    state: () => ({}),
    actions: {
        async getEvents(year: number, month: number, showExpired: boolean, showVisitEvents: boolean) {
            const res = await axios.get(`/api/event/get/items?month=${month + 1}
            &showExpired=${showExpired}&showVisitEvents=${showVisitEvents}&year=${year}`)
            return res.data
        },
    }
})
