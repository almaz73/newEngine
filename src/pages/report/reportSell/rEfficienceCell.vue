<template>
  <main>
    <div class="filter-report">
      <h2>Эффективность 🦉</h2>

      <div>
        <label class="label l_300">Период</label>

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


      <div>
        <label class="label l_300">Организация</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.organization"
            filterable>
          <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="getData()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>

    <el-table
        size="small"
        v-if="tableData.length"
        :row-class-name="tableRowClassName"
        class="tableStyle"
        selectable="false"
        :data="tableData">
      <el-table-column label="ФИО" prop="seller.fullName" min-width="150"/>
      <el-table-column label="Обращения" prop="appealCount"/>
      <el-table-column label="Телефонные номера" prop="phoneCount"/>
      <el-table-column label="Конверсия,%" prop="conversionPhone"/>
      <el-table-column label="Тест-драйвы" prop="testDriveCount"/>
      <el-table-column label="Конверсия, %" prop="conversionTestDrive"/>
      <el-table-column label="Контракты" prop="contractCount"/>
      <el-table-column label="Конверсия, %" prop="conversionContract"/>
      <el-table-column label="Продано" prop="soldCount"/>
      <el-table-column label="Конверсия, %" prop="conversionSold"/>
      <el-table-column label="GM1, шт" prop="grossMargin1"/>
      <el-table-column label="GM1, %" prop="grossMargin1Percentage"/>
    </el-table>


  </main>
</template>

<style>
.tableStyle {
  pointer-events: none;
}

.tableStyle .el-table_1_column_4,
.tableStyle .el-table_1_column_6,
.tableStyle .el-table_1_column_8,
.tableStyle .el-table_1_column_10,
.tableStyle .el-table_1_column_12 {
  background: pink;
}

.tableStyle .gray-fon {
  background: #ddd;
}
</style>


<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const searchFilter = ref({startDate: new Date()})
const reportStore = useReportStore()
const tableData = ref([])
const period = ref(10)
const organizations = ref([])
const periodItem = [
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]

let counColor = 0
const tableRowClassName = () => {
  if (counColor++ % 2) return 'gray-fon '
}

globalStore.getOrganizations().then(res => organizations.value = res.items)

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

  reportStore.getEfficiencySell(searchFilter.value).then(res => {
    if (!res.items.length) return ElMessage.warning('Нет данных')
    tableData.value = res.items
  })
}

</script>
