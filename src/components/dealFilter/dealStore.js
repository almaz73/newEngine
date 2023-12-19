/**
 *  Связывает несколько модулей через глобальный REF, предоставляя реактивность
 */
import {reactive} from "vue";

export const store = reactive({
    tags: []
})

export function removeElement(tag) {
    if (tag) store.tags = store.tags.filter(el => el.param !== tag.param)
    else store.tags = []

    localStorage.removeItem('dealFilters')
}