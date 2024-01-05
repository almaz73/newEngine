<template>
  <div class="deal-filters">
    <a @click="isMoreFilter=!isMoreFilter">Дополнительный фильтер </a>
    <!--    Скрытая часть-->
    <div class="more-filter" :class="{open:isMoreFilter}">
      <div style="min-height: 0; overflow: hidden">
        <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields_additional"/>
      </div>
    </div>
    <!--    Конец скрытой части-->

    <br>
    <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields"/>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {driveTypies, kpp, buyTypes, bodyTypes, statuses} from '@/utils/globalConstants'
import {globalRef} from "@/components/filterControls/FilterGlobalRef";
import {getTags} from "@/components/filterControls/FilterGetTags";

import FilterFieldsCtrl from "@/components/filterControls/FilterFieldsCtrl.vue";

const emit = defineEmits(['update:modelValue', 'changeFilter', 'getData'])
const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const props = defineProps(['modelValue'])
const globalStore = useGlobalStore()
const brands = ref([])
let oldCarBrandId = null
const models = ref([])
const years = ref([])
const capacities = ref([])


const cities = ref([])
const places = ref([])
const organizations = ref([])
const manageres = ref([])
const tags = ref([])
const treatments = ref([])
const isMoreFilter = ref(false)
const colors = ref([])
const lists = ref({driveTypies, kpp, buyTypes, bodyTypes, statuses})

const fields = [
  {type: '1.Дата', label: 'Дата создания', name: 'createDate', placeholder: 'Выберите дату'},
  {
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
    type: '2. Список без кодов', listName: 'cities',
    label: 'Город',
    name: 'locationCity',
    placeholder: 'Выберите город'
  }, {
    type: '2. Список', listName: 'manageres',
    label: 'Менеджер',
    name: 'manager',
    placeholder: 'Выберите менеджера'
  }, {
    type: '2. Список', listName: 'organizations',
    label: 'Организация',
    name: 'orgelement',
    placeholder: 'Выберите организацию'
  }, {
    type: '2. Список', listName: 'buyTypes',
    label: 'Тип выкупа',
    name: 'buyType',
    placeholder: 'Выберите тип выкупа'
  }, {
    type: '2. Список', listName: 'treatments',
    label: 'Источник',
    name: 'treatmentSource',
    placeholder: 'Выберите источник'
  }, {
    type: '7. Госномер',
    label: 'Гос.номер',
    name: 'registrationMark',
  }
]

const fields_additional = [
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
    type: '9. Две даты',
    label: 'Период оценок',
    name1: 'lowCreateDatePeriod', placeholder1: 'Выберите дату',
    name2: 'highCreateDatePeriod', placeholder2: 'Выберите дату'
  }, {
    type: '2. Список', listName: 'places',
    label: 'Местонахождение',
    name: 'locationId',
    placeholder: 'Выберите место'
  }, {
    type: '2. Список', listName: 'statuses',
    label: 'Статус',
    name: 'DealStatus',
    placeholder: 'Выберите статус'
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
  globalStore.getModels(id).then((res) => {
    models.value = res
    lists.value.models = res
  })
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
  globalRef.tags = getTags(tags,vModel, lists)
}

function open() {
  if (brands.value.length) return false;
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
  globalStore.getTeatments().then(res => treatments.value = lists.value.treatments = res.items)
  globalStore.getColors().then((res) => {
    res.items.map(el => el.name = el.colorName)
    colors.value = lists.value.colors = res.items
  })
  globalStore.getRoles([20, 120]).then((res) => {
    res.items.map(el => el.name = el.title)
    manageres.value = lists.value.manageres = res.items
  })
  globalStore.getPlaces().then((res) => {
    res.items.map(el => el.name = el.title + '  - (' + el.city + ' ' + el.typeTitle + ')')
    cities.value = lists.value.cities = res.citys
    places.value = lists.value.places = res.items
  })

  if (vModel.value.carBrandId) {
    let id = oldCarBrandId = vModel.value.carBrandId
    globalStore.getModels(id).then((res) => (models.value = res))
    changeBrand(vModel.value.carBrandId)
  }
}

defineExpose({open})
</script>