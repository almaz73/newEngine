import {ElMessage} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";

export const formatDate = (val: string) => {
    // формат: 17 мая 2022 г.
    if (!val) return ''
    return new Date(val).toLocaleString('ru-Ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export const formatDateDDMMYYYY = (val: string | Date) => {
    // формат: 17.01.2022
    if (!val) return ''
    return new Date(val).toLocaleString('ru-Ru', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    })
}

export const formatDateOnlyYear = (val: string | Date) => {
    // формат: 1981
    if (!val) return ''
    return new Date(val).toLocaleString('ru-Ru', {year: 'numeric'})
}

export const formatDMY_hm = (val: Date) => {
    // формат: 17.01.2022, 15:12
    if (!val) return ''
    return new Date(val).toLocaleString('ru-Ru', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: "numeric",
        minute: "numeric",
    })
}

export const gotoTop = () => window.scrollTo({top: 0, behavior: 'smooth'})

export function validateVin(vin: string) {
    const re = new RegExp("^[A-HJ-NPR-Z\\d]{13}\\d{4}$", "i");
    return vin.match(re);
}

export function vetRegNumber(value: string) {
    let newValue: string

    function addLetters(start: number, end: number, isLetters: boolean): void {
        newValue = newValue + ' ';
        for (let i = start; value.length > i; i++) {
            if (isLetters && /[FDTRVYJHCNE[АВЕКМНОРСТУХ]+/g.test(value[i]))
                newValue = newValue + (/^[A-Z[]*$/.test(value[i]) ? upEng2rus(value[i]) : value[i]);
            if (!isLetters && /[0-9]+/g.test(value[i])) newValue = newValue + value[i];
            if (i == end) break;
        }
    }

    if (value) {
        value = value.toUpperCase();
        value = value.replace(/[^FDTRVYJHCNE[0-9АВЕКМНОРСТУХ]|\s+/g, '');
        // @ts-ignore
        value = value.split('');
        newValue = /^[A-Z[]*$/.test(value[0]) ? upEng2rus(value[0]) : value[0];
        if (newValue) newValue = newValue.replace(/[0-9]+/g, '');
        if (value.length > 1) addLetters(1, 3, false);
        if (value.length > 4) addLetters(4, 5, true);
        if (value.length > 6) addLetters(6, 8, false);
        value = newValue;
    }
    return value;
}

function upEng2rus(value: string) {
    const translate = {
        A: 'Ф',
        B: 'И',
        C: 'С',
        D: 'В',
        E: 'У',
        F: 'А',
        G: 'П',
        H: 'Р',
        I: 'Ш',
        J: 'О',
        K: 'Л',
        L: 'Д',
        M: 'Ь',
        N: 'Т',
        O: 'Щ',
        P: 'З',
        Q: 'Й',
        R: 'К',
        S: 'Ы',
        T: 'Е',
        U: 'Г',
        V: 'М',
        W: 'Ц',
        X: 'Ч',
        Y: 'Н',
        Z: 'Я',
        ',': 'Б',
        '.': 'Ю',
        ';': 'Ж',
        "'": 'Э',
        '[': 'Х',
        ']': 'Ъ',
        '`': 'Ё',
    };
    // @ts-ignore
    value = /^[A-Z,.;'[\]`]*$/.test(value) ? translate[value] : value;
    return value;
}

interface Row {
    bodyColorCode?: string;

    [key: string]: unknown;
}

export function carColor(row: Row) {
    if (row && row.bodyColorCode) return {'background-color': row.bodyColorCode}
    if (row) return {'background-color': row}
    return {}
}


interface Tag {
    param: string;
    name?: string;
    code?: string;
}

interface GlobalRef {
    tags: Tag[];
}

interface VModel {
    value: Record<string, unknown>;
}

export function tagsControl(globalRef: GlobalRef, vModel: VModel) {
    const params = globalRef.tags.map((el: Tag) => el.param)

    Object.keys(vModel.value).forEach((el: string) => {
        if (!params.includes(el) && vModel.value[el]) vModel.value[el] = null
    })

    globalRef.tags.forEach((el: Tag) => {
        if (el.name) vModel.value[el.param] = el.code
    })
}

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

export const emailValidate = function (val: string) {
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const err = EMAIL_REGEXP.test(val)
    if (!err) ElMessage({message: 'Ошибочный Email ', type: 'warning'})
}

/** вытаскивание из ссылки модель-бренд-год-КПП и пробег автомобиля **/
let brands:any[] = []
const kppTypes:any = {'amt': 40, 'at': 20, 'mt': 10, 'cvt': 30}
export const weblink = function (link: string) {
    return new Promise((resolve, reject) => {
        if (!link || !link.includes('/')) {
            reject()
            return false
        }
        const car: string[] = link.split('/').pop().split('_');

        let indexKpp: number = 4
        Object.keys(kppTypes).forEach(it => {
            let ind: number = car.findIndex((el: string) => el === it)
            if (ind > 0) indexKpp = ind
        })
        const brand = car[0].toUpperCase()
        const model = car[1].toUpperCase();
        const kpp = kppTypes[car[indexKpp]];
        const year = car[indexKpp + 1];
        let line = car[indexKpp + 2] + car[indexKpp + 3]
        line = line.replace(/\D/g, '');
        const indexKm: number = car.findIndex((el: string) => el === 'km')
        if (indexKm == -1) line = ''

        if (!brands.length) {
            useGlobalStore().getBrands().then(res => {
                brands = JSON.parse(JSON.stringify(res))
                brands.map(el => { // нормализация списка автомобилей
                    el.name = [...el.name].map(item => translitRu2En(item, false)).join('')
                    el.name = el.name.replace('(', '').replace(')', '').replace(/ /g, '').toUpperCase()
                })
                getCar()
            })
        } else getCar()

        function getCar() {
            findCarAndModel(brand, model).then((res:any) => {
                resolve({
                    brandId: res.foundBrand && res.foundBrand.id,
                    modelId: res.foundModel && res.foundModel.id,
                    year,
                    line,
                    kpp
                })
            })
        }
    })
}


function findCarAndModel(brand: string, model: string) {
    return new Promise((resolve) => {
        let foundBrand = brands.find(el => el.name.toUpperCase() === brand)
        if (!foundBrand) foundBrand = brands.find(el => el.name.toUpperCase().includes(brand))
        foundBrand && useGlobalStore().getModels(foundBrand.id).then(res => {
            const models = JSON.parse(JSON.stringify(res))
            let foundModel = models.find((el:any) => el.name.replace(/ /g, '').replace('(', '').replace(')', '').toUpperCase() == model)
            if (!foundModel) {
                foundModel = models.find((el:any) => {
                    el.name = [...el.name].map(item => translitRu2En(item.toUpperCase(), false)).join('')
                    return el.name.replace(' ', '').includes(model)
                })
            }
            resolve({foundBrand, foundModel})
        })
        if (!foundBrand) resolve({})
    })
}

function translitRu2En(value: string, short: boolean) {
    const translate = {
        А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'E', Ж: 'ZH', З: 'Z', И: 'I', Й: 'Y', К: 'K',
        Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F', Х: 'KH', Ц: 'C',
        Ч: 'CH', Ш: 'SH', Щ: 'SCH', Ъ: '"', Ы: 'IY', Ь: "'", Э: 'EH', Ю: 'YU', Я: 'YA',
    };
    if (short) {
        translate['Ъ'] = '';
        translate['Ь'] = '';
    }
    // @ts-ignore
    value = /^[А-Я]*$/.test(value) ? translate[value] : value;
    return value;
}

// start проостое хеширование чтобы сделать текст нечитаемым
export function encryptPassword(password: string): string {
    let encryptedPassword: string = "";
    const alphabet: string = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < password.length; i++) {
        encryptedPassword += alphabet[i % alphabet.length] + "2" + password[i];
    }
    return encryptedPassword.split("").reverse().join("");
}

export function decryptPassword(encryptedPassword: string): string {
    let decryptedPassword = "";
    const reversedEncryptedPassword: string = encryptedPassword.split("").reverse().join("");
    for (let i = 0; i < reversedEncryptedPassword.length; i += 3) {
        decryptedPassword += reversedEncryptedPassword[i + 2];
    }
    return decryptedPassword;
}
// end простое хеширование


// Функция для проверки полей на заполненность
export function checkEmptyFields(formEl: any) {
    return formEl && formEl.validate((valid: boolean, a: any) => {
        const empty = a && Object.entries(a).find(el => !el[1].fieldValue)
        empty && ElMessage({message: `Поле "${empty[1][0].message}" обязателен для заполнения`, type: 'warning'})
        return !valid
    })
}

export function getPeriods(ev:any) {
    let startTime = new Date(ev.dateStart).getHours() + ':' + new Date(ev.dateStart).getMinutes()
    let endTime = new Date(ev.dateEnd).getHours() + ':' + new Date(ev.dateEnd).getMinutes()
    return formatDateDDMMYYYY(ev.createDate) + ' &nbsp; c  <b style="color:#d34338">' + startTime + '</b> до <b style="color:#d34338">' + endTime + '</b>'
}

export const getFiasByName = (queryString: string, cb: any) => {
    useGlobalStore().getFias(queryString).then(res => cb(res.data.items || []))
}

export function timeAgoF(input: Date): string | undefined {
    const date = (input instanceof Date) ? input : new Date(input)
    const formatter = new Intl.RelativeTimeFormat('ru')
    const ranges:any = {
        years: 3600 * 24 * 365,
        months: 3600 * 24 * 30,
        weeks: 3600 * 24 * 7,
        days: 3600 * 24,
        hours: 3600,
        minutes: 60,
        seconds: 1
    }
    const secondsElapsed = (date.getTime() - Date.now()) / 1000

    for (let key in ranges) {
        if (ranges[key] < Math.abs(secondsElapsed)) {
            const delta = secondsElapsed / ranges[key]
            return formatter.format(Math.round(delta), key)
        }
    }
}

export function Declension(number: number, titles: any) {
    if (!number || !titles) return ''
    // titles { 0: 'одна позиция', 1: 'две позиции', 2: 'много позиций' }
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
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

export function checkPictureBeforeUpload(rawFile: File, limit: number, allFiles: string) {
    // limit - в мегабайтах
    if (!rawFile.type.includes('image') && !allFiles) {
        ElMessage.error('Не подходящий формат для фотографии!')
        return true
    } else if (rawFile.size > limit * 1000000) {
        ElMessage.error((allFiles ? 'Файл' : 'Фото') + ` не может быть больше ${limit} mb!`)
        return true
    }
}

export function colorBox(txt: string) {
    if (txt === 'Новый') return {background: '#01a9db', color: 'white'}
    if (['В работе', 'Оформление', 'Запрос на архивирование'].includes(txt)) return {
        background: '#3cac71',
        color: 'white'
    }
}