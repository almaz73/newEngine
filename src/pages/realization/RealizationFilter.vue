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
const managers = ref([])
const organizations = ref([])
const tags = ref([])
const workflowTypes = ref([])
const colors = ref([])
const ccEmployees = ref([])
const clientStatuses = ref([])
let oldCarBrandId = null

const lists = ref({bodyTypes, buyTypes, categoryAutos, driveTypies, kpp, statuses})

const fields = [
  {
    type: '9. Две даты',
    label: 'Период',
    name1: 'lowCreateDatePeriod', placeholder1: 'Выберите дату',
    name2: 'highCreateDatePeriod', placeholder2: 'Выберите дату'
  },{
    type: '1.Дата', label: 'Дата', name: 'createDate', placeholder: 'Выберите дату'
  }, {
    type: '10. Число', label: 'Номер обращения', name: 'dealNumber'
  }, {
    type: '2. Список', listName: 'statuses',
    label: 'Статус',
    name: 'DealStatus',
    placeholder: 'Выберите статус'
  },{
    type: '4. Зависимые списки', label: 'Модель', listName1: 'brands', listName2: 'models',
    name1: 'carBrandId', placeholder1: 'Выберите бренд',
    name2: 'carModelId', placeholder2: 'Выберите модель'
  }, {
    type: '2. Список без кодов', listName: 'cities',
    label: 'Город',
    name: 'locationCity',
    placeholder: 'Выберите город'
  },{
    type: '2. Список', listName: 'organizations',
    label: 'Организация',
    name: 'orgelement',
    placeholder: 'Выберите организацию'
  },{
    type: '2. Список', listName: 'managers',
    label: 'Менеджер',
    name: 'manager',
    placeholder: 'Выберите менеджера'
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
  globalRef.tags = getTags(tags,vModel, lists)
  globalRef.isChanged = true
}

function open() {
  lists.value.years = Years
  lists.value.capacities = Capacities

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
  globalStore.getColors().then(res => colors.value = lists.value.colors = res.items)
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
  globalStore.getRoles({roles:[20, 120]}).then((res) => {
    res.items.map(el => el.name = el.title)
    managers.value = lists.value.managers = res.items
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