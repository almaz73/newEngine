// Если нет интернета, временно запоминаем, чтобы потом после появления интернета сохранить на сайт
import {ElMessage, ElMessageBox} from "element-plus";
import {formatDMY_hm} from "@/utils/globalFunctions";

let cb: any; // колбак на страницу, если нужно дальше редактировать вызов
let unsavedRequests: {} | null;
let selectedRequest = ''
let selectedInd: any = null
let howMuchIsLeft: number

window.addEventListener("online", () => saveUnSaved(cb));

export function saveInLocalStorage(method: string, params: any) {
    return new Promise(resolve => {
        let unsavedRequests: {} | string | null = localStorage.getItem('UnsavedRequests')

        if (unsavedRequests && typeof unsavedRequests === "string") {
            unsavedRequests = JSON.parse(unsavedRequests)
        } else unsavedRequests = {}

        params.timeNoInternet = Date.now()

        // @ts-ignore
        if (typeof unsavedRequests !== "string" || unsavedRequests[method]) {
            // @ts-ignore
            unsavedRequests[method].push(params)
        } else { // @ts-ignore
            unsavedRequests[method] = [params]
        }

        localStorage.setItem('UnsavedRequests', JSON.stringify(unsavedRequests))
        ElMessage({
            duration: 5000,
            showClose: true,
            message: 'Обращение сохранено в кэше до появления интернета',
            type: 'success'
        })
        resolve(true)
    })
}


// проходим по всем сохраненным в локалстораж узлам и составляем плоский масиив
export function saveUnSaved(cbForEdit: any) {
    cb = cbForEdit
    if (!navigator.onLine) return false;
    const list: any[] = []
    unsavedRequests = localStorage.getItem('UnsavedRequests')
    if (unsavedRequests) {
        // @ts-ignore
        unsavedRequests = JSON.parse(unsavedRequests)

        // @ts-ignore
        Object.entries(unsavedRequests).forEach(el => {
            // @ts-ignore
            el[1].forEach((item: any, ind: number) => {
                let name = item.lead && item.lead.person.firstName
                if (!name) name = item.Client && item.Client.Person.firstName
                if (!name) name = item.sellLead && item.sellLead.person.firstName
                list.push({request: el[0], params: item, name, ind, time: formatDMY_hm(new Date(item.timeNoInternet))})
            })
        })
        treatment(list)
    }
}

function treatment(list: any) {
    howMuchIsLeft = list.length
    const request = list.pop()
    if (!request) return false
    selectedRequest = request.request
    selectedInd = request.ind
    cb(howMuchIsLeft)

    ElMessageBox.confirm(`Клиент: ${request.name}. 
    Время: ${request.time}`,
        'Есть несохраненное обращение',
        {confirmButtonText: 'Показать', cancelButtonText: 'Удалить', showClose: false})
        .then(() => saveRequestOnServer()).catch(() => refuseRequest())
}


/**
 * СОхраняем на сервере и удаляем из локалсторожа
 */
function saveRequestOnServer() {
    // @ts-ignore
    cb(howMuchIsLeft - 1, unsavedRequests[selectedRequest][selectedInd])
    deleteRequest()
}


/**
 *  дожидается удаления и запускает поиск нового несохраненного
 */
function refuseRequest() {
    deleteRequest().then(() => {
        ElMessage({type: 'info', message: 'Удалено из кэша'})
        setTimeout(() => saveUnSaved(cb), 730)
    })
}

/**
 * Удаляет из локалстоража
 */
function deleteRequest() {
    return new Promise(resolve => {
        // @ts-ignore
        unsavedRequests[selectedRequest].pop()
        localStorage.setItem('UnsavedRequests', JSON.stringify(unsavedRequests))
        resolve(true)
    })
}


