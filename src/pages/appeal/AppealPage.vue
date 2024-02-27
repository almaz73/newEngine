<template>
  <main>
    <ul>
      <li><router-link to="/appeal/1123121">Product 1</router-link></li>
      <li><router-link to="/appeal/2">Product 2 dsd</router-link></li>
    </ul>

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
      <AppealFilter
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
        :data="tableData"
        ref="singleTableRef"
        @row-dblclick="openModal"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Обращение" width="150">
        <template #default="scope">
          <div :style="colorBox(scope.row.statusTitle)"
               style="display: inline-block; padding: 0 12px; border-radius: 3px"
          > {{ scope.row.statusTitle }}
          </div>
          <div class="red-text">{{ scope.row.id }}</div>
          <div>{{ formatDate(scope.row.lastTaskDate) }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Клиент" width="150">
        <template #default="scope">
          <div><b> {{ scope.row.leadName }}</b></div>
          <div> {{ scope.row.leadPhone }}</div>
          <div class="red-text">{{ scope.row.clientStatusTitle }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Менеджер">
        <template #default="scope">
          <div class="nowrap"><i> {{ scope.row.createUserName }}</i></div>
          <div class="nowrap"> {{ scope.row.locationName }}</div>
          <div class="red-text">{{ scope.row.city }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Автомобиль">
        <template #default="scope">
          <div class="nowrap"><b> {{ getButType(scope.row.buyWorkflowDealType) }}</b></div>
          <div class="nowrap"> 🚗 {{ scope.row.carBrandModel }}</div>
          <div class="red-text nowrap">{{ scope.row.vin }}</div>
        </template>
      </el-table-column>

      <el-table-column>
        <template #default="scope">
          <div>{{ scope.row.treatmentSourceTitle }}</div>
          <span class="red-text" :title="scope.row.lastTaskTitle "> {{ scope.row.appealTitle }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120">
        <template #default="scope">
          <img :src="scope.row.smallPhoto[0]" alt=""
               v-if="scope.row.smallPhoto && scope.row.smallPhoto[0]"
               style="height:60px; border-radius: 4px"/>
        </template>
      </el-table-column>

      <el-table-column label="Событие">
        <template #default="scope">
          <span class="edit-table-row" @click="openModal(scope.row)"/>
          <span class="red-text"
                :title="scope.row.lastTaskTitle">  {{ EventType[scope.row.workflowLeadType] }} </span><br/>
          {{ formatDMY_hm(scope.row.lastTaskDate) }}<br/>
        </template>
      </el-table-column>

    </el-table>

    <!-- для мобилки таблица -->
    <div class="vertical-table" v-if="globalStore.isMobileView" style="width: 100vw">
      <div v-for="(row, ind) in tableData" :key="ind">
        <div class="head mobile-row-head"
             @click="openModal(row)"
             :style="colorBox(row.statusTitle)">
          <span> {{ row.statusTitle }}. &nbsp; &nbsp; {{ formatDate(row.lastTaskDate) }}</span>
          <img src="@/assets/icons/icon-pencil-gray.png" alt=""/>

        </div>
        <div><small>Авто:</small> {{ row.carBrandModel }} {{ row.yearReleased }}</div>
        <div><small>Клиент:</small> {{ row.leadName }}</div>
        <div><small>Телефон клиента:</small> {{ row.leadPhone }}</div>

        <div><small>Менеджер:</small> {{ row.createUserName }}</div>
        <div><small>Место: </small> {{ row.locationName }}</div>
        <div><small>Событие: </small> {{ EventType[row.workflowLeadType] }} {{ formatDMY_hm(row.lastTaskDate) }}</div>
        <div style="text-align: center">
          <img :src="row.smallPhoto[0]" v-if="row.smallPhoto && row.smallPhoto[0]" alt=""/>
        </div>
      </div>
      <div v-if="!tableData.length" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="tableData.length>2">
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
    <AppealPageModal ref="appealModal"/>
  </main>
</template>
<script setup>
import {formatDate, formatDMY_hm, gotoTop} from "@/utils/globalFunctions";
import FilterButtonsCtrl from "@/components/filterCtrl/FilterButtonsCtrl.vue";
import FilterTagsCtrl from "@/components/filterCtrl/FilterTagsCtrl.vue";
import AppealFilter from "@/pages/appeal/AppealFilter.vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {useAppealStore} from "@/stores/appealStore";
import {reactive, ref, computed, onMounted} from 'vue'
import {globalRef} from '@/components/filterCtrl/FilterGlobalRef.js';
import {buyTypes, EventType} from '@/utils/globalConstants';
import AppealPageModal from "@/pages/appeal/AppealPageModal.vue";


const tableData = ref([])
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const total = ref(0)
const searchText = ref('')
const rowsPerPage = ref(10)
const currentPage = ref(1)
const filterButtons = reactive([
  {type: 'appealsCount', count: 0, name: 'Обращения:', code: 10, active: true},
  {type: 'eventsToday', count: 0, name: 'События на сегодня:', code: 20},
  {type: 'eventsExpired', count: 0, name: 'Просроченные события:', code: 30},
  {type: 'archiveRequest', count: 0, name: 'Запрос в архив:', code: 50},
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
let filterOld; // кучковый способ запросов
const appealModal = ref(null)

function colorBox(txt) {
  if (txt === 'Новый') return {background: '#01a9db', color: 'white'}
  if (txt === 'В работе') return {background: '#3cac71', color: 'white'}
}

function getButType(buyWorkflowDealType) {
  let bt = buyTypes.find(el => el.id === buyWorkflowDealType)
  return bt && bt.name
}

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
  filter.quickSearch = searchText.value

  let easy = {}
  Object.keys(searchFilter.value).forEach(el => {
    let val = searchFilter.value[el]
    if (!val) return true
    if (!(val instanceof Array)) easy[el] = searchFilter.value[el]
    else if (val.length > 1) easy[el] = searchFilter.value[el]
  })
  filterOld = Object.assign({}, filter, easy)

  if (globalRef.tags.length) localStorage.setItem('appealFilters', JSON.stringify(globalRef.tags))
  else localStorage.removeItem('appealFilters')
  return false
}

// function tmp() {
//   tableData.value=[{"id":392078,"carBrandModel":"ВАЗ (LADA) 4x4 (Нива)","managerName":"Стажер Менеджер Стажер Менеджер","leadName":" Анатолий","leadPhone":"89061157748","createUserName":"Стажер Менеджер Стажер Менеджер","workflowLeadType":2,"locationName":"Выкуп (Ульяновск)","createDate":"2024-02-09T10:15:32.260322","statusId":10,"statusTitle":"Новый","leadId":252075,"communicationTaskCount":0,"lastTaskType":2,"lastTaskDate":"2024-02-09T10:18:40.526402","lastTaskTitle":"Создано автоматически при добавлении осмотра автомобиля","autoId":124513,"dealId":392079,"dealStatus":0,"smallPhoto":["https://dev.autonet.pro/api/file/3479403"],"vin":"XTA212140F2218002","appealStatusId":10,"responsibleRole":21,"buyWorkflowDealType":40,"clientStatusTitle":"Первичный","city":"Ульяновск","selectedCar":false,"credit":false,"franchiseClientType":null,"franchiseClientTypeTitle":null,"lastComment":null,"communication":null,"bodyColorCode":null,"swapPhone":null,"hiddenVin":null,"yearReleasedAppeal":null,"mileageAppeal":null,"salon":null,"treatmentSourceTitle":"Свободный выкуп","appealTitle":"Выкуп","callCount":0,"tradeInAppealId":null}]
//   appealModal.value.open(tableData.value[0], getData)
// }

function getData() {
   // return tmp()
  //
  if (validateFilter()) return false;
  globalStore.isWaiting = true
  appealStore.getAppeals(filterOld).then((res) => {
    globalStore.isWaiting = false
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.totalCount
    tableData.value = res.appeals
  })
}

function openModal(row) {
  console.log('APPEAL =', row)

  appealModal.value.open(row, getData)
}

onMounted(() => {
  globalStore.setTitle('Обращения')
  globalStore.steps = []
  let appealFilters = localStorage.getItem('appealFilters') || ''
  if (appealFilters) {
    appealFilters = JSON.parse(appealFilters)
    globalRef.tags = appealFilters
    appealFilters.forEach(el => searchFilter.value[el.param] = el.code)
  }

  getData()
})


</script>