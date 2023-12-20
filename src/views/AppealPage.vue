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
        :data="appealStore.list"
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
      <div v-for="(row, ind) in appealStore.list" :key="ind">
        <div class="head">
          <span class="deal-car-color" :style="row"></span>
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
      <div v-if="!appealStore.list.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="appealStore.list.length>2">
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
import {formatDate, gotoTop} from "@/utils/globalFunctions";
import FilterButtonsCtrl from "@/components/dealFilter/FilterButtonsCtrl.vue";
import FilterTagsCtrl from "@/components/dealFilter/FilterTagsCtrl.vue";
import FilterCtrl from "@/components/dealFilter/FilterCtrl.vue";
import {ElMessage, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {useAppealStore} from "@/stores/appealStore";
import {reactive, ref, computed} from 'vue'
import {store} from '@/components/dealFilter/dealStore.js';


const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const total = ref(0)
const searchText = ref('')
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
const searchFilter = ref({})
const dealFilter = ref(null)
const filter = {
  filter: {},
  limit: rowsPerPage.value,
  mainFilter: 10,
  offset: 0,
  search: ''
}

function colorBox(txt) {
  if (txt === 'Новый') return {background: '#0187af'}
  if (txt === 'В работе') return {background: '#308a5a'}

}

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

const pageDescription = computed(() => {
  let start = (currentPage.value - 1) * rowsPerPage.value + 1
  let end = start + rowsPerPage.value - 1
  return start + ' - ' + end
})

function validateVin(vin) {
  var re = new RegExp("^[A-HJ-NPR-Z\\d]{13}\\d{4}$", "i");
  return vin.match(re);
}

function getData() {

  if (searchText.value) {
    filter.search = searchText.value
    if (!validateVin(filter.search)) ElMessage({message: 'Неверный VIN.', type: 'warning',})
  }

  if (searchFilter.value.registrationMark) {
    if (searchFilter.value.registrationMark.length < 12) return ElMessage({
      message: 'Неверный ГосНомер.',
      type: 'warning',
    })
  }

  let essy = {}

  Object.keys(searchFilter.value).forEach(el => {
    if (searchFilter.value[el] instanceof Array) {
      if (searchFilter.value[el].length) essy[el] = searchFilter.value[el]
    } else if (searchFilter.value[el]) essy[el] = searchFilter.value[el]
  })

  filter.filter = essy
  filter.filter = (filter.filter === '{}') ? filter.filter : JSON.stringify(filter.filter)
  //
  //
  store.tags.length && localStorage.setItem('dealFilters', JSON.stringify(store.tags))
  globalStore.isWaiting = true
  appealStore.getAppeals(filter).then((res) => {
    globalStore.isWaiting = false
    if (!res) return console.log('НЕТ ДАННЫХ')
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.totalCount
  })
}

getData()

</script>