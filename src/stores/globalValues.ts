import {defineStore} from "pinia";

export const useGlobalValues = defineStore("globalValues", {
    state: () => ({
        isShowPanel: false,  // состояние для узких экранов, гамбургер
    })
})