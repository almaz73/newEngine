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

export const weblink = function (link) {
    const car = link.split('/').pop().split('_');
    let brand, line = '';
    car.pop();

    ['amt', 'at', 'mt'].forEach((type) => {// вырезаем тип КПП
        if (car.includes(type)) {
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

    // eslint-disable-next-line prefer-const
    let year = car.pop();


    if (car[0] == 'tesla' && car[1] == 'model') {
        car[1] = car[1] + car[2]
        car.pop()
    }

    if (car.length > 2) {
        brand = car.splice(0, 2);
    } else {
        brand = car.splice(0, 1);
    }
    const model = car;


    console.log('===============================')
    console.log('brand=', brand)
    console.log('model=', model)
    console.log('year=', year)
    console.log('line=', line)

    return {brand, model, year, line}

}
