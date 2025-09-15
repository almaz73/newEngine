import {ElMessage} from "element-plus";

export const formattingPhone = function (val: string, fn: any) {
    if (!val) return ''

    let txt = val.replace(/\D/g, ''),
        res = "";

    if (txt.length < 2) return txt

    if (["7", "8", "9"].indexOf(txt[0]) > -1) {
        if (txt[0] == "9") txt = "7" + txt;
        const firstSymbols = (txt[0] == "8") ? "8" : "+7";
        res = firstSymbols + " ";
        if (txt.length > 1) res += '(' + txt.substring(1, 4);
        if (txt.length >= 5) res += ') ' + txt.substring(4, 7);
        if (txt.length >= 8) res += '-' + txt.substring(7, 9);
        if (txt.length >= 10) res += '-' + txt.substring(9, 11);
    } else {
        res = txt.substring(0, 11)
    }
    fn && fn(res)


    return res
}

// телефон должен состоять только из цифр
export const simplePhone = function (val: string) {
    if (!val) return ''
    if (val.slice(0, 2) == '+7') val = val.replaceAll('+7', '8')
    return val.replaceAll(' ', '').replaceAll('+', '').replaceAll('(', '').replaceAll(')', '').replaceAll('-', '')
}

export function numberWithSpaces(x: string) { //добавление пробелов для удобного отображении цен
    if (!x) return 0
    let x_ = parseInt(x.toString().replace(/ /g, ''))
    return x_.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function numberNoSpace(x: string) { //убрать проблеы среди числе
    if (!x) return 0
    return Number(x.replace(/ /g, ''))
}

export const emailValidate = function (val: string) {
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const err = EMAIL_REGEXP.test(val)
    if (!err) ElMessage({message: 'Ошибочный Email ', type: 'warning'})
}

// Функция для проверки полей на заполненность
export function checkEmptyFields(formEl: any) {
    return formEl && formEl.validate((valid: boolean, a: any) => {
        const empty = a && Object.entries(a).find(el => !el[1].fieldValue)
        empty && ElMessage({message: `${empty[1][0].message}`, type: 'error'})
        return !valid
    })
}

// const vinRegex = new RegExp("^[A-HJ-NPR-Z\\d]{8}[\\dX][A-HJ-NPR-Z\\d]{2}\\d{6}$");
const vinRegex = new RegExp("^[A-HJ-NPR-Z\\d]{13}\\d{4}$", "i");

export function checkVIN(rule: any, value: any, callback: any) {
    if (!value) callback('Поле VIN не заполнено')
    else if (!value.match(vinRegex) || value.length != 17) callback('Ошибочный VIN')
    else callback()
}

/** Отправка Файлов с параметрами */
export function sendPhoto(file, id, PhotoNumber) {
    console.log('file, id, PhotoNumber = ', file, id, PhotoNumber)

    let fd = new FormData();
    fd.append('file', file);
    fd.append('id', id);
    fd.append('PhotoNumber', PhotoNumber);
    fd.append('FileId', 0);
    // fd.append('AccessLevel', 0);

    console.log('sendPhoto fd = ', fd)

    // return new Promise(function (resolve) {
    //     $http.post(config.apiUrl + `/Deal/PostAutoAttachment`, fd, {
    //         transformRequest: angular.identity,
    //         headers: {'Content-Type': undefined},
    //     }).then(
    //         res => resolve(res),
    //         err => UIkit.notify(err.data && err.data.errorText, {status: 'warning'})
    //     )
    // })
}

export function rotatePhoto(base64Data: string, direction: number, height: number, width: number) {
    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement('canvas');
            const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

            if (height < width) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }

            const img = new Image();
            img.onload = function () {
                try {
                    // Поворачиваем и рисуем изображение
                    ctx.translate(canvas.width / 2, canvas.height / 2);
                    if (direction === 10) ctx.rotate(-Math.PI / 2);
                    if (direction === 20) ctx.rotate(Math.PI / 2);
                    ctx.drawImage(img, -img.width / 2, -img.height / 2);

                    // Получаем base64 повернутого изображения
                    const rotatedBase64 = canvas.toDataURL('image/jpeg', 1);
                    resolve(rotatedBase64);
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = function () {
                reject(new Error('Ошибка загрузки изображения'));
            };

            img.src = base64Data;
        } catch (error) {
            reject(error);
        }
    });
}