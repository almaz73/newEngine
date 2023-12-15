<template>
  <main>
    <FilterButtonsCtrl
        :filter="filter"
        :buttons="filterButtons"
        :isOpen="isFilterOpened"
        @buyFilterSelect="buyFilterSelect"
        @openFilter="openFilter"
        @updateSearchText="val=>searchText=val"
        @toSearch="toSearch"
    />

    <div class="open-filter" :class="{ open: isFilterOpened }">
      <FilterCtrl
          ref="dealFilter"
          style="min-height: 0; overflow: hidden"
          v-model="searchFilter"
          @changeFilter="changeFilter"
          @keyup.enter="toSearch"
      />
    </div>
    <FilterResultCtrl :TAGS="TAGS"
                      :isOpen="isFilterOpened"
                      :searchFilter="searchFilter"
                      :searchText="searchText"
                      @toSearch="toSearch"
    />

    <div style="text-align: center">
      <!--      <el-button @click="toSearch" v-if="isFilterOpened">Искать</el-button>-->
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
    <template v-if="workflowStore.list.length>2">
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
import FilterCtrl from '@/components/dealFilter/FilterCtrl.vue'
import FilterResultCtrl from "@/components/dealFilter/FilterResultCtrl.vue"
import FilterButtonsCtrl from "@/components/dealFilter/FilterButtonsCtrl.vue";

const globalStore = useGlobalStore()
const workflowStore = useWorkflowStore()
const searchText = ref('')
const total = ref(0)
const rowsPerPage = ref(5)
const currentPage = ref(1)
const filterButtons = reactive([
  {type: 'buyDealsCount', count: 0, name: 'Все оценки:', code: 10, active: true},
  {type: 'buyByActiveCount', count: 0, name: 'По активным:', code: 12},
  {type: 'buyOnSellAutoCount', count: 0, name: 'На продаже:', code: 11},
  {type: 'buySoldAutoCount', count: 0, name: 'Продано:', code: 13},
  {type: 'buyReturnedAutoCount', count: 0, name: 'Возврат:', code: 14}
])
const isFilterOpened = ref(false)
const dealFilter = ref<InstanceType<FilterCtrl | null>>(null)
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
  console.log('222 filter', filter)

  if (length) localStorage.setItem('filterCtrl', JSON.stringify(filter.filter))
  getData()
}

function clearSearch() {
  filter.filter = {}
  localStorage.removeItem('filterCtrl')
  toSearch()
}

// function removeFilter(element) {
//   console.log(element)
//   TAGS.value = TAGS.value.filter(el => el.word != element.word)
// }


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
    if (!res) return console.log('НЕТ ДАННЫХ')
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.totalCount
  })
}

let filterCtrl = localStorage.getItem('filterCtrl') || ''
if (filterCtrl) {
  filterCtrl = JSON.parse(filterCtrl)
  Object.assign(searchFilter.value, filterCtrl)
} else filterCtrl = ''

toSearch()
</script>