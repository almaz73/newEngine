// Если нет интернета, временно запоминаем, чтобы потом после появления интернета сохранить на сайт
import {ElMessage, ElMessageBox} from "element-plus";
import {useDesktopStore} from "@/stores/desktopStore";
import {formatDM_hm} from "@/utils/globalFunctions";

const desktopStore = useDesktopStore()

export function unSaved(method, params) {
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

window.addEventListener("online", saveUnSaved);

export function saveUnSaved() {
    let unsavedRequests: {} | undefined = localStorage.getItem('UnsavedRequests')
    if (unsavedRequests) {
        unsavedRequests = JSON.parse(unsavedRequests)
        console.log('unsavedRequests', unsavedRequests)
        Object.entries(unsavedRequests).forEach(el => {
            console.log('el', el)


            let time = unsavedRequests[el[0]][0].timeNoInternet
            time = formatDM_hm(new Date(time))
            const name = unsavedRequests[el[0]][0].lead.person.firstName

            switch (el[0]) {
                case 'desktopStore.saveAppeal':

                    ElMessageBox.confirm(`Есть не отправленный на сервер обращение. Клиент: ${name}. Время: ${time} Сохранить?`,
                        {confirmButtonText: 'Да', cancelButtonText: 'Нет', showClose: false})
                        .then(() => {
                            ElMessage({type: 'success', message: 'Delete completed',})
                        })
                        .catch(() => {
                            ElMessage({type: 'info', message: 'Delete canceled',})
                        })

                    // ElMessage({duration:0, message: 'Обращение сохранено', type: 'success'})

                    // desktopStore.saveAppeal(appeal).then(res => {
                    //     if (res.status === 200) {
                    //         ElMessage({message: 'Обращение сохранено', type: 'success'})
                    //     }
                    // })
                    break;
            }
        })
    }
    // ElMessage({duration:0, showClose: true, message: 'Есть не сохраненныq на сервер выкуп. Сохранить?', type: 'success'})

    // ElMessage({
    //
    //     dangerouslyUseHTMLString: true,
    //     duration:0,
    //     message: 'Есть не сохраненныq на сервер выкуп. Сохранить? &nbsp;  <br><br><button >Да</button> &nbsp; <button>Нет</button>', type: 'info'
    // })


    console.log('online = == ')
}