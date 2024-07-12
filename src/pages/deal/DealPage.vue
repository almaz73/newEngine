<template>
  <main>
    <FilterButtonsCtrl
      :buttons="filterButtons"
      :isOpen="isFilterOpened"
      :placeholder="'Поиск по VIN'"
      @buttonFilterSelect="buttonFilterSelect"
      @openFilter="openFilter"
      @updateSearchText="val=>searchText=val"
      @getData="getData"
    />

    <div class="open-filter" :class="{ open: isFilterOpened }">
      <DealFilter
        ref="dealFilter"
        style="min-height: 0; overflow: hidden"
        v-model="searchFilter"
        @keyup.enter="getData"
        @getData="getData"
      />
    </div>

    <FilterTagsCtrl @getData="getData" />

    <!-- для компа таблица -->
    <el-table
      class="big-table"
      v-if="!globalStore.isMobileView"
      :data="dealList"
      ref="singleTableRef"
      empty-text="Нет данных"
      @row-dblclick="openPage"
      highlight-current-row
    >
      <el-table-column label="Автомобиль">
        <template #default="scope">
          <span class="red-text">
            {{ scope.row.brand }} {{ scope.row.model }} {{ scope.row.yearReleased }}<br
          /></span>
          {{ scope.row.vin }}<br />
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
          ><br />
          {{ scope.row.location }}<br />
          <b>{{ scope.row.locationCity }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Статус">
        <template #default="scope">
          <span class="red-text"> {{ scope.row.statusTitle }} </span><br />
          {{ scope.row.dealTypeTitle }}<br />
          {{ formatDate(scope.row.created) }}
        </template>
      </el-table-column>

      <el-table-column width="120">
        <template #default="scope">
          <img :src="scope.row.smallPhoto[0]" alt=""
               v-if="scope.row.smallPhoto && scope.row.smallPhoto[0]"
               class="img-in-table" />
        </template>
      </el-table-column>

      <el-table-column label="" width="60px">
        <template #default="scope">
          <CircleCateforyAvtoCtrl :categoryNumber="scope.row.categoryAuto" />
        </template>
      </el-table-column>

      <el-table-column label="" width="60px">
        <template #default="scope">
          <div v-if="scope.row.additionalInformation"
               :title="scope.row.additionalInformation" style="cursor: pointer">⌘
          </div>
        </template>
      </el-table-column>


    </el-table>

    <!-- для мобилки таблица -->
    <div class="vertical-table" v-if="globalStore.isMobileView" style="width: 100vw">
      <div v-for="(row, ind) in dealList" :key="ind">
        <div class="head">
          <span class="deal-car-color" :style="carColor(row)"></span>
          <span>Пробег: {{ row.rowmileage }} </span>
          <span>vin: {{ row.vin }}</span>
        </div>
        <div><small>Авто:</small> {{ row.brand }} {{ row.model }} {{ row.yearReleased }}</div>
        <div><small>Менеджер:</small> {{ row.userName }}</div>
        <div><small>Место: </small> {{ row.locationCity }}/ {{ row.location }}</div>
        <div><small>Статус:</small> {{ row.statusTitle }}</div>
        <div><small>Клиент:</small> {{ row.clientTitle }}</div>
        <div><small>Дата:</small> {{ formatDate(row.created) }}</div>
      </div>
      <div v-if="!dealList.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="dealList.length>2">
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
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { useDealStore } from '@/stores/dealStore'
import { useGlobalStore } from '@/stores/globalStore'
import { carColor, formatDate, gotoTop, validateVin } from '@/utils/globalFunctions'
import DealFilter from '@/pages/deal/DealFilter.vue'
import FilterButtonsCtrl from '@/components/filterCtrl/FilterButtonsCtrl.vue'
import FilterTagsCtrl from '@/components/filterCtrl/FilterTagsCtrl.vue'
import { globalRef } from '@/components/filterCtrl/FilterGlobalRef'
import router from '@/router'
import CircleCateforyAvtoCtrl from '@/controls/CircleCateforyAvtoCtrl.vue'

const globalStore = useGlobalStore()
const dealStore = useDealStore()
const searchText = ref('')
const total = ref(0)
const rowsPerPage = ref(5)
const currentPage = ref(1)
const dealList = ref([])
const filterButtons = reactive([
  { type: 'buyDealsCount', count: 0, name: 'Все оценки:', code: 10, active: true },
  { type: 'buyByActiveCount', count: 0, name: 'По активным:', code: 12 },
  { type: 'buyOnSellAutoCount', count: 0, name: 'На продаже:', code: 11 },
  { type: 'buySoldAutoCount', count: 0, name: 'Продано:', code: 13 },
  { type: 'buyReturnedAutoCount', count: 0, name: 'Возврат:', code: 14 }
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

const pageDescription = computed(() => {
  let start = (currentPage.value - 1) * rowsPerPage.value + 1
  let end = start + rowsPerPage.value - 1
  return start + ' - ' + end
})
const singleTableRef = ref()

function openFilter() {
  isFilterOpened.value = !isFilterOpened.value
  dealFilter.value.open()
}

function buttonFilterSelect(val) {
  filter.mainFilter = val
  filter.offset = 0
  getData()
  isFilterOpened.value = false
}


function openPage(row) {
  router.push({ name: 'editDeal', params: { id: row.autoId, appealId: row.id } })
}

function changePage(val) {
  currentPage.value = val
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
  if (globalStore.isMobileView) {
    gotoTop()
    isFilterOpened.value = false
  }
}

function changePageSize(val) {
  rowsPerPage.value = val
  filter.offset = 0
  filter.limit = rowsPerPage.value
  getData()
}


function validateFilter() {
  if (searchText.value) {
    filter.search = searchText.value
    if (!validateVin(filter.search)) ElMessage({ message: 'Неверный VIN.', type: 'warning' })
  }

  if (searchFilter.value.registrationMark && searchFilter.value.registrationMark.length < 12) {
    ElMessage({ message: 'Неверный ГосНомер.', type: 'warning' })
    return false
  }

  let easy = {}
  Object.keys(searchFilter.value).forEach(el => {
    let val = searchFilter.value[el]
    if (!val) return true
    if (!(val instanceof Array)) easy[el] = searchFilter.value[el]
    else if (val.length > 1) easy[el] = searchFilter.value[el]
  })
  filter.filter = JSON.stringify(easy)

  if (globalRef.tags.length) localStorage.setItem('dealFilters', JSON.stringify(globalRef.tags))
  else localStorage.removeItem('dealFilters')
}

function getData() {
  if (validateFilter()) return false
  globalStore.isWaiting = true
  dealStore.getDeals(filter).then(res => {
    dealList.value = res.deals
    globalStore.isWaiting = false
    if (!res) return console.warn('НЕТ ДАННЫХ')
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.totalCount
  })
}

onMounted(() => {
  globalStore.setTitle('Оценки')
  globalStore.steps = []
  let dealFilters = localStorage.getItem('dealFilters') || ''
  if (dealFilters) {
    dealFilters = JSON.parse(dealFilters)
    globalRef.tags = dealFilters
    dealFilters.forEach(el => searchFilter.value[el.param] = el.code)
  }

  getData()
})

</script>