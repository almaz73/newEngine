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
      <el-table-column width="300" label="СОТРУДНИК">
        <template #default="scope">
          <span style="float: left;">
            {{ scope.row.employeeTitle }}
          </span>
          <small class="red-text" style="float: right">
            {{ scope.row.employeeTitle ? 'итого среднее дней' : '' }}
          </small>
        </template>
      </el-table-column>
      <el-table-column label="ОБРАЩЕНИЕ">
        <template #default="scope">
          <span class="red-text" v-if="scope.row.employeeTitle">{{ scope.row.appealsCount }}</span>
          <span class="green-text" v-else>{{ scope.row.appealsCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ТИП" prop="appealTypeTitle"/>
      <el-table-column label="САЛОН" prop="appealLocationTitle"/>
      <el-table-column label="КЛИЕНТ" prop="clientTitle"/>
      <el-table-column label="АВТО" prop="auto"/>
      <el-table-column label="ДАТА ОБРАЩЕНИЯ" prop="appealCreateDate"/>
      <el-table-column label="ДАТА ОСМОТРА" prop="buyCreateDate"/>
      <el-table-column label="КОЛ_ВО ДНЕЙ" prop="appealDaysInWork"/>
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
let oldData = []


globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)


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
  } else openAppeal(row)

}

function openAppeal(row) {
  row.appealsCount && window.open('/v2/appeal/' + row.appealsCount, '_blank');
}

function init() {
  searchFilter.value.date = formatDateDDMMYYYY(new Date())
  searchFilter.value.employeeId = null
}

init()

function toSearch() {
  let params = {date: searchFilter.value.date}
  if (searchFilter.value.employeeId) params.employeeId = searchFilter.value.employeeId
  globalStore.isWaiting = true
  reportStore.getActual(params).then(res => {
    if (res) {
      oldData = res.report
      normalizeTableData()
    }

    if (!tableData.value || !tableData.value.length) ElMessage.warning('Нет данных')
    globalStore.isWaiting = false
  })
}

function normalizeTableData() {
  tableData.value = []
  let report = oldData && JSON.parse(JSON.stringify(oldData))

  report && report.forEach((el, ind) => {
    tableData.value.push({
      employeeTitle: el.employeeTitle,
      appealsCount: el.appealsCount,
      phoneAll: el.phoneAll,
      isExpanded: false,
      isShow: true,
      level: 1,
      number: ind
    })
    if (el.items) {
      el.items.forEach(item => {
        tableData.value.push({
          appealsCount: item.appealId,
          appealTypeTitle: item.appealTypeTitle,
          appealLocationTitle: item.appealLocationTitle,
          clientTitle: item.clientTitle + ' ☏ ' + item.clientPhone,
          auto: item.auto,
          appealCreateDate: item.appealCreateDate,
          buyCreateDate: item.buyCreateDate,
          appealDaysInWork: item.appealDaysInWork,
          isShow: false,
          level: 2,
          number: ind
        })
      })

      tableData.value.push(el)
    }
  })
}


</script>
