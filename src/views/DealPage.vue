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
        @keyup.enter="toSearch"
      />
    </div>

    <div style="text-align: center">
      <el-button @click="toSearch" v-if="isFilterOpened">Искать</el-button>
      <el-button @click="toSearch" v-if="isFilterOpened">Очистить фильтр</el-button>
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

      <el-table-column prop="" label="" />
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
    <el-pagination
      v-if="!globalStore.isMobileView && total > rowsPerPage.value"
      v-model:page-size="rowsPerPage"
      layout="prev, pager, next"
      @current-change="changePage"
      :total="total"
    />
    <div class="page-info" v-if="!globalStore.isMobileView && total > rowsPerPage.value">
      Показаны {{ pageDescription }} из {{ total }}
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useWorkflowStore } from '@/stores/workflowStore'
import { useGlobalStore } from '@/stores/globalStore'
import { formatDate, formatDateDDMMYYYY, gotoTop } from '@/utils/globalFunctions'
import { ElTable } from 'element-plus'
import DealFilters from '@/components/DealFilters.vue'

const globalStore = useGlobalStore()
const workflowStore = useWorkflowStore()
const searchText = ref('')
const total = ref(0)
const rowsPerPage = ref(5)
const currentPage = ref(1)
const fastFilter = reactive({ buy: 0, buyByActive: 0, buyOnSale: 0, buySoldAuto: 0, returned: 0 })
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

function toSearch() {
  filter.search = searchText.value
  filter.filter = {}
  if (searchFilter.value.createDate)
    filter.filter.createDate = formatDateDDMMYYYY(searchFilter.value.createDate)
  if (searchFilter.value.brand) filter.filter.carBrandId = searchFilter.value.brand
  if (searchFilter.value.model) filter.filter.carModelId = searchFilter.value.model
  if (searchFilter.value.lowYearReleased)
    filter.filter.lowYearReleased = searchFilter.value.lowYearReleased
  if (searchFilter.value.highYearReleased)
    filter.filter.highYearReleased = searchFilter.value.highYearReleased
  if (searchFilter.value.lowEngineCapacity)
    filter.filter.lowEngineCapacity = searchFilter.value.lowEngineCapacity
  if (searchFilter.value.highEngineCapacity)
    filter.filter.highEngineCapacity = searchFilter.value.highEngineCapacity
  if (searchFilter.value.driveType) filter.filter.driveType = searchFilter.value.driveType
  if (searchFilter.value.gearboxType.length)
    filter.filter.gearboxType = searchFilter.value.gearboxType
  if (searchFilter.value.locationCity) filter.filter.locationCity = searchFilter.value.locationCity
  if (searchFilter.value.orgelement) filter.filter.orgelement = searchFilter.value.orgelement
  if (searchFilter.value.manager) filter.filter.manager = searchFilter.value.manager

  getData()
}

const searchInputStyle = computed(() => {
  return globalStore.isMobileView ? { textAlign: 'center' } : { float: 'right' }
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

function openFilter() {
  isFilterOpened.value = !isFilterOpened.value
  setTimeout(() => {
    console.log('dealFilter.value', dealFilter.value)
    dealFilter.value.open()
  })

  // setTimeout(dealFilter.value.open)
}

function buyFilterSelect(val: number) {
  filter.mainFilter = val
  getData()
}

function changePage(val) {
  currentPage.value = val
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
  if (globalStore.isMobileView) gotoTop()
}

function getData() {
  filter.filter = JSON.stringify(filter.filter)

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

onMounted(() => {
  getData()
})
</script>