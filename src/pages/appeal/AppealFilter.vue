<template>
  <div class="deal-filters">
    <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields"/>

    <a @click="isMoreFilter=!isMoreFilter">Дополнительный фильтер </a>
    <!--    Скрытая часть-->
    <div class="more-filter" :class="{open:isMoreFilter}">
      <div style="min-height: 0; overflow: hidden">
        <FilterFieldsCtrl @changed="changed" :lists="lists" :vModel="vModel" :fields="fields_additional"/>
      </div>
    </div><!--    Конец скрытой части-->
    <div style="clear: both"></div>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {bodyTypes, buyTypes, categoryAutos, driveTypies, kpp, statuses, Years} from '@/utils/globalConstants'
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
const managers = ref([])
const tags = ref([])
const workflowTypes = ref([])
const isMoreFilter = ref(false)
const ccEmployees = ref([])
const clientStatuses = ref([])
let oldCarBrandId = null

const lists = ref({bodyTypes, buyTypes, categoryAutos, driveTypies, kpp, statuses})

const fields = [
  {
    type: '2. Список без кодов', listName: 'cities',
    label: 'Город',
    name: 'locationCity',
    placeholder: 'Выберите город'
  }, {
    type: '2. Список', listName: 'places',
    label: 'Подразделение',
    name: 'locationId',
    placeholder: 'Выберите место'
  }, {
    type: '2. Список', listName: 'managers',
    label: 'Менеджер',
    name: 'manager',
    placeholder: 'Выберите менеджера'
  }, {
    type: '9. Две даты',
    label: 'Период',
    name1: 'lowCreateDatePeriod', placeholder1: 'Выберите дату',
    name2: 'highCreateDatePeriod', placeholder2: 'Выберите дату'
  }, {
    type: '1.Дата', label: 'Дата обращения', name: 'createDate', placeholder: 'Выберите дату'
  }, {
    type: '10. Число', label: 'Номер обращения', name: 'dealNumber'
  }
]

const fields_additional = [
  {
    type: '10. Число', label: 'Подменный номер', name: 'swapPhone'
  }, {
    type: '2. Список', listName: 'workflowTypes',
    label: 'Тип обращения',
    name: 'workflowLeadType',
    placeholder: 'Выберите тип обращения'
  }, {
    type: '4. Зависимые списки', label: 'Модель', listName1: 'brands', listName2: 'models',
    name1: 'carBrandId', placeholder1: 'Выберите бренд',
    name2: 'carModelId', placeholder2: 'Выберите модель'
  }, {
    type: '5. Две даты (годы)', label: 'Год выпуска', listName: 'years',
    name1: 'lowYearReleased', placeholder1: 'Выберите год',
    name2: 'highYearReleased', placeholder2: 'Выберите год'
  }, {
    type: '8. Два числа',
    label: 'Пробег, км',
    name1: 'lowMileage', placeholder1: 'Введите пробег',
    name2: 'highMileage', placeholder2: 'Введите пробег'
  }, {
    type: '2. Список', listName: 'categoryAutos',
    label: 'Категория',
    name: 'categoryAuto',
    placeholder: 'Выберите категорию'
  }, {
    type: '2. Список', listName: 'ccEmployees',
    label: 'Сотрудник КЦ',
    name: 'ccEmployee',
    placeholder: 'Выберите сотрудника'
  }, {
    type: '2. Список', listName: 'statuses',
    label: 'Статус обращения',
    name: 'workflowStatus',
    placeholder: 'Выберите статус'
  }, {
    type: '2. Список', listName: 'clientStatuses',
    label: 'Статус клиента',
    name: 'clientStatus',
    placeholder: 'Выберите статус клиента'
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
}

function open() {
  lists.value.years = Years
  globalStore.getBrands().then(res => brands.value = lists.value.brands = res)
  globalStore.getClientStatuses().then(res => {
    res.items.map(el => {
      el.name = el.title;
      el.id = el.value;
      return el
    })
    clientStatuses.value = lists.value.clientStatuses = res.items
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

  globalStore.getUsers().then((res) => {
    res.items.map(el => el.name = el.title)
    managers.value = lists.value.managers = res.items
    managers.value.forEach(item => {
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