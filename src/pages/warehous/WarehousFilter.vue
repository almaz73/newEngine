<template>
  <div class="deal-filters">
    <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields"/>
    <div style="clear: both"></div>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {bodyTypes, buyTypes, categoryAutos, driveTypies, kpp, statuses, Years, Capacities} from '@/utils/globalConstants'
import {globalRef} from "@/components/filterCtrl/FilterGlobalRef";
import FilterFieldsCtrl from "@/components/filterCtrl/FilterFieldsCtrl.vue";
import {getTags} from "@/components/filterCtrl/FilterGetTags";
import {tagsControl} from "@/utils/globalFunctions";

const emit = defineEmits(['update:modelValue', 'changeFilter', 'getData'])
const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const props = defineProps(['modelValue'])
const globalStore = useGlobalStore()
const brands = ref([])
const models = ref([])
const cities = ref([])
const places = ref([])
const tags = ref([])
const colors = ref([])
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
  }

]


watch(globalRef, () => tagsControl(globalRef, vModel))


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
  globalRef.tags = getTags(tags, vModel, lists)
  globalRef.isChanged = true
}

function open() {
  lists.value.years = Years
  lists.value.capacities = Capacities

  globalStore.getBrands().then(res => brands.value = lists.value.brands = res)
  globalStore.getColors().then((res) => {
    res.items.map(el => el.name = el.colorName)
    colors.value = lists.value.colors = res.items
  })
  globalStore.getPlaces().then(res => {
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