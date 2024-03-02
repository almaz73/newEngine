import {defineStore} from 'pinia'
import axios from 'axios'

export const useFeedBackStore = defineStore('feedBackStore', {
    state: () => ({}),
    actions: {
        async sendMessage(obj: any) {
            return await axios.post('/api/comment/', obj).then(q => q)
        },
        async getMessages(id: number) {
            const res = await axios.get(`/api/comment/20/${id}`)
            return res.data
        },
    }
})
