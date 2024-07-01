<template>
  <main>
    <div class="filter-report">
      <h2> todo... страница пример, нужно менять данные  Количество обращений в организациях 🦝</h2>

      <div>
        <label class="label l_100">Период</label>

        <el-date-picker
            v-model="searchFilter.startDate"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
        &nbsp; &nbsp;
        <el-date-picker
            v-model="searchFilter.endDate"
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

      <br>
      <el-button :icon="Grid" type="danger" @click="getData()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>

    <el-table
        class="tableStyle_auto"
        size="small"
        show-summary
        v-if="tableData[0]"
        :data="tableData">
      <el-table-column label="Организация" prop="organization"/>
      <el-table-column label="Обращений в работе, шт" prop="inWorkCount"/>
      <el-table-column label="Выкуп+трейдин в работе, шт" prop="buyInWorkCount"/>
      <el-table-column label="Обращений в архиве, шт" prop="inArchiveCount"/>
      <el-table-column label="Обращений выкуп+трейдин в архиве, шт" prop="buyArchiveCount"/>
      <el-table-column label="Оценок, шт" prop="buysCount"/>
    </el-table>


  </main>
</template>

<style>
.tableStyle_auto .el-table_1_column_2,
.tableStyle_auto .el-table_1_column_3 {
  background: #c3e6d6;
}
.tableStyle_auto .el-table_1_column_4,
.tableStyle_auto .el-table_1_column_5 {
  background: #e4e6e6;
}
</style>


<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {ElMessage} from "element-plus";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const searchFilter = ref({startDate: new Date()})
const reportStore = useReportStore()
const tableData = ref([])
const period = ref(10)
const periodItem = [
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]

function init() {
  searchFilter.value.startDate = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.endDate = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
}

init()

function monthChanged() {
  let currentMonth = new Date(new Date().setDate(1))
  if (period.value === 20) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
  if (period.value === 30) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 2))

  searchFilter.value.startDate = formatDateDDMMYYYY(currentMonth)
  searchFilter.value.endDate = formatDateDDMMYYYY(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))
}

function getData() {
  tableData.value = []

  reportStore.getAppealsinorganizations(searchFilter.value).then(res => {
    if (!res.items.length) return ElMessage.warning('Нет данных')
    tableData.value = res.items
  })
}

</script>
