<template>
  <main>
    <div class="filter-button">
      <el-button @click="buyFilterSelect(10)" :class="{ active: filter.mainFilter == 10 }">
        Все оценки:{{ fastFilter.buy }}
      </el-button>
      <el-button @click="buyFilterSelect(12)" :class="{ active: filter.mainFilter == 12 }"
      >По активным:{{ fastFilter.buyByActive }}
      </el-button>
      <el-button @click="buyFilterSelect(11)" :class="{ active: filter.mainFilter == 11 }"
      >На продаже:{{ fastFilter.buyOnSale }}
      </el-button>
      <el-button @click="buyFilterSelect(13)" :class="{ active: filter.mainFilter == 13 }">
        Продано:{{ fastFilter.buySoldAuto }}
      </el-button>
      <el-button @click="buyFilterSelect(14)" :class="{ active: filter.mainFilter == 14 }">
        Возврат:{{ fastFilter.returned }}
      </el-button>
    </div>

    <div class="a-search" :style="searchInputStyle">
      <input
          type="search"
          placeholder="Поиск по VIN"
          v-model="searchText"
          @keyup.enter="toSearch"
      />
      <el-button @click.prevent="openFilter()">
        <img
            alt=""
            class="filter-button"
            :class="{ open: isFilterOpened }"
            src="@/assets/icons/icon-menu-arrow-down.png"
        />
      </el-button>
    </div>

    <div class="open-filter" :class="{ open: isFilterOpened }">
      <DealFilters
          ref="dealFilter"
          style="min-height: 0; overflow: hidden"
          v-model="searchFilter"
          @changeFilter="changeFilter"
          @keyup.enter="toSearch"
      />
    </div>

    <div class="tags">
      <span v-for="(el,ind) in TAGS" :key="ind">
        {{ el.name }}
        <b @click="removeFilter(el)">✖</b>
      </span>
    </div>

    <div style="text-align: center">
      <el-button @click="toSearch" v-if="isFilterOpened">Искать</el-button>
      <el-button @click="clearSearch" v-if="isFilterOpened">Очистить фильтр</el-button>
    </div>
    <!-- для компа таблица -->
    <el-table
        style="margin-top: 24px"
        v-if="!globalStore.isMobileView"
        :data="workflowStore.list"
        ref="singleTableRef"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Автомобиль">
        <template #default="scope">
          <span class="red-text">
            {{ scope.row.brand }} {{ scope.row.model }} {{ scope.row.yearReleased }}<br
          /></span>
          {{ scope.row.vin }}<br/>
          <button
              class="deal-car-color"
              disabled
              :style="{ 'background-color': scope.row.bodyColorCode }"
          ></button>
          &nbsp; Пробег:{{ scope.row.rowmileage }}
        </template>
      </el-table-column>
      <el-table-column label="Менеджер">
        <template #default="scope">
          <b>{{ scope.row.userName }}</b
          ><br/>
          {{ scope.row.location }}<br/>
          <b>{{ scope.row.locationCity }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Статус">
        <template #default="scope">
          <span class="red-text"> {{ scope.row.statusTitle }} </span><br/>
          {{ scope.row.dealTypeTitle }}<br/>
          {{ formatDate(scope.row.created) }}
        </template>
      </el-table-column>

      <el-table-column prop="" label=""/>
    </el-table>

    <!-- для мобилки таблица -->
    <div class="vertical-table" v-if="globalStore.isMobileView" style="width: 100vw">
      <div v-for="row in workflowStore.list" :key="row.id">
        <div class="head">
          <span class="deal-car-color" :style="{ 'background-color': row.bodyColorCode }"></span>
          <span>Пробег:{{ row.rowmileage }} </span>
          <span>vin: {{ row.vin }}</span>
        </div>
        <div><small>Авто:</small> {{ row.brand }} {{ row.model }} {{ row.yearReleased }}</div>
        <div><small>Менеджер:</small> {{ row.userName }}</div>
        <div><small>Место: </small> {{ row.locationCity }}/ {{ row.location }}</div>
        <div><small>Статус:</small> {{ row.statusTitle }}</div>
        <div><small>Клиент:</small> {{ row.clientTitle }}</div>
        <div><small>Дата:</small> {{ formatDate(row.created) }}</div>
      </div>
      <div v-if="!workflowStore.list.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="workflowStore.list.length">
      <el-pagination
          v-model:page-size="rowsPerPage"
          layout="prev, pager, next"
          @current-change="changePage"
          :total="total"
      />
      <div class="page-info">Показаны {{ pageDescription }} из {{ total }}</div>
    </template>
  </main>
</template>

<script setup lang="ts">
import {reactive, ref, computed} from 'vue'
import {useWorkflowStore} from '@/stores/workflowStore'
import {useGlobalStore} from '@/stores/globalStore'
import {formatDate, formatDateDDMMYYYY, gotoTop} from '@/utils/globalFunctions'
import {ElTable} from 'element-plus'
import DealFilters from '@/components/FilterCtrl.vue'

const globalStore = useGlobalStore()
const workflowStore = useWorkflowStore()
const searchText = ref('')
const total = ref(0)
const rowsPerPage = ref(5)
const currentPage = ref(1)
const fastFilter = reactive({buy: 0, buyByActive: 0, buyOnSale: 0, buySoldAuto: 0, returned: 0})
const isFilterOpened = ref(false)
const dealFilter = ref<InstanceType<DealFilters | null>>(null)
const filter = {
  filter: {},
  id: '',
  limit: rowsPerPage.value,
  mainFilter: 10,
  offset: 0,
  search: ''
}
const searchFilter = ref({
  createDate: null,
  carBrandId: null,
  carModelId: null,
  lowYearReleased: null,
  highYearReleased: null,
  lowEngineCapacity: null,
  highEngineCapacity: null,
  driveType: null,
  gearboxType: null,
  locationCity: null,
  orgelement: null,
  manager: null
})
const TAGS = ref([])

function toSearch() {
  filter.search = searchText.value
  let s = searchFilter.value

  filter.filter = dealFilters || {}

  if (s.createDate) filter.filter.createDate = formatDateDDMMYYYY(s.createDate)
  else delete filter.filter.createDate

  if (s.carBrandId) filter.filter.carBrandId = s.carBrandId
  else delete filter.filter.carBrandId

  if (s.carModelId) filter.filter.carModelId = s.carModelId
  else delete filter.filter.carModelId

  if (s.lowYearReleased) filter.filter.lowYearReleased = s.lowYearReleased
  else delete filter.filter.lowYearReleased

  if (s.highYearReleased) filter.filter.highYearReleased = s.highYearReleased
  else delete filter.filter.highYearReleased

  if (s.lowEngineCapacity) filter.filter.lowEngineCapacity = s.lowEngineCapacity
  else delete filter.filter.lowEngineCapacity

  if (s.highEngineCapacity) filter.filter.highEngineCapacity = s.highEngineCapacity
  else delete filter.filter.highEngineCapacity

  if (s.driveType) filter.filter.driveType = s.driveType
  else delete filter.filter.driveType

  if (s.gearboxType && s.gearboxType.length) filter.filter.gearboxType = s.gearboxType
  else delete filter.filter.gearboxType

  if (s.locationCity) filter.filter.locationCity = s.locationCity
  else delete filter.filter.locationCity

  if (s.orgelement) filter.filter.orgelement = s.orgelement
  else delete filter.filter.orgelement

  if (s.manager) filter.filter.manager = s.manager
  else delete filter.filter.manager

  let length = Object.keys(filter.filter).length
  if (length) localStorage.setItem('dealFilters', JSON.stringify(filter.filter))
  getData()
}

function clearSearch() {
  filter.filter = {}
  localStorage.removeItem('dealFilters')
  toSearch()
}

function removeFilter(element) {
  console.log(element)
  TAGS.value = TAGS.value.filter(el => el.word != element.word)
}

const searchInputStyle = computed(() => {
  return globalStore.isMobileView ? {textAlign: 'center'} : {float: 'right'}
})

const pageDescription = computed(() => {
  let start = (currentPage.value - 1) * rowsPerPage.value + 1
  let end = start + rowsPerPage.value - 1
  return start + ' - ' + end
})
const singleTableRef = ref<InstanceType<typeof ElTable>>()
const setCurrent = (row) => {
  console.log('row', row)
  singleTableRef.value!.setCurrentRow(row)
}

function changeFilter(tags) {
  TAGS.value = tags
}

function openFilter() {
  isFilterOpened.value = !isFilterOpened.value
  setTimeout(dealFilter.value.open)
}

function buyFilterSelect(val: number) {
  filter.mainFilter = val
  filter.offset = 0
  getData()
}

function changePage(val: number) {
  currentPage.value = val
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
  if (globalStore.isMobileView) gotoTop()
}

function getData() {
  filter.filter = (filter.filter === '{}') ? filter.filter : JSON.stringify(filter.filter)

  globalStore.isWaiting = true
  workflowStore.getBuyWorkflows(filter).then((res) => {
    globalStore.isWaiting = false
    fastFilter.buy = res.buyDealsCount
    fastFilter.buyByActive = res.buyByActiveCount
    fastFilter.buyOnSale = res.buyOnSellAutoCount
    fastFilter.buySoldAuto = res.buySoldAutoCount
    fastFilter.returned = res.buyReturnedAutoCount
    total.value = res.totalCount
  })
}

let dealFilters = localStorage.getItem('dealFilters') || ''
if (dealFilters) {
  dealFilters = JSON.parse(dealFilters)
  Object.assign(searchFilter.value, dealFilters)
} else dealFilters = ''

toSearch()
</script>