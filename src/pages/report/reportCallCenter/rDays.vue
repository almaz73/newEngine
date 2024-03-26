<template>
  <main>
    <div class="filter-report">
      <h2>Количество обращений по дням 🐋</h2>
      <div>
        <label class="label l_300">Выберите год и месяц</label>

        <el-date-picker
            type="month"
            v-model="searchFilter.selectedMonth"
            format="YYYY MMM"
            :clearable="false"
        />
      </div>

      <div>
        <label class="label l_300">Вариант отчета</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.chosenReportType"
            filterable>
          <el-option v-for="item in reportTypes" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Тип сделки</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.chosenDealType"
            filterable>
          <el-option v-for="item in dealTypes" :key="item.value" :label="item.title" :value="item.value"/>
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
      <el-table-column width="220">
        <template #default="scope">
          <span style="float: left; max-width: 142px; margin-left: 4px"
                :class="{cityName:scope.row.level===1}">
            {{ scope.row.title }}
          </span>
          <span style="float: right; padding-right: 4px; text-align: right">
            <small>Обращений</small><br>
            <small class="red-text">Осмотров</small>
          </span>
        </template>
      </el-table-column>
      <el-table-column
          v-for="(column, index) in tableData[0].days"
          :key="index"
          :label="''+(index+1)"
          min-width="22"
      >
        <template #default="scope">
          <!--                          <span>{{ scope.row.days[index].appealsCount }}</span>-->
          <div>{{ scope.row.days[index].appealsCount ? scope.row.days[index].appealsCount : '&nbsp;' }}</div>
          <div class="red-text">{{ scope.row.days[index].buysCount ? scope.row.days[index].buysCount : '&nbsp;' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="ВСЕГО" width="60">
        <template #default="scope">
          <span>{{ scope.row.appealTotalCount }}</span><br>
          <span class="red-text"> {{ scope.row.buyTotalCount }}</span>
        </template>
      </el-table-column>

    </el-table>
  </main>
</template>
<style>
.report-days-table {
  margin-top: 24px;
  width: calc(100vw - 130px);
  cursor: pointer;
}

.report-days-table .cityName {
  font-weight: bold;
  text-transform: uppercase;
  text-align: left;
  width: 100%;
}

.report-days-table.el-table .gray-fon {
  --el-table-tr-bg-color: #f1eeee;
  cursor: initial;
}

.report-days-table.el-table .hide-row {
  display: none;
}

.report-days-table .cell {
  line-height: initial;
  text-align: center;
  padding: 0;
}

@media (width < 500px) {
  .report-days-table {
    width: 100vw
  }
}
</style>
<script setup>
import {Grid} from "@element-plus/icons-vue";
import {computed, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useReportStore} from "@/stores/reportStore";

const searchFilter = ref({selectedMonth: new Date()})

const globalStore = useGlobalStore()
const reportStore = useReportStore()
const tableData = ref([])
const dealTypes = [{title: 'Выкуп (трейд-ин)', value: 10}, {title: 'Комиссия', value: 20}]
const reportTypes = [{title: 'По городам', value: 10}, {title: 'По местам хранения', value: 20}];
const myEmployees = ref([])
const tableRowClassName = ({row}) => {
  let styles = ''
  if (!row.isShow) styles += 'hide-row '
  if (row.level === 2) styles += 'gray-fon '
  return styles
}
const columns = computed(() => { // получить массив дней в месяце
  let days = new Date(searchFilter.value.selectedMonth.getFullYear(),
      searchFilter.value.selectedMonth.getMonth() + 1, 0).getDate()
  return Array.from({length: days}, (_, i) => i + 1)
})

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
  searchFilter.value.chosenReportType = 10
  searchFilter.value.chosenDealType = 10
}

init()

function toSearch() {
  let S = searchFilter.value
  let params = {
    year: S.selectedMonth.getFullYear(),
    month: S.selectedMonth.getMonth() + 1,
    dealType: S.chosenDealType,
    type: S.chosenReportType
  }
  reportStore.getMonthly(params).then(res => {
    tableData.value = res.items
    if (!tableData.value.length) ElMessage.warning('Нет данных')
  })
}


</script>
