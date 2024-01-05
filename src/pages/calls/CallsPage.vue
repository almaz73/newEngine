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
      <CallsFilterCtrl
          ref="callsFilter"
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
        :data="callsStore.list"
        ref="singleTableRef"
        empty-text="Нет данных"
        highlight-current-row
    >

      <el-table-column label="Номер">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column label="Дата начала">
        <template #default="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>

      <el-table-column label="Дата начала">
        <template #default="scope">
          {{ formatDate(scope.row.endDate) }}
        </template>
      </el-table-column>

      <el-table-column label="Клиент">
        <template #default="scope">
          {{ scope.row.sourcePhone }}
        </template>
      </el-table-column>
      <el-table-column label="Номер организации">
        <template #default="scope">
          <span>{{ scope.row.receiverPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Тип зхвонка">
        <template #default="scope">
          {{ scope.row.sourceTypeTitle }}
        </template>
      </el-table-column>

      <el-table-column prop="" label=""/>
    </el-table>

    <!-- для мобилки таблица -->
    <div class="vertical-table" v-if="globalStore.isMobileView" style="width: 100vw">
      <div v-for="(row, ind) in callsStore.list" :key="ind">
        <div class="head mobile-row-head">
          <span>Время звонка: {{ formatDate(row.createDate) }} </span>
        </div>
        <div><small>Тип звонка:</small> {{ row.sourceTypeTitle }}</div>
        <div><small>Клиент:</small> {{ row.sourcePhone }}</div>
        <div><small>Номер&nbsp;ор-ганизации: </small> {{ row.receiverPhone }}</div>
      </div>
      <div v-if="!callsStore.list.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="callsStore.list.length>2">
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
import {reactive, ref, computed, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {useCallsStore} from '@/stores/callsStore'
import {useGlobalStore} from '@/stores/globalStore'
import {formatDate, gotoTop, validateVin} from '@/utils/globalFunctions'
import {ElTable} from 'element-plus'
import CallsFilterCtrl from '@/pages/calls/CallsFilterCtrl.vue'


import FilterButtonsCtrl from "@/components/filterControls/FilterButtonsCtrl.vue";
import FilterTagsCtrl from "@/components/filterControls/FilterTagsCtrl.vue";
import {globalRef} from '@/components/filterControls/FilterGlobalRef';

const globalStore = useGlobalStore()
const callsStore = useCallsStore()
const searchText = ref('')
const total = ref(0)
const rowsPerPage = ref(5)
const currentPage = ref(1)
const filterButtons = reactive([
  {type: 'allCount', count: 0, name: 'Все:', code: 10, active: true},
])
const isFilterOpened = ref(false)
const callsFilter = ref(null)
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
// const setCurrent = (row) => {
//   singleTableRef.value.setCurrentRow(row)
// }

function openFilter() {
  isFilterOpened.value = !isFilterOpened.value
  callsFilter.value.open()
}

function buttonFilterSelect(val) {
  filter.mainFilter = val
  filter.offset = 0
  getData()
  isFilterOpened.value = false
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
    if (!validateVin(filter.search)) ElMessage({message: 'Неверный VIN.', type: 'warning',})
  }

  if (searchFilter.value.registrationMark && searchFilter.value.registrationMark.length < 12) {
    ElMessage({message: 'Неверный ГосНомер.', type: 'warning',})
    return false
  }

  let easy = {}
  Object.keys(searchFilter.value).forEach(el => {
    let val = searchFilter.value[el]
    if (!val) return false
    if (!(val instanceof Array)) easy[el] = searchFilter.value[el]
    else if (val.length > 1) easy[el] = searchFilter.value[el]
  })
  filter.filter = JSON.stringify(easy)

  if (globalRef.tags.length) localStorage.setItem('callsFilters', JSON.stringify(globalRef.tags))
  else localStorage.removeItem('callsFilters')

  return true
}

function getData() {
  if (!validateFilter()) return false;
  globalStore.isWaiting = true
  callsStore.getCalls(filter).then((res) => {
    globalStore.isWaiting = false
    if (!res) return console.warn('НЕТ ДАННЫХ')
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.allCount
  })
}

onMounted(() => {
  globalStore.setTitle('Оценки')
  let callsFilters = localStorage.getItem('callsFilters') || ''
  if (callsFilters) {
    callsFilters = JSON.parse(callsFilters)
    globalRef.tags = callsFilters
    callsFilters.forEach(el => searchFilter.value[el.param] = el.code)
  }

  getData()
})

</script>