<template>
  <main>
    <div class="filter-report">
      <h2>Количество обращений по дням 📞</h2>
      <div>
        <label class="label l_300">Выберите месяц</label>

        <el-date-picker
            type="month"
            v-model="searchFilter.selectedMonth"
            format="YYYY MMM"
            :clearable="false"
        />
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
    </div>


    <el-table
        class="report-days-table title-place"
        :data="tableData"
        size="small"
        v-if="tableData.length"
        border
        empty-text="Нет данных"
        :row-class-name="tableRowClassName"
        @row-click="rowClick"
        highlight-current-row
    >
      <el-table-column width="180" label="ФИО">
        <template #default="scope">
         <span :class="{parentPartName:scope.row.level===1, partName:scope.row.level===2}">
            {{ scope.row.userFirstName }}
            {{ scope.row.userLastName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
          v-for="(column, index) in tableData[0].phoneAll.eventsAll"
          :key="index"
          :label="''+(index)"
          min-width="32"
      >
        <template #default="scope">
          {{ scope.row.phoneAll.eventsAll[index] ? scope.row.phoneAll.eventsAll[index] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="ВСЕГО" width="60">
        <template #default="scope">
          {{ scope.row.phoneAll.countAll ? scope.row.phoneAll.countAll : '' }}
        </template>
      </el-table-column>

    </el-table>
  </main>
</template>
<style>
.title-place {
  width: 100%;
}

.title-place .partName {
  float: right;
  color: #4682b4;

}

.title-place .parentPartName {
  float: left;
  font-weight: bold;
}


</style>
<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useReportStore} from "@/stores/reportStore";
import {ElMessage} from "element-plus";

const searchFilter = ref({selectedMonth: new Date()})

const globalStore = useGlobalStore()
const reportStore = useReportStore()
const tableData = ref([])
const myEmployees = ref([])
const tableRowClassName = ({row}) => {
  let styles = ''
  if (!row.isShow) styles += 'hide-row '
  if (row.level === 2) styles += 'gray-fon '
  if (row.summ) styles += 'blue-text '
  return styles
}

globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)

function rowClick(row) {
  if (row.level === 1) { // по нажатию родителя скрываем/показываем строку
    tableData.value.map(el => {
      if (el.parentNumber === row.number) {
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
  searchFilter.value.selectedMonth = new Date()
}

init()

function toSearch() {
  let S = searchFilter.value
  let params = {
    year: S.selectedMonth.getFullYear(),
    month: S.selectedMonth.getMonth() + 1
  }
  reportStore.getCalls(params).then(res => {
    if (!res.report.length) ElMessage.warning('Нет данных')
    normalizeTableData(res.report)
  })

}

function normalizeTableData(report) {
  tableData.value = []

  report.forEach((el, ind) => {
    tableData.value.push({
      userLastName: el.userLastName,
      userFirstName: el.userFirstName,
      phoneAll: el.phoneAll,
      isExpanded: false,
      isShow: true,
      level: 1,
      number: ind
    })
    if (el.phoneEvents) {
      el.phoneEvents.forEach(item => {
        tableData.value.push({
          userLastName: item.closeTypeTitle,
          phoneAll: {
            eventsAll: item.eventsInDay,
            countAll: item.closeTypeCount
          },
          isExpanded: false,
          isShow: false,
          level: 2,
          parentNumber: ind
        })
      })


    }
  })

  let sum = getSummCallsByDays(report)

  tableData.value.push(sum)
}

function getSummCallsByDays(report) {
  let daySum = {phoneAll: {countAll: 0, eventsAll: {}}, userLastName: 'Итого', isShow: true, summ: true};
  report.forEach(item => {
    Object.entries(item.phoneAll.eventsAll).forEach(z => {
      if (daySum.phoneAll.eventsAll[z[0]] === undefined) daySum.phoneAll.eventsAll['' + z[0]] = z[1]
      else daySum.phoneAll.eventsAll[z[0]] += z[1]
      daySum.phoneAll.countAll += z[1]
    })
  })

  return daySum
}


</script>
