import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {bodyTypes, categoryAutos, driveTypies, kpp, statuses} from "@/utils/globalConstants";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";

const lists=ref([])
const manageres = ref([])
const ccEmployees = ref([])
const globalStore = useGlobalStore()
const places = ref([])
const cities = ref([])
const workflowTypes = ref([])
const brands = ref([])
const models = ref([])
const colors = ref([])
const years = ref([])
const capacities = ref([])
const organizations = ref([])
const clientStatuses = ref([])
let oldCarBrandId = null


for (let z = new Date().getFullYear(); z > 1939; z--) {
    years.value.push({name: z})
}
for (let z = 800; z <= 6000; z = z + 100) {
    capacities.value.push({name: z})
}
lists.value.years = years.value
lists.value.capacities = capacities.value


globalStore.getRoles([20, 120]).then((res) => {
    res.items.map(el => el.name = el.title)
    manageres.value = lists.value.manageres = res.items
})

globalStore.getBrands().then(res => brands.value = lists.value.brands = res)
globalStore.getOrganizations().then((res) => organizations.value = lists.value.organizations = res.items)
globalStore.getClientStatuses().then(res => {
    res.items.map(el => {
        el.name = el.title;
        el.id = el.value;
        return el
    })
    clientStatuses.value = lists.value.clientStatuses = res.items
})
globalStore.getColors().then((res) => {
    res.items.map(el => el.name = el.colorName)
    colors.value = lists.value.colors = res.items
})
globalStore.getAppeals().then(res => {
    res.items.map(el => {
        el.name = el.title;
        el.id = el.value;
        return el
    })
    workflowTypes.value = res.items
    lists.value.workflowTypes = res.items
})
globalStore.getPlaces().then(res => {
    res.items.map(el => el.name = el.title + '  - (' + el.city + ' ' + el.typeTitle + ')')
    cities.value = lists.value.cities = res.citys
    places.value = lists.value.places = res.items
})
globalStore.getRoles([20, 120]).then((res) => {
    res.items.map(el => el.name = el.title)
    manageres.value = lists.value.manageres = res.items
})

globalStore.getUsers().then((res) => {
    res.items.map(el => el.name = el.title)
    manageres.value = lists.value.manageres = res.items
    manageres.value.forEach(item => {
        if (item.role === 110 || item.role === 111) ccEmployees.value.push(item);
    });
    lists.value.ccEmployees = ccEmployees.value
})

globalStore.getAppeals().then(res => {
    res.items.map(el => {
        el.name = el.title;
        el.id = el.value;
        return el
    })
    workflowTypes.value = res.items
    lists.value.workflowTypes = res.items
})

globalStore.getOrganizations().then((res) => organizations.value = lists.value.organizations = res.items)
globalStore.getPlaces().then(res => {
    res.items.map(el => el.name = el.title + '  - (' + el.city + ' ' + el.typeTitle + ')')
    cities.value = lists.value.cities = res.citys
    places.value = lists.value.places = res.items
})
globalStore.getRoles([20, 120]).then((res) => {
    res.items.map(el => el.name = el.title)
    manageres.value = lists.value.manageres = res.items
})

globalStore.getPlaces().then(res => {
    res.items.map(el => el.name = el.title + '  - (' + el.city + ' ' + el.typeTitle + ')')
    cities.value = lists.value.cities = res.citys
    places.value = lists.value.places = res.items
})

globalStore.getUsers().then((res) => {
    res.items.map(el => el.name = el.title)
    manageres.value = lists.value.manageres = res.items
    manageres.value.forEach(item => {
        if (item.role === 110 || item.role === 111) ccEmployees.value.push(item);
    });
    lists.value.ccEmployees = ccEmployees.value
})
export function getTagsLabel(tags, param, lists, key){
    lists.value = lists
    let name = ''

    if (!key) return false;

    switch (param) {
        case 'createDate':
            tags.value.push({param, name: 'Обращение: ' + formatDateDDMMYYYY(key), code: new Date(key)})
            break
        case 'locationCity':
            tags.value.push({param, name: 'г. ' + key, code: key})
            break
        case 'manager':
            name = manageres.value.find((el) => el.id === key).title
            name && tags.value.push({param, name: 'Менеджер: ' + name, code: key})
            break
        case 'ccEmployee':
            name = ccEmployees.value.find((el) => el.id === key).title
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
            var pl = places.value.find(el => el.id === key)
            name = pl.title + ' ' + pl.typeTitle
            tags.value.push({param, name: 'Место: ' + name, code: key})
            break
        case 'DealStatus':
            name = statuses.find((el) => el.id === key).name
            name && tags.value.push({param, name: 'Статус: ' + name, code: key})
            break
        case 'workflowLeadType':
            name = workflowTypes.value.find((el) => el.value === key).title
            name && tags.value.push({param, name: 'Тип обращения: ' + name, code: key})
            break
        case 'swapPhone':
            tags.value.push({param, name: 'Подменный номер: ' + key, code: key})
            break
        case 'carBrandId':
            var brand = brands.value.find((el) => el.id === key)
            name = brand && brand.name
            name && tags.value.push({param, name, code: brand.id})
            break
        case 'carModelId':
            var model = models.value.find((el) => el.id === key)
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
            name = categoryAutos.find((el) => el.id === key).name
            name && tags.value.push({param, name: 'Категория: ' + name, code: key})
            break
        case 'workflowStatus':
            name = statuses.find((el) => el.id === key).name
            name && tags.value.push({param, name: 'Статус: ' + name, code: key})
            break
        case 'clientStatus':
            name = clientStatuses.value.find((el) => el.value === key).title
            name && tags.value.push({param, name: 'Статус клиента: ' + name, code: key})
            break
        case 'bodyType':
            name = bodyTypes.find(el => el.id === key).name
            tags.value.push({param, name, code: key})
            break
        case 'bodyColorId':
            name = colors.value.find(el => el.id === key).colorName
            tags.value.push({param, name, code: key})
            break
        case 'lowEngineCapacity':
            tags.value.push({param, name: 'объем от ' + key, code: key})
            break
        case 'highEngineCapacity':
            tags.value.push({param, name: 'объем до ' + key, code: key})
            break
        case 'driveType':
            name = driveTypies.find(el => el.id === key).name
            tags.value.push({param, name, code: key})
            break
        case 'gearboxType':
            name = Object.keys(key).reduce((sum, el) => {
                return sum + kpp.find(item => item.id === key[el]).name + '; '
            }, '')
            key.length && tags.value.push({param, name, code: key})
            break
        case 'orgelement':
            name = organizations.value.find((el) => el.id === key).name
            name && tags.value.push({param, name: 'Организация: ' + name, code: key})
            break
    }
    return tags
}