<template>
  <div class="deal-filters">
    <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields"/>
    <div style="clear: both"></div>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {bodyTypes, buyTypes, categoryAutos, driveTypies, kpp, statuses} from '@/utils/globalConstants'
import {globalRef} from "@/components/filterControls/FilterGlobalRef";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import FilterFieldsCtrl from "@/components/filterControls/FilterFieldsCtrl.vue";

const emit = defineEmits(['update:modelValue', 'changeFilter', 'getData'])
const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const props = defineProps(['modelValue'])
const globalStore = useGlobalStore()
const brands = ref([])
const models = ref([])
const years = ref([])
const capacities = ref([])


const cities = ref([])
const places = ref([])
const manageres = ref([])
const tags = ref([])
const workflowTypes = ref([])
const organizations = ref([])
const colors = ref([])
const ccEmployees = ref([])
const clientStatuses = ref([])
let oldCarBrandId = null

const lists = ref({bodyTypes, buyTypes, categoryAutos, driveTypies, kpp, statuses})

const fields = [
  {
    type: '8. Два числа',
    label: 'Пробег, км',
    name1: 'lowMileage', placeholder1: 'Введите пробег',
    name2: 'highMileage', placeholder2: 'Введите пробег'
  }, {
    type: '8. Два числа',
    label: 'Мощность двигателя',
    name1: 'lowEnginePowerHP', placeholder1: 'Введите мощность',
    name2: 'highEnginePowerHP', placeholder2: 'Введите мощность'
  }, {
    type: '2. Список', listName: 'bodyTypes',
    label: 'Тип кузова',
    name: 'bodyType',
    placeholder: 'Выберите тип кузова'
  }, {
    type: '2. Список', listName: 'colors',
    label: 'Цвет кузова',
    name: 'bodyColorId',
    placeholder: 'Выберите цвет кузова'
  }, {
    type: '2. Список', listName: 'places',
    label: 'Местонахождение',
    name: 'locationId',
    placeholder: 'Выберите место'
  }, {
    type: '2. Список без кодов', listName: 'cities',
    label: 'Город',
    name: 'locationCity',
    placeholder: 'Выберите город'
  }, {
    type: '4. Зависимые списки', label: 'Модель', listName1: 'brands', listName2: 'models',
    name1: 'carBrandId', placeholder1: 'Выберите бренд',
    name2: 'carModelId', placeholder2: 'Выберите модель'
  }, {
    type: '5. Две даты (годы)', label: 'Год выпуска', listName: 'years',
    name1: 'lowYearReleased', placeholder1: 'Выберите год',
    name2: 'highYearReleased', placeholder2: 'Выберите год'
  }, {
    type: '6. Два списка', label: 'Объем двигателя', listName: 'capacities',
    name1: 'lowEngineCapacity', placeholder1: 'Выберите объем',
    name2: 'highEngineCapacity', placeholder2: 'Выберите объем'
  }, {
    type: '2. Список', listName: 'driveTypies',
    label: 'Тип привода',
    name: 'driveType',
    placeholder: 'Выберите тип привода'
  }, {
    type: '3.Список c множественным выбором', listName: 'kpp',
    label: 'Тип КПП', name: 'gearboxType',
    placeholder: 'Выберите типы КПП'
  }, {
    type: '2. Список', listName: 'organizations',
    label: 'Организация',
    name: 'orgelement',
    placeholder: 'Выберите организацию'
  }

]


watch(globalRef, function () {
  let params = globalRef.tags.map(el => el.param)

  Object.keys(vModel.value).forEach(el => { // чистим контрол, если удалили тег
    if (!params.includes(el) && vModel.value[el]) vModel.value[el] = null
  })

  globalRef.tags.forEach(el => { // добавляем
    if (el.name) vModel.value[el.param] = el.code
  })
})


function changeBrand(id) {
  globalStore.getModels(id).then((res) => models.value = lists.value.models = res)
}

function changed() {

  // Если есть уже бренд авто, вытягиваем модели
  if (vModel.value.carBrandId && oldCarBrandId !== vModel.value.carBrandId) {
    vModel.value.carModelId = null
    oldCarBrandId = vModel.value.carBrandId
    changeBrand(vModel.value.carBrandId)
  }

  // создаем теги
  tags.value = []
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
  })
  globalRef.tags = tags.value
}

function open() {
  for (let z = new Date().getFullYear(); z > 1939; z--) {
    years.value.push({name: z})
  }
  for (let z = 800; z <= 6000; z = z + 100) {
    capacities.value.push({name: z})
  }
  lists.value.years = years.value
  lists.value.capacities = capacities.value

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

  if (vModel.value.carBrandId) {
    let id = oldCarBrandId = vModel.value.carBrandId
    globalStore.getModels(id).then((res) => (models.value = res))
    changeBrand(vModel.value.carBrandId)
  }
}

defineExpose({open})
</script>