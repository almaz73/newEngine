import {defineStore} from "pinia";
import axios from "axios";

export const useGlobalValues = defineStore("globalValues", {
    state: () => ({
        isShowPanel: false,  // состояние для узких экранов, гамбургер
    }),
    actions: {
        async signout() {
            const res = await signout();
            console.log('> > > res', res)
            return res ? res.data : [];
        },
    }
})

function signout() {
    return axios
        .post(`/api/account/signout`)
        .then((res) => res);
}