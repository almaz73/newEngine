<template>
  <main>
    <div class="filter-report">
      <h2>Отчет колл-центра по сотрудникам 🦄</h2>

      <div>
        <label class="label l_300">Период</label>

        <el-date-picker
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          :clearable="false"
          v-model="searchFilter.lowCreateDatePeriod"

        />
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <el-date-picker
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          :clearable="false"
          v-model="searchFilter.highCreateDatePeriod"
        />

      </div>

      <div>
        <label class="label l_300">Тип сделки</label>
        <el-select
          style="width: 220px"
          v-model="searchFilter.dealType"
          filterable>
          <el-option v-for="item in dealTypes" :key="item.value" :label="item.title" :value="item.value" />
        </el-select>
      </div>

      <div>
        <label class="label l_300">Cотрудник</label>
        <el-select
          style="width: 220px"
          v-model="searchFilter.employeeId"
          filterable>
          <el-option v-for="item in myEmployees" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </div>
      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>
    <el-tabs v-model="activeName" v-if="tableData.length">
      <el-tab-pane label="Иерархический" name="ierarh">
        <HierarchicalTable :data="JSON.parse(JSON.stringify(tableData))" :needUpdate="needUpdate" />
      </el-tab-pane>
      <el-tab-pane label="Простой" name="standart">
        <SimpleTable :data="JSON.parse(JSON.stringify(tableData))" :needUpdate="needUpdate" />
      </el-tab-pane>
    </el-tabs>


  </main>
</template>

<script setup>
import { Grid } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useReportStore } from '@/stores/reportStore'
import { formatDateDDMMYYYY } from '@/utils/globalFunctions'
import { ElMessage } from 'element-plus'
import SimpleTable from './rEmployees/SimpleTable.vue'
// import {datas} from './rEmployees/data_little'
// import { datas } from './rEmployees/data'
import HierarchicalTable from '@/pages/report/reportCallCenter/rEmployees/HierarchicalTable.vue'


const searchFilter = ref({})
const globalStore = useGlobalStore()
const reportStore = useReportStore()
const star = ref(1)
const tableData = ref([])
const needUpdate = ref(0)
const activeName = ref('ierarh')
let data = []
const dealTypes = [{ title: 'Выкуп (трейд-ин)', value: 10 }, { title: 'Комиссия', value: 20 }]

const tableRowClassName = ({ row }) => {
  if (row.appealId) return 'red-text'
}

const myEmployees = ref([])
globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)

function init() {
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.dealType = 10
  searchFilter.value.employeeId = null
  searchFilter.value.buyTypeView = null
}

init()

function toSearch() {
  let S = searchFilter.value
  let params = {
    lowCreateDatePeriod: S.lowCreateDatePeriod,
    highCreateDatePeriod: S.highCreateDatePeriod
  }
  if (S.dealType) params.dealType = S.dealType
  if (S.employeeId) params.employeeId = S.employeeId
  if (S.buyTypeView) params.buyTypeView = S.buyTypeView
  globalStore.isWaiting = true
  reportStore.getEmployee(params).then(res => {
    tableData.value = res.employees
    needUpdate.value++
    globalStore.isWaiting = false
    if (!tableData.value.length) ElMessage.warning('Нет данных')
  })
}


</script>
