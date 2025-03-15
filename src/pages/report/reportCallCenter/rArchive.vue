<template>
  <main>
    <div class="filter-report">
      <h2>Причины архивирования обращений клиентов 🐀</h2>
      <div>
        <label class="label l_300">Период</label>

        <el-date-picker
            v-model="searchFilter.lowCreateDatePeriod"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
        &nbsp; &nbsp;
        <el-date-picker
            v-model="searchFilter.highCreateDatePeriod"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
        &nbsp; &nbsp;
        <el-select
            style="width: 220px"
            @change="monthChanged()"
            v-model="period"
            filterable>
          <el-option v-for="item in periodItem" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Вариант отчета</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.variant"
            filterable>
          <el-option v-for="item in variants" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Тип коммуникации</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.communicationType"
            filterable>
          <el-option v-for="item in communicationTypes" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>


      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
    </div>
    <el-table
        class="report-days-table"
        :data="tableData"
        size="small"
        v-if="tableData.length"
        border
        empty-text="Нет данных"
        :row-class-name="tableRowClassName"
        @row-click="rowClick"
        highlight-current-row
    >
      <el-table-column width="180" label="Организация">
        <template #default="scope">
          <span style="float: left;" :class="{cityName:scope.row.level===1}">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
          v-for="(column, index) in tableColumns.slice(1)"
          :key="index"
          :label="column.headerTitle">
        <template #default="scope">
          {{ index === 0 ? scope.row.totalAppealCount : '' }}
          {{ index === 1 ? scope.row.statusNewCount : '' }}
          {{ index === 2 ? scope.row.statusInWorkCount : '' }}
          {{ index === 3 ? scope.row.statusRequestArchiveCount : '' }}
          {{ index === 4 ? scope.row.statusArchiveCount : '' }}
          {{ index === 5 ? columnValue(scope.row, index) : '' }}
          {{ index === 6 ? columnValue(scope.row, index) : '' }}
          {{ index === 7 ? columnValue(scope.row, index) : '' }}
          {{ index === 8 ? columnValue(scope.row, index) : '' }}
          {{ index === 9 ? columnValue(scope.row, index) : '' }}
        </template>
      </el-table-column>
    </el-table>
  </main>
</template>
<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
const searchFilter = ref({lowCreateDatePeriod: new Date()})
const reportStore = useReportStore()
const tableData = ref([])
const tableColumns = ref([])
const variants = [
  {title: 'Выкуп. По организациям', value: 10},
  {title: 'Выкуп. По сотрудникам', value: 20},
]
const communicationTypes = [
  {title: 'Все коммуникации', value: 10},
  {title: 'Исходящий звонок', value: 20},
  {title: 'Входящий звонок', value: 30},
]
const period = ref(10)
const periodItem = [
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]

function columnValue(row, ind) {
  return row.reasons[ind - 5].count + ' (' + (row.reasons[ind - 5].count * 100 / row.totalAppealCount).toFixed(1) + '%)'
}

const tableRowClassName = ({row}) => {
  let styles = ''
  if (!row.isShow) styles += 'hide-row '
  if (row.level === 2) styles += 'gray-fon '
  return styles
}


function rowClick(row) {
  if (row.level === 1) { // по нажатию родителя скрываем/показываем строку
    tableData.value.map(el => {
      if (el.number === row.number) {
        if (el.isExpanded) {
          el.isExpanded = false
          if (el.level === 2) el.isShow = false
        } else {
          el.isExpanded = true
          if (el.level === 2) el.isShow = true
        }
      }
      return el
    })
  }
}

function init() {
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.communicationType = 10
  searchFilter.value.variant = 10
}

init()


function monthChanged() {
  let currentMonth = new Date(new Date().setDate(1))
  if (period.value === 20) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
  if (period.value === 30) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 2))

  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(currentMonth)
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))
}

function toSearch() {
  let S = searchFilter.value
  let params = {
    lowCreateDatePeriod: S.lowCreateDatePeriod,
    highCreateDatePeriod: S.highCreateDatePeriod,
    variant: S.variant,
    communicationType: S.communicationType
  }
  globalStore.isWaiting = true
  reportStore.getArchiveClients(params).then(res => {
    tableData.value = res.items.row
    tableColumns.value = res.items.headersList
    if (!tableData.value.length) ElMessage.warning('Нет данных')
    globalStore.isWaiting = false
  })
}


</script>
