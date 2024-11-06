<template>
  <main>
    <div class="filter-report">
      <h2>Отчет колл-центра по просроченным событиям</h2>
      <div>
        <label class="label l_300">Период</label>

        <el-date-picker
          v-model="searchFilter.DateStart"
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          :clearable="false"
        />
        &nbsp; &nbsp;
        <el-date-picker
          v-model="searchFilter.DateEnd"
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
        <label class="label l_300">Тип сделки</label>
        <el-select
          style="width: 220px"
          v-model="searchFilter.dealType"
          filterable>
          <el-option v-for="item in dealTypes" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Роли</label>
        <el-select
          style="width: 220px"
          multiple
          @change="changeGroup()"
          v-model="searchFilter.Roles"
          filterable>
          <el-option v-for="item in roles" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Сотрудник</label>
        <el-select
          style="width: 220px"
          multiple
          v-model="searchFilter.Users"
          filterable>
          <el-option v-for="item in myEmployees" :key="item.id" :label="item.title" :value="item.id"/>
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
      <el-table-column label="ФИО ИЕНЕДЖЕРА" prop="responsible"/>
      <el-table-column label="ТИП СДЕЛКИ" prop="appealType"/>
      <el-table-column label="МЕСТО ВЫКУПА" prop="location"/>
      <el-table-column label="НОМЕР ОБРАЩЕНИЯ" prop="loclocationation"/>
    </el-table>
  </main>
</template>
<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {useGlobalStore} from '@/stores/globalStore'

const globalStore = useGlobalStore()
const searchFilter = ref({})
const reportStore = useReportStore()
const tableData = ref([])
const myEmployees = ref([])
const allEmployees = ref([])
const dealTypes = [
  { title: 'Выкуп (трейд-ин)', value: 10 },
  { title: 'Комиссия', value: 20 }
]
const roles = ref([])
const period = ref(30)
const periodItem = [
  {title: 'За все время', value: 40},
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]


globalStore.getRoles([110, 111, 112, 113]).then(res => {
  allEmployees.value = res.items
  myEmployees.value = JSON.parse(JSON.stringify(allEmployees.value))
})

function changeGroup() {
  searchFilter.value.employeeId = null
  myEmployees.value = allEmployees.value.filter(el => {
    if (searchFilter.value.Roles.includes(el.role)) return el
  })
}


reportStore.getRolesForExpiredEventsReport().then(res=>roles.value = res)

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



function monthChanged() {
  let currentMonth = new Date(new Date().setDate(1))
  if (period.value === 20) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
  if (period.value === 30) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 2))

  searchFilter.value.DateStart = formatDateDDMMYYYY(currentMonth)
  searchFilter.value.DateEnd = formatDateDDMMYYYY(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))

  if (period.value === 40) {
    searchFilter.value.DateStart = null
    searchFilter.value.DateEnd = null
  }

}

function toSearch() {
  let S = searchFilter.value

  reportStore.getExpiredEventsReport(S.DateStart, S.DateEnd, S.Roles, S.Users,0, 25).then(res => {
    console.log(':::: res', res);
    tableData.value = res.items
    // tableColumns.value = res.items.headersList
    // if (!tableData.value.length) ElMessage.warning('Нет данных')
  })
}


</script>
