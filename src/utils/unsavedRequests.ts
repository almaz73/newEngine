// Если нет интернета, временно запоминаем, чтобы потом после появления интернета сохранить на сайт
import {ElMessage, ElMessageBox} from "element-plus";
import {useDesktopStore} from "@/stores/desktopStore";
import {formatDMY_hm} from "@/utils/globalFunctions";

const desktopStore = useDesktopStore()
let unsavedRequests: {} | undefined;
let selectedRequest = ''
let selectedInd = null

window.addEventListener("online", saveUnSaved);

export function saveInLocalStorage(method, params) {
    return new Promise(resolve => {
        let unsavedRequests: {} | undefined = localStorage.getItem('UnsavedRequests')

        if (unsavedRequests) unsavedRequests = JSON.parse(unsavedRequests)
        else unsavedRequests = {}

        params.timeNoInternet = Date.now()

        if (unsavedRequests[method]) unsavedRequests[method].push(params)
        else unsavedRequests[method] = [params]

        localStorage.setItem('UnsavedRequests', JSON.stringify(unsavedRequests))
        ElMessage({duration: 0, showClose: true, message: 'Обращение сохранено временно в памяти до появления интернета', type: 'success'})
        resolve()
    })
}


// проходим по всем сохраненным в локалстораж узлам и составляем плоский масиив
export function saveUnSaved() {
    if (!navigator.onLine) return false;
    const list = []
    unsavedRequests = localStorage.getItem('UnsavedRequests')
    if (unsavedRequests) {
        unsavedRequests = JSON.parse(unsavedRequests)
        Object.entries(unsavedRequests).forEach(el => {
            el[1].forEach((item, ind) => {
                let name = item.lead && item.lead.person.firstName
                if (!name) name = item.Client && item.Client.Person.firstName
                if (!name) name = item.sellLead && item.sellLead.person.firstName
                list.push({request: el[0], params: item, name, ind, time: formatDMY_hm(new Date(item.timeNoInternet))})
            })
        })
        treatment(list)
    }
}

function treatment(list) {
    const request = list.pop()
    if (!request) return false
    selectedRequest = request.request
    selectedInd = request.ind

    ElMessageBox.confirm(`Есть несохраненный на сервере обращение. Клиент: ${request.name}. Время: ${request.time} Сохранить?`,
        {confirmButtonText: 'Да', cancelButtonText: 'Нет', showClose: false})
        .then(() => saveRequestOnServer()).catch(() => refuseRequest())
}


/**
 * СОхраняем на сервере и удаляем из локалсторожа
 */
function saveRequestOnServer() {
    switch (selectedRequest) {
        case'desktopStore.saveAppeal':
            const appeal = unsavedRequests[selectedRequest][selectedInd]
            desktopStore.saveAppeal(appeal).then(res => {
                if (res.status === 200) {
                    deleteRequest().then(() => {
                        ElMessage({message: 'Обращение успешно сохранено', type: 'success'})
                        setTimeout(() => saveUnSaved(), 730)
                    })
                }
            })
            break;
        case'desktopStore.saveAppealSalon':
            const deal = unsavedRequests[selectedRequest][selectedInd]
            desktopStore.saveAppealSalon(deal).then(res => {
                if (res.status === 200) {
                    deleteRequest().then(() => {
                        ElMessage({message: 'Сделка через салон успешно сохранено', type: 'success'})
                        setTimeout(() => saveUnSaved(), 730)
                    })
                }
            })
            break;
        case'desktopStore.saveAppealComission':
            const commission = unsavedRequests[selectedRequest][selectedInd]
            desktopStore.saveAppealComission(commission).then(res => {
                if (res.status === 200) {
                    deleteRequest().then(() => {
                        ElMessage({message: 'Комиссия успешно сохранена', type: 'success'})
                        setTimeout(() => saveUnSaved(), 730)
                    })
                }
            })
            break;
    }
}

/**
 *  дожидается удаления и запускает поиск нового несохраненного
 */
function refuseRequest() {
    deleteRequest().then(() => {
        ElMessage({type: 'info', message: 'Не сохраненное обращение удалено'})
        setTimeout(() => saveUnSaved(), 730)
    })
}

/**
 * Удаляет из локалстоража
 */

function deleteRequest() {
    return new Promise(resolve => {
        unsavedRequests[selectedRequest].pop()
        localStorage.setItem('UnsavedRequests', JSON.stringify(unsavedRequests))
        resolve(true)
    })
}


