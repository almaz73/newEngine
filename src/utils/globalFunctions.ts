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

export const formatDateDDMMYYYY = (val: string) => {
    // формат: 17.01.2022
    return new Date(val).toLocaleString('ru-Ru', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    })
}

export const formatDMY_hm = (val: Date) => {
    // формат: 17.01.2022, 15:12
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
        res = '+' + txt.substring(0, 11);
    }
    fn(res)
    return res
}

export const emailValidate = function (val: string) {
    const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
    const err = EMAIL_REGEXP.test(val)
    if (!err) ElMessage({message: 'Ошибочный Email ', type: 'warning'})
}

/** вытаскивание из ссылки модель-бренд-год-КПП и пробег автомобиля **/
let brands = []
const kppTypes = {'amt': 40, 'at': 20, 'mt': 10, 'cvt': 30}
export const weblink = function (link: string) {
    return new Promise((resolve) => {
        if (!link || !link.includes('/')) return false
        const car = link.split('/').pop().split('_');
        let brand, kpp, line = '';
        car.pop();
        ['amt', 'at', 'mt', 'cvt'].forEach((type) => {// вырезаем тип КПП
            if (car.includes(type)) {
                kpp = kppTypes[type]
                const place = car.indexOf(type)
                if (type == 'at' && !Number.isFinite(+car[place - 1])) return car.splice(place, 1)
                car.splice(place - 1, 2)
            }
        })

        if (!car.includes('km') && car.find(el => el.includes('km'))) car.push('km')

        if (car.includes('km')) { // вытаскиваем км
            const placeYear = car.findLastIndex(el => el.match(/\b\d{4}\b/g))
            const placeKM = car.indexOf('km')
            let count = 0

            for (let i = placeYear + 1; i < placeKM; i++) {
                count++
                line = line + car[i]
            }

            for (let i = 0; i < count + 1; i++) {
                car.pop()
            }
        }

        const year = car.pop();

        if (brands.find(el => el.name === car[0].toUpperCase())) {
            car[1] = car[1] + car[2]
            car.pop()
        }

        if (car.length > 2 && car[0] != 'geely') brand = car.splice(0, 2);
        else brand = car.splice(0, 1);

        let model = car;

        brand = brand && brand.join('').toUpperCase()
        model = model && model.join('').toUpperCase()

        if (!brands.length) {
            useGlobalStore().getBrands().then(res => {
                brands = JSON.parse(JSON.stringify(res))
                brands.map(el => { // нормализация списка автомобилей
                    el.name = [...el.name].map(item => translitRu2En(item)).join('')
                    el.name = el.name.replace('(', '').replace(')', '').replace(/ /g, '').toUpperCase()
                })
                getCar()
            })
        } else getCar()

        function getCar() {
            findCarAndModel(brand, model).then(res => {
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


function findCarAndModel(brand: any[], model: any[]) {
    return new Promise((resolve) => {
        let foundBrand = brands.find(el => el.name.toUpperCase() === brand)
        if (!foundBrand) foundBrand = brands.find(el => el.name.toUpperCase().includes(brand))
        foundBrand && useGlobalStore().getModels(foundBrand.id).then(res => {
            const models = JSON.parse(JSON.stringify(res))
            let foundModel = models.find(el => el.name.replace(/ /g, '').replace('(', '').replace(')', '').toUpperCase() == model)
            if (!foundModel) {
                foundModel = models.find(el => {
                    el.name = [...el.name].map(item => translitRu2En(item.toUpperCase())).join('')
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

// start проостое хеширование
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

// end проостое хкширование