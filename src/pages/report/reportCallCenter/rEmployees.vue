<template>
  <main>
    <div class="filter-report">
      <h2>Отчет колл-центра по сотрудникам  🦄</h2>

      <div>
        <label class="label l_300">Период</label>

        <el-date-picker
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          :clearable="false"
          v-model="searchFilter.lowCreateDatePeriod"

        />
        &nbsp; &nbsp;
        <el-date-picker
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          :clearable="false"
          v-model="searchFilter.highCreateDatePeriod"
        />
        &nbsp; &nbsp;
        <el-select
          style="width: 220px"
          @change="monthChanged()"
          v-model="period"
          filterable>
          <el-option v-for="item in periodItem" :key="item.value" :label="item.title" :value="item.value" />
        </el-select>

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
        <label class="label l_300">Категория</label>
        <el-select
          style="width: 220px"
          v-model="searchFilter.roleGroup"
          filterable>
          <el-option v-for="item in roles" :key="item.group.title" :label="item.group.title" :value="item.group" />
        </el-select>
      </div>
      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <el-button @click="reportPrint()">Печать</el-button>
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
import HierarchicalTable from '@/pages/report/reportCallCenter/rEmployees/HierarchicalTable.vue'
import { useAdminStore } from '@/stores/adminStore'


const searchFilter = ref({})
const globalStore = useGlobalStore()
const reportStore = useReportStore()
const star = ref(1)
const tableData = ref([])
const needUpdate = ref(0)
const activeName = ref('ierarh')
const roles = ref([])
let data = []
const dealTypes = [{ title: 'Выкуп (трейд-ин)', value: 10 }, { title: 'Комиссия', value: 20 }]
const adminStore = useAdminStore()
const period = ref(10)
const periodItem = [
  { title: 'Текущий месяц', value: 10 },
  { title: 'Прошлый месяц', value: 20 },
  { title: '2 месяца назад', value: 30 }
]
const tableRowClassName = ({ row }) => {
  if (row.appealId) return 'red-text'
}

function monthChanged() {
  let currentMonth = new Date(new Date().setDate(1))
  if (period.value === 20) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
  if (period.value === 30) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 2))
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(currentMonth)
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))
}


adminStore.getUserRoles().then(res => {
  roles.value = res.items && res.items.filter(it => [60, 61].includes(it.group.value))
})


function init() {
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.dealType = 10
  searchFilter.value.employeeId = null
  searchFilter.value.buyTypeView = 0
}

init()



function reportPrint() {
  ElMessage.info('Готово! Файл можно забрать из загрузок браузера.');


  let link =  '/api/report/CallCenterEmployeePrint/' +
      '?highCreateDatePeriod=' + searchFilter.value.highCreateDatePeriod +
      '&lowCreateDatePeriod=' + searchFilter.value.lowCreateDatePeriod +
      '&ReportType=' + searchFilter.value.buyTypeView
  if (searchFilter.value.dealType) link += '&dealType=' + searchFilter.value.dealType
  if (searchFilter.value.employeeId) link += '&employeeId=' + searchFilter.value.employeeId
  location.href = link
}

function toSearch() {
  let S = searchFilter.value
  let params = {
    lowCreateDatePeriod: S.lowCreateDatePeriod,
    highCreateDatePeriod: S.highCreateDatePeriod
  }
  if (S.roleGroup) params.CategoryId = S.roleGroup.value
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
