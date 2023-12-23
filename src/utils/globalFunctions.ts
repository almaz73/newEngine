export const formatDate = (val: string) => {
    // формат: 17 мая 2022 г.
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