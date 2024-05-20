<template>
  <main>
    <div class="filter-report">
      <h2>Отчет эффективности отдела аналитики 🐰</h2>

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
        v-if="tableData[0]"
        :data="tableData"
        :row-class-name="tableRowClassName"
        row-key="userId"
        :tree-props="{ children: 'children'}">
      <el-table-column label="ФИО">
        <template #default="scope">
          {{ scope.row.userFirstName + ' ' + scope.row.userLastName }}
        </template>
      </el-table-column>
      <el-table-column label="Кол-во оценок" prop="dealsCountTotal"/>
      <el-table-column label="Среднее время" prop="averageTimeTotal"/>
      <el-table-column label="Мин. время	" prop="minTimeWaitTotal"/>
      <el-table-column label="Макс. время" prop="maxTimeWaitTotal"/>
    </el-table>

  </main>
</template>


<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const reportStore = useReportStore()
const searchFilter = ref({startDate: new Date()})
const tableData = ref([])
const period = ref(10)
const periodItem = [
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]

const tableRowClassName = ({row}) => {
  if (row.userFirstName === "ИТОГО") return 'blue-text'
  if (row.children) return 'gray-fon '
}

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


// добавляем потомков, и скрываем
function addChildren(data) {
  tableData.value = []
  data.models.forEach((el, ind) => {
    el.userId = ind
    tableData.value.push(el)
    if (el.transactions.length) {
      el.children = []
      el.transactions.forEach(item => {
        el.children.push({
          userFirstName: item.date,
          userLastName: '',
          dealsCountTotal: item.dealsCount,
          averageTimeTotal: item.averageTime,
          minTimeWaitTotal: item.minTimeWait,
          maxTimeWaitTotal: item.maxTimeWait
        })
      })

    }
  })

  tableData.value.push({
    userFirstName: 'ИТОГО',
    userLastName: '',
    dealsCountTotal: data.dealsTotal,
    averageTimeTotal: data.averageTotal,
    minTimeWaitTotal: data.minTotal,
    maxTimeWaitTotal: data.maxTotal
  })
}

function getData() {
  tableData.value = []

  reportStore.getEfficiency(searchFilter.value).then(res => {
    if (!res.models.length) return ElMessage.warning('Нет данных')
    addChildren(res)
  })
}

</script>
