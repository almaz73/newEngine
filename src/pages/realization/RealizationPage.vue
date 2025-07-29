<template>
  <main>
    <FilterButtonsCtrl
        :buttons="filterButtons"
        :isOpen="isFilterOpened"
        :placeholder="''"
        @openFilter="openFilter"
        @updateSearchText="val=>searchText=val"
        @getData="getData"
    />

    <div class="open-filter" :class="{ open: isFilterOpened }">
      <RealizationFilter
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
        class="big-table"
        v-if="!globalStore.isMobileView && realizationStore.list.length"
        :data="realizationStore.list"
        ref="singleTableRef"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Дата">
        <template #default="scope">
          <ColorButtons :statusTitle="scope.row.statusTitle"/>
          <div v-if="scope.row.appeal">{{ scope.row.id }} <span class="red-text">{{ scope.row.appeal.id }}</span></div>
          <div>{{ scope.row.created }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Покупатель">
        <template #default="scope">
          <div v-if="scope.row.client &&  scope.row.client.person"><b>
            {{ scope.row.client.person.lastName }} {{ scope.row.client.person.firstName }}</b></div>
          <div v-if="scope.row.client">{{ formattingPhone(scope.row.client.person.phone) }}</div>

        </template>
      </el-table-column>

      <el-table-column label="Продавец/Оформитель">
        <template #default="scope">
          <small v-if="scope.row.sell"> {{ scope.row.sell.createdUser.person.lastName }}
            {{ scope.row.sell.createdUser.person.firstName }} / </small>
          <small v-if="scope.row.user"> <b>{{ scope.row.user.person.lastName }} {{
              scope.row.user.person.firstName
            }}</b></small>
          <div v-if="scope.row.appeal && scope.row.appeal.location">{{ scope.row.appeal.location.city }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Реализация">
        <template #default="scope">
          <div v-if="scope.row.auto">🚓<b> {{  scope.row.auto.brandTitle  }} {{ scope.row.auto.modelTitle }}</b></div>
          <span v-if="scope.row.auto" style="white-space: nowrap"> {{ scope.row.auto.vin }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Марка">
        <template #default="scope">
          <span> GM1: {{ formatPrice(scope.row.gm1) }}</span><br/>

        </template>
      </el-table-column>

      <el-table-column label="Цена">
        <template #default="scope">
          <span style="border-radius: 4px; background-color: #a4a4a4;color: white; padding: 3px 12px;">
            {{ formatPrice(scope.row.totalPriceSum) }}</span><br/>
          {{ formatDate(scope.row.lastTaskDate) }}<br/>
        </template>
      </el-table-column>

      <el-table-column label="Кредит">
        <template #default="scope">
          <span class="red-text"> {{ scope.row.lastTaskTitle }} </span><br/>
          {{ formatDate(scope.row.lastTaskDate) }}<br/>
        </template>
      </el-table-column>

      <el-table-column prop="" label=""/>
    </el-table>

    <!-- для мобилки таблица -->
    <div class="vertical-table" v-if="globalStore.isMobileView" style="width: 100vw">
      <div v-for="(row, ind) in realizationStore.list" :key="ind">
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
      <div v-if="!realizationStore.list.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="realizationStore.list.length>2">
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
import {carColor, formatDate, formatPrice, formattingPhone, gotoTop} from "@/utils/globalFunctions";
import FilterButtonsCtrl from "@/components/filterCtrl/FilterButtonsCtrl.vue";
import FilterTagsCtrl from "@/components/filterCtrl/FilterTagsCtrl.vue";
import RealizationFilter from "@/pages/realization/RealizationFilter.vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {useRealizationStore} from "@/stores/realizationStore";
import {computed, onMounted, reactive, ref} from 'vue'
import {globalRef} from '@/components/filterCtrl/FilterGlobalRef.js';
import ColorButtons from "@/controls/ColorButtons.vue";


const globalStore = useGlobalStore()
const realizationStore = useRealizationStore()
const total = ref(0)
const searchText = ref('')
const rowsPerPage = ref(5)
const currentPage = ref(1)
const filterButtons = reactive([
  {type: 'totalCount', count: 0, name: 'Все:', code: 10, active: true},
])
const isFilterOpened = ref(false)
const searchFilter = ref({})
const dealFilter = ref(null)
const filter = {
  filter: {},
  limit: rowsPerPage.value,
  offset: 0,
  search: ''
}
let filterOld; // кучковый способ запросов

function openFilter() {
  isFilterOpened.value = !isFilterOpened.value
  dealFilter.value.open()
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
    if (!val) return true
    if (!(val instanceof Array)) easy[el] = searchFilter.value[el]
    else if (val.length > 1) easy[el] = searchFilter.value[el]
  })
  filterOld = Object.assign({}, filter, easy) // filter.filter = JSON.stringify(easy)

  if (globalRef.tags.length) localStorage.setItem('realizationFilters', JSON.stringify(globalRef.tags))
  else localStorage.removeItem('realizationFilters')

  return false
}

function getData() {
  if (validateFilter()) return false;
  globalStore.isWaiting = true
  realizationStore.getRealization(filterOld).then(res => {
    globalStore.isWaiting = false
    if (!res) return console.warn('НЕТ ДАННЫХ')
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.totalCount
  })
}

onMounted(() => {
  globalStore.setTitle('Реализация')
  let realizationFilters = localStorage.getItem('realizationFilters') || ''
  if (realizationFilters) {
    realizationFilters = JSON.parse(realizationFilters)
    globalRef.tags = realizationFilters
    realizationFilters.forEach(el => searchFilter.value[el.param] = el.code)
  } else globalRef.tags = []

  getData()
})


</script>