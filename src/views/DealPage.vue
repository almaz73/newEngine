<template>
  <main>
    <FilterButtonsCtrl
        :buttons="filterButtons"
        :isOpen="isFilterOpened"
        @buttonFilterSelect="buttonFilterSelect"
        @openFilter="openFilter"
        @updateSearchText="val=>searchText=val"
        @getData="getData"
    />

    <div class="open-filter" :class="{ open: isFilterOpened }">
      <FilterCtrl
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
        :data="dealStore.list"
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
      <div v-for="(row, ind) in dealStore.list" :key="ind">
        <div class="head">
          <span class="deal-car-color" :style="carColor(row)"></span>
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
      <div v-if="!dealStore.list.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="dealStore.list.length>2">
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

<script setup>
import {reactive, ref, computed, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {useDealStore} from '@/stores/dealStore'
import {useGlobalStore} from '@/stores/globalStore'
import {formatDate, gotoTop, validateVin} from '@/utils/globalFunctions'
import {ElTable} from 'element-plus'
import FilterCtrl from '@/components/dealFilter/FilterCtrl.vue'
import FilterButtonsCtrl from "@/components/dealFilter/FilterButtonsCtrl.vue";
import FilterTagsCtrl from "@/components/dealFilter/FilterTagsCtrl.vue";
import {store} from '@/components/dealFilter/dealStore';

const globalStore = useGlobalStore()
const dealStore = useDealStore()
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
const dealFilter = ref(null)
const filter = {
  filter: {},
  limit: rowsPerPage.value,
  mainFilter: 10,
  offset: 0,
  search: ''
}
const searchFilter = ref({})

function carColor(row) {
  if (row && row.bodyColorCode) return {'background-color': row.bodyColorCode}
  return {}
}

const pageDescription = computed(() => {
  let start = (currentPage.value - 1) * rowsPerPage.value + 1
  let end = start + rowsPerPage.value - 1
  return start + ' - ' + end
})
const singleTableRef = ref()
// const setCurrent = (row) => {
//   singleTableRef.value.setCurrentRow(row)
// }

function openFilter() {
  isFilterOpened.value = !isFilterOpened.value
  dealFilter.value.open()
}

function buttonFilterSelect(val) {
  filter.mainFilter = val
  filter.offset = 0
  getData()
}

function changePage(val) {
  currentPage.value = val
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
  if (globalStore.isMobileView) gotoTop()
}


function validateFilter() {
  if (searchText.value) {
    filter.search = searchText.value
    if (!validateVin(filter.search)) ElMessage({message: 'Неверный VIN.', type: 'warning',})
  }

  if (searchFilter.value.registrationMark && searchFilter.value.registrationMark.length < 12) {
    ElMessage({message: 'Неверный ГосНомер.', type: 'warning',})
    return false
  }

  let essy = {}
  Object.keys(searchFilter.value).forEach(el => {
    if (searchFilter.value[el]) essy[el] = searchFilter.value[el]
  })

  filter.filter = essy
  filter.filter = (filter.filter === '{}') ? filter.filter : JSON.stringify(filter.filter)

  store.tags.length && localStorage.setItem('dealFilters', JSON.stringify(store.tags))
  return true
}

function getData() {
  if (!validateFilter()) return false;
  globalStore.isWaiting = true
  dealStore.getDeal(filter).then((res) => {
    globalStore.isWaiting = false
    if (!res) return console.warn('НЕТ ДАННЫХ')
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.totalCount
  })
}

onMounted(() => {
  let dealFilters = localStorage.getItem('dealFilters') || ''
  if (dealFilters) {
    dealFilters = JSON.parse(dealFilters)
    store.tags = dealFilters
    dealFilters.forEach(el => searchFilter.value[el.param] = el.code)
  }

  getData()
})

</script>