import {useDealStore} from "@/stores/dealStore";
import {ElMessage} from "element-plus";
import router from "@/router";

function boughtSave(route) {
    router.push(`/auto/${route.appealId}/deal/${route.id}/inspection`)
};

export function bought(deal, route) {
    if (deal.dealStatus === 80) return boughtSave(deal) // Автомобиль выкуплен не проверяем
    // запрашиваем Юридические документы
    useDealStore().getbyinspectionbycategory(deal.inspectionId, 90).then(res => {
        let isError = false
        //База данных исполнительных производств на предыдущего собственника
        let bdip = res.data.items.filter(el => el.inspectionItemTypeId === 198 && el)
        bdip = bdip.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        if (!bdip[0] || bdip[0].documents && !bdip[0].documents.length) {
            isError = true
            ElMessage({
                showClose: true,
                message: 'Ошибка юридической проверки: "База данных исполнительных производств на предыдущего собственника" ' +
                    'не имеет прикрепленных документов',
                type: 'error',
            })
        }

        //Федеральная нотариальная палата
        let fnp = res.data.items.filter(el => el.inspectionItemTypeId === 197 && el)
        fnp = fnp.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        if (!fnp[0] || (fnp[0].documents && !fnp[0].documents.length)) {
            isError = true
            ElMessage({
                showClose: true,
                message: 'Ошибка юридической проверки: "Федеральная нотариальная палата" не имеет прикрепленных документов',
                type: 'error',
            })
        }

        //Сайт ГИБДД
        let sgbdd = res.data.items.filter(el => el.inspectionItemTypeId === 196 && el)
        sgbdd = sgbdd.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        if (!sgbdd[0] || (sgbdd[0] && !sgbdd[0].documents.length)) {
            isError = true

            ElMessage({
                showClose: true,
                message: 'Ошибка юридической проверки: "Сайт ГИБДД" не имеет прикрепленных документов',
                type: 'error',
            })
        }

        if (!isError) boughtSave(route)
    });
}