/**
 *  Связывает несколько модулей через глобальный REF, предоставляя реактивность
 */
import {reactive} from "vue";

export const globalRef = reactive({
    tags: [],
    isChanged: false
})

export function removeElement(tag) {
    if (tag) globalRef.tags = globalRef.tags.filter(el => el.param !== tag.param)
    else globalRef.tags = []
    globalRef.isChanged = true
}