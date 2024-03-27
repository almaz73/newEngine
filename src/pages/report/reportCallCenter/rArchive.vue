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
      <!--      <el-table-column width="220">-->
      <!--        <template #default="scope">-->
      <!--          <span style="float: left; max-width: 142px; margin-left: 4px"-->
      <!--                :class="{cityName:scope.row.level===1}">-->
      <!--            {{ scope.row.title }}-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
          v-for="(column, index) in tableColumns"
          :key="index"
          :label="column.headerTitle"
      >
        <template #default="scope">
          {{ index === 0 ? scope.row.title : '' }}
          {{ index === 1 ? scope.row.totalAppealCount : '' }}
          {{ index === 2 ? scope.row.statusNewCount : '' }}
          {{ index === 3 ? scope.row.statusInWorkCount : '' }}
          {{ index === 4 ? scope.row.statusRequestArchiveCount : '' }}
          {{ index === 5 ? scope.row.statusArchiveCount : '' }}

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
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";

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
  {title: 'Текущий месяй', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]


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
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.communicationType = 10
  searchFilter.value.variant = 10
}

init()

function toSearch() {
  let S = searchFilter.value
  let params = {
    lowCreateDatePeriod: S.lowCreateDatePeriod,
    highCreateDatePeriod: S.highCreateDatePeriod,
    variant: S.variant,
    communicationType: S.communicationType
  }

  reportStore.getArchiveClients(params).then(res => {
    console.log(' res.items', res.items)
    tableData.value = res.items.row
    tableColumns.value = res.items.headersList
    if (!tableData.value.length) ElMessage.warning('Нет данных')
  })
}


</script>
