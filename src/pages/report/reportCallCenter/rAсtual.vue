<template>
  <main>
    <div class="filter-report">
      <h2>Актуальность обращений 🐸</h2>
      <div>
        <label class="label l_300">Дата</label>

        <el-date-picker
            v-model="searchFilter.date"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
      </div>

      <div>
        <label class="label l_300">Сотрудник</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.employeeId"
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
import {useGlobalStore} from "@/stores/globalStore";
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";

const globalStore = useGlobalStore()
const myEmployees = ref([])
const searchFilter = ref({})
const reportStore = useReportStore()
const tableData = ref([])
const tableColumns = ref([])


globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)



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
  searchFilter.value.date = formatDateDDMMYYYY(new Date())
  searchFilter.value.employeeId = null
}

init()




function toSearch() {

  console.log('searchFilter.value', searchFilter.value)
  let params = {date:searchFilter.value.date}
  if (searchFilter.value.employeeId) params.employeeId = searchFilter.value.employeeId

  reportStore.getActual(params).then(res => {
    tableData.value = res.items
    if (!tableData.value || !tableData.value.length) ElMessage.warning('Нет данных')
  })
}


</script>
