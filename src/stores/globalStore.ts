import {defineStore} from "pinia";
import axios from "axios";

export const useGlobalStore = defineStore("globalStore", {
    state: () => ({
        /** @type {{boolean}} */
        isAuthorized: true,
        isShowPanel: false,  // состояние для узких экранов, гамбургер
    }),
    actions: {
        async signIn(login: string, password: string) {
            return await signIn(login, password);
        },
        async signOut(): Promise<void> {
            await signOut();
        },
    }
})

function signIn(login: string, password: string) {
    return axios
        .post(`/api/account/signin`, {login, password})
        .then(res => res, err => err)
}

function signOut() {
    return axios
        .post(`/api/account/signout`)
        .then((res) => res);
}