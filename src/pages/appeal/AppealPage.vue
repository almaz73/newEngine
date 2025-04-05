<template>
  <main>
    <FilterButtonsCtrl
        :buttons="filterButtons"
        :isOpen="isFilterOpened"
        :placeholder="''"
        :isShowAdd="true"
        @add="addAppeal"
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

    <div style="position: relative">
      <FilterTagsCtrl @getData="getData" />
      <el-button v-if="timeAgo" size="small" class="timer-list-upd" @click="getData()"
                 title="Обновить таблицу">{{timeAgo}}</el-button>
    </div>

    <!-- для компа таблица -->
    <el-table
        class="big-table"
        v-if="!globalStore.isMobileView"
        :data="tableData"
        ref="singleTableRef"
        @row-dblclick="openPage"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Обращение">
        <template #default="scope">
          <ColorButtons @click="openModal(row)" :statusTitle="scope.row.statusTitle"/>
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
          <div v-if="![110, 111, 112, 113].includes(scope.row.responsibleRole)">
            <b>{{scope.row.managerName}}</b>
          </div>
          <div
            v-if="[110, 111, 112, 113].includes(scope.row.responsibleRole)"
            style="background-color: #df8680; color: #faf6f6; width: 73%; text-align: center"
          >
            <b>{{scope.row.managerName}}</b>
          </div>

          <div class="nowrap"> {{ scope.row.locationName }}</div>
          <div class="red-text">{{ scope.row.city }}</div>
        </template>
      </el-table-column>

      <el-table-column label="Автомобиль">
        <template #default="scope">
          <div class="nowrap"><b> {{ getButType(scope.row.buyWorkflowDealType) }}</b></div>
          <div class="nowrap"> {{ scope.row.vin ? '🚗' : '' }} {{ scope.row.carBrandModel }}</div>
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
          <div v-if="scope.row.workflowLeadType===1" style="display: block">
            <div style="padding-top: 4px; padding-left: 6px; display: flex">
              <el-button
                style="width: 38px;height: 22px"
                :style="(scope.row.selectedCar)?{'background-color':'#BEF781'}:{'background-color':'#E6E6E6'}"
              >
                <img src="@/assets/icons/q_car.png" alt=""/>
              </el-button>
              <el-button
                class="uk-button"
                style="width: 38px;height: 22px"
                :style="(scope.row.tradeInAppealId)?{'background-color':'#BEF781'}:{'background-color':'#E6E6E6'}"
              >
                <img src="@/assets/icons/q_back.png" alt=""/>
              </el-button>
            </div>
            <div style="padding: 3px 6px; display: flex">
              <el-button
                class="uk-button"
                style="width: 38px;height: 22px; background: #E6E6E6"
              >
                <img src="@/assets/icons/q_cub.png" alt=""/>
              </el-button>
              <el-button
                class="uk-button"
                style="width: 38px;height: 22px"
                :style="(scope.row.credit)?{'background-color':'#BEF781'}:{'background-color':'#E6E6E6'}"
              >
                <img src="@/assets/icons/q_rub.png" alt=""/>

              </el-button>
            </div>
          </div>

          <img :src="scope.row.smallPhoto[0]" alt=""
               v-if="(scope.row.workflowLeadType === 2 || scope.row.workflowLeadType === 11) &&
               scope.row.smallPhoto && scope.row.smallPhoto[0]"
               class="img-in-table" />
        </template>
      </el-table-column>

      <el-table-column label="Событие">
        <template #default="scope">
          <div :style="highlightCell(scope.row)" style="padding: 4px">
            <div
                :title="scope.row.lastTaskTitle"> {{ EventType[scope.row.workflowLeadType] }}
            </div>
            <br/>
            {{ formatDMY_hm(scope.row.lastTaskDate) }}<br/>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="30">
        <template #default="scope">
          <span class="edit-table-row" @click="openModal(scope.row)"/>
          <span class="edit-table-page" @click="openPage(scope.row)">⏏</span>
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
          <EditPensilCtrl/>
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
    <AddAppealModal ref="addAppealModal"/>
  </main>
</template>
<script setup>
import {formatDate, formatDMY_hm, gotoTop, timeAgoF, colorBox, formatDateDDMMYYYY} from "@/utils/globalFunctions";
import FilterButtonsCtrl from "@/components/filterCtrl/FilterButtonsCtrl.vue";
import FilterTagsCtrl from "@/components/filterCtrl/FilterTagsCtrl.vue";
import AppealFilter from "@/pages/appeal/AppealFilter.vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {useAppealStore} from "@/stores/appealStore";
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import {globalRef} from '@/components/filterCtrl/FilterGlobalRef.js';
import {buyTypes, EventType} from '@/utils/globalConstants';
import AppealPageModal from "@/pages/appeal/AppealPageModal.vue";
import router from "@/router";
import AddAppealModal from "@/pages/appeal/AddAppealModal.vue";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import ColorButtons from "@/controls/ColorButtons.vue";


const tableData = ref([])
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const total = ref(0)
const searchText = ref('')
const rowsPerPage = ref(20)
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
const addAppealModal = ref(null)
const timeAgo = ref('')
let timeAgoTimer = null

function addAppeal() {
  addAppealModal.value.open(getData)
}

function highlightCell(deal) {
  var statusClass = {};

  if (deal.appealStatusId === 17) {
    statusClass['background-color'] = '#DCDCDC';
  } else {
    var lastTaskDate = new Date(deal.lastTaskDate);
    var currentDate = new Date();
    if (lastTaskDate > currentDate) statusClass['background-color'] = '#E6E6E6';
    if (lastTaskDate < currentDate) {
      statusClass['background-color'] = '#df8680';
      statusClass['color'] = '#FAFAFA';
    }
  }
  return statusClass;
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
    console.log('отловить и команду выпольнить el = ',el)

    let val = searchFilter.value[el]
    if (!val) return true
    if (!(val instanceof Array)) easy[el] = searchFilter.value[el]
    else if (val.length > 1) easy[el] = searchFilter.value[el]
  })
  filterOld = Object.assign({}, filter, easy)

  // почему-то понадобилась подкорректироать дату
  filterOld.lowCreateDatePeriod = formatDateDDMMYYYY(filterOld.lowCreateDatePeriod)
  filterOld.highCreateDatePeriod = formatDateDDMMYYYY(filterOld.highCreateDatePeriod)

  if (globalRef.tags.length) localStorage.setItem('appealFilters', JSON.stringify(globalRef.tags))
  else localStorage.removeItem('appealFilters')
  return false
}

function getData(noUpd) {
  if (validateFilter()) return false;
  globalStore.isWaiting = true
  appealStore.getAppeals(filterOld, !noUpd).then((res) => {
    globalStore.isWaiting = false
    filterButtons.map(el => el.count = res[el.type] | 0)
    total.value = res.totalCount
    tableData.value = res.appeals
  })

  globalStore.setTitle('Обращения')
  globalStore.steps = []
  getTimeList()
}

function openModal(row) {
  appealStore.currentRow = row
  appealModal.value.open(row, getData)
}

function openPage(row) {
  appealStore.currentRow = row
  router.push({name: 'appealEdit', params: {id: row.id}})
}

function getTimeList() {
  let listTime =  localStorage.getItem('appealListTime')
  timeAgo.value = listTime? timeAgoF(new Date(+listTime)):''
  timeAgoTimer = setTimeout(getTimeList, 60000)
}

onUnmounted(()=>{
  clearTimeout(timeAgoTimer)
})

onMounted(() => {
  let appealFilters = localStorage.getItem('appealFilters') || ''
  if (appealFilters) {
    appealFilters = JSON.parse(appealFilters)
    globalRef.tags = appealFilters
    appealFilters.forEach(el => searchFilter.value[el.param] = el.code)
  } else globalRef.tags = []

  getData('noUpd')
})


</script>