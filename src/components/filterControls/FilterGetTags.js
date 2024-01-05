import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

export function getTags(tags, vModel, lists) {
    Object.keys(vModel.value).forEach((param) => {
        let name = ''
        let key = vModel.value[param]
        if (!key) return false;

        switch (param) {
            case 'createDate':
                tags.value.push({param, name: 'Обращение: ' + formatDateDDMMYYYY(key), code: new Date(key)})
                break
            case 'locationCity':
                tags.value.push({param, name: 'г. ' + key, code: key})
                break
            case 'manager':
                name = lists.value['manageres'].find((el) => el.id === key).title
                name && tags.value.push({param, name: 'Менеджер: ' + name, code: key})
                break
            case 'ccEmployee':
                name = lists.value['ccEmployees'].find((el) => el.id === key).title
                name && tags.value.push({param, name: 'Сотрудник КЦ: ' + name, code: key})
                break
            case 'dealNumber':
                tags.value.push({param, name: '№ обращения ' + key, code: key})
                break
            case 'lowMileage':
                tags.value.push({param, name: 'Пробег от ' + key, code: key})
                break
            case 'lowEnginePowerHP':
                tags.value.push({param, name: 'Мощноcть от ' + key, code: key})
                break
            case 'highEnginePowerHP':
                tags.value.push({param, name: 'Мощность до ' + key, code: key})
                break
            case 'highMileage':
                tags.value.push({param, name: 'Пробег до ' + key, code: key})
                break
            case 'lowCreateDatePeriod':
                tags.value.push({param, name: 'Период от ' + formatDateDDMMYYYY(key), code: new Date(key)})
                break
            case 'highCreateDatePeriod':
                tags.value.push({param, name: 'Период до ' + formatDateDDMMYYYY(key), code: new Date(key)})
                break
            case 'locationId':
                var pl = lists.value['places'].find(el => el.id === key)
                name = pl.title + ' ' + pl.typeTitle
                tags.value.push({param, name: 'Место: ' + name, code: key})
                break
            case 'DealStatus':
                name = lists.value['statuses'].find((el) => el.id === key).name
                name && tags.value.push({param, name: 'Статус: ' + name, code: key})
                break
            case 'workflowLeadType':
                name = lists.value['workflowTypes'].find((el) => el.value === key).title
                name && tags.value.push({param, name: 'Тип обращения: ' + name, code: key})
                break
            case 'swapPhone':
                tags.value.push({param, name: 'Подменный номер: ' + key, code: key})
                break
            case 'carBrandId':
                var brand = lists.value['brands'].find((el) => el.id === key)
                name = brand && brand.name
                name && tags.value.push({param, name, code: brand.id})
                break
            case 'carModelId':
                var model = lists.value['models'].find((el) => el.id === key)
                name = model && model.name
                name && tags.value.push({param, name, code: model.id})
                break
            case 'lowYearReleased':
                tags.value.push({param, name: 'от ' + key, code: key})
                break
            case 'highYearReleased':
                tags.value.push({param, name: 'до ' + key, code: key})
                break
            case 'categoryAuto':
                name = lists.value['categoryAutos'].find((el) => el.id === key).name
                name && tags.value.push({param, name: 'Категория: ' + name, code: key})
                break
            case 'bodyType':
                name = lists.value['bodyTypes'].find(el => el.id === key).name
                tags.value.push({param, name, code: key})
                break
            case 'bodyColorId':
                name = lists.value['colors'].find(el => el.id === key).name
                tags.value.push({param, name, code: key})
                break
            case 'workflowStatus':
                name = lists.value['statuses'].find((el) => el.id === key).name
                name && tags.value.push({param, name: 'Статус: ' + name, code: key})
                break
            case 'clientStatus':
                name = lists.value['clientStatuses'].find((el) => el.value === key).title
                name && tags.value.push({param, name: 'Статус клиента: ' + name, code: key})
                break
            case 'lowEngineCapacity':
                tags.value.push({param, name: 'объем от ' + key, code: key})
                break
            case 'highEngineCapacity':
                tags.value.push({param, name: 'объем до ' + key, code: key})
                break
            case 'driveType':
                name = lists.value['driveTypies'].find(el => el.id === key).name
                tags.value.push({param, name, code: key})
                break
            case 'gearboxType':
                name = Object.keys(key).reduce((sum, el) => {
                    return sum + lists.value['kpp'].find(item => item.id === key[el]).name + '; '
                }, '')
                key.length && tags.value.push({param, name, code: key})
                break
            case 'orgelement':
                name = lists.value['organizations'].find((el) => el.id === key).name
                name && tags.value.push({param, name: 'Организация: ' + name, code: key})
                break
            case 'buyType':
                name = lists.value['buyTypes'].find(el => el.id === key).name
                tags.value.push({param, name, code: key})
                break
            case 'treatmentSource':
                  name = lists.value['treatments'].find(el => el.id === key).name
                  tags.value.push({param, name, code: key})
                  break
            case 'registrationMark':
                  tags.value.push({param, name: key, code: key})
                  break
        }

    })

    return tags
}