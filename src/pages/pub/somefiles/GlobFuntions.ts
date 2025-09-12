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
    else if (!value.match(vinRegex)  || value.length != 17) callback('Ошибочный VIN')
    else callback()

}