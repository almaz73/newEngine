<template>
  <main>
    <FilterButtonsCtrl
        :buttons="filterButtons"
        :isOpen="isFilterOpened"
        :placeholder="''"
        @buttonFilterSelect="buttonFilterSelect"
        @openFilter="openFilter"
        @updateSearchText="val=>searchText=val"
        @getData="getData"
    />

    <div class="open-filter" :class="{ open: isFilterOpened }">
      <WarehousFilter
          ref="dealFilter"
          style="min-height: 0; overflow: hidden"
          v-model="searchFilter"
          @keyup.enter="getData"
          @getData="getData"
      />
    </div>

    <FilterTagsCtrl @getData="getData"/>

    <!-- для компа таблица -->
    <el-table
        style="margin-top: 24px"
        v-if="!globalStore.isMobileView"
        :data="warehousStore.list"
        ref="singleTableRef"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Обращение">
        <template #default="scope">
          <div :style="colorBox(scope.row.statusTitle)"><b> {{ scope.row.statusTitle }}</b></div>
          <div class="red-text">{{ scope.row.id }}</div>
          <div>{{ formatDate(scope.row.lastTaskDate) }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Клиент">
        <template #default="scope">
          <div><b> {{ scope.row.leadName }}</b></div>
          <div> {{ scope.row.leadPhone }}</div>
          <div class="red-text">{{ scope.row.clientStatusTitle }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Менеджер">
        <template #default="scope">
          <div><b> {{ scope.row.createUserName }}</b></div>
          <div> {{ scope.row.locationName }}</div>
          <div class="red-text">{{ scope.row.city }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Автомобиль">
        <template #default="scope">
          <div><b> {{ scope.row.carBrandModel }}</b></div>
          <div> {{ scope.row.carBrandModel }}</div>
          <div class="red-text">{{ scope.row.vin }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Событие">
        <template #default="scope">
          <span class="red-text"> {{ scope.row.lastTaskTitle }} </span><br/>
          {{ formatDate(scope.row.lastTaskDate) }}<br/>
        </template>
      </el-table-column>

      <el-table-column prop="" label=""/>
    </el-table>

    <!-- для мобилки таблица -->
    <div class="vertical-table" v-if="globalStore.isMobileView" style="width: 100vw">
      <div v-for="(row, ind) in warehousStore.list" :key="ind">
        <div class="head">
          <span class="deal-car-color" :style="carColor(row)"></span>
          <span>Пробег: {{ row.rowmileage }} </span>
          <span style="font-size: small">vin: {{ row.vin }}</span>
        </div>
        <div><small>Авто:</small> {{ row.brand }} {{ row.model }} {{ row.yearReleased }}</div>
        <div><small>Менеджер:</small> {{ row.userName }}</div>
        <div><small>Место: </small> {{ row.locationCity }}/ {{ row.location }}</div>
        <div><small>Статус:</small> {{ row.statusTitle }}</div>
        <div><small>Клиент:</small> {{ row.clientTitle }}</div>
        <div><small>Дата:</small> {{ formatDate(row.created) }}</div>
      </div>
      <div v-if="!warehousStore.list.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="warehousStore.list && warehousStore.list.length>2">
      <el-pagination
          v-model:page-size="rowsPerPage"
          :page-sizes="[5, 10, 20, 50]"
          layout="prev, pager, next, sizes"
          @current-change="changePage"
          @size-change="changePageSize"
          :total="total"
      />
      <div class="page-info">Показаны {{ pageDescription }} из {{ total }}</div>
    </template>
  </main>
</template>
<script setup>
import {carColor, formatDate, gotoTop} from "@/utils/globalFunctions";
import FilterButtonsCtrl from "@/components/filterControls/FilterButtonsCtrl.vue";
import FilterTagsCtrl from "@/components/filterControls/FilterTagsCtrl.vue";
import WarehousFilter from "@/pages/warehous/WarehousFilter.vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {useWarehousStore} from "@/stores/warehousStore";
import {reactive, ref, computed, onMounted} from 'vue'
import {globalRef} from '@/components/filterControls/FilterGlobalRef.js';


const globalStore = useGlobalStore()
const warehousStore = useWarehousStore()
const total = ref(0)
const searchText = ref('')
const rowsPerPage = ref(5)
const currentPage = ref(1)
const filterButtons = reactive([
  {type: 'onSale', count: 0, name: 'На продаже:', code: 10, active: true},
  {type: 'noPrice', count: 0, name: 'Без цены:', code: 20},
  {type: 'noPhoto', count: 0, name: 'Без фото:', code: 30},
  {type: 'sold', count: 0, name: 'Продано:', code: 40},
  {type: 'priceNotInMarket', count: 0, name: 'Цена на рынке:', code: 50},
  {type: 'transit', count: 0, name: 'Транзит:', code: 60},
  {type: 'returned', count: 0, name: 'Возврат:', code: 70},
])
const isFilterOpened = ref(false)
const searchFilter = ref({})
const dealFilter = ref(null)
const filter = {
  limit: rowsPerPage.value,
  quickFilter: 10,
  skip: 0,
  search: ''
}
let filterOld; // кучковый способ запросов

function colorBox(txt) {
  if (txt === 'Новый') return {background: '#0187af'}
  if (txt === 'В работе') return {background: '#308a5a'}

}

function openFilter() {
  isFilterOpened.value = !isFilterOpened.value
  dealFilter.value.open()
}

function buttonFilterSelect(val) {
  filter.quickFilter = val
  filter.skip = 0
  getData()
  isFilterOpened.value = false
}

function changePage(val) {
  currentPage.value = val
  filter.skip = (val - 1) * rowsPerPage.value
  getData()
  if (globalStore.isMobileView) {
    gotoTop()
    isFilterOpened.value = false
  }
}

function changePageSize(val) {
  rowsPerPage.value = val
  filter.skip = 0
  filter.limit = rowsPerPage.value
  getData()
}

const pageDescription = computed(() => {
  let start = (currentPage.value - 1) * rowsPerPage.value + 1
  let end = start + rowsPerPage.value - 1
  return start + ' - ' + end
})

function validateFilter() {
  filter.search = searchText.value

  let easy = {}
  Object.keys(searchFilter.value).forEach(el => {
    let val = searchFilter.value[el]
    if (!val) return false
    if (!(val instanceof Array)) easy[el] = searchFilter.value[el]
    else if (val.length > 1) easy[el] = searchFilter.value[el]
  })
  filterOld = Object.assign({}, filter, easy) // filter.filter = JSON.stringify(easy)

  if (globalRef.tags.length) localStorage.setItem('warehousFilters', JSON.stringify(globalRef.tags))
  else localStorage.removeItem('warehousFilters')

  return true
}

function getData() {
  if (!validateFilter()) return false;
  globalStore.isWaiting = true
  warehousStore.getWarehouses(filterOld).then((res) => {
    globalStore.isWaiting = false
    if (!res) return console.warn('НЕТ ДАННЫХ')
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.total
  })
}

onMounted(() => {
  globalStore.setTitle('Склад')
  let warehousFilters = localStorage.getItem('warehousFilters') || ''
  if (warehousFilters) {
    warehousFilters = JSON.parse(warehousFilters)
    globalRef.tags = warehousFilters
    warehousFilters.forEach(el => searchFilter.value[el.param] = el.code)
  }

  getData()
})


</script>