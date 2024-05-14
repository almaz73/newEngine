<template>
  <main>
    <div class="filter-report">
      <h2>Обращения продаж 🐤</h2>
    </div>

    <el-table
        size="small"
        v-if="tableData[0]"
        :data="tableData"
        :row-class-name="tableRowClassName"
        row-key="ind"
        stripe
        :tree-props="{ children: 'children'}">
      <el-table-column label="Модель" prop="carModelTitle" min-width="180">
        <template #default="scope">
          <b> {{ scope.row.title }}</b>
        </template>
      </el-table-column>

      <el-table-column
          minWidth="38"
          v-for="(column, ind) in maxDaysInMonths"
          :key="ind"

          #default="scope"
          :label="String(ind+1)">
        {{
          (scope.row.countByDays[ind] && scope.row.countByDays[ind].appealsCount)
              ? scope.row.countByDays[ind].appealsCount : ''
        }}
      </el-table-column>

      <el-table-column label="Всего" prop="appealsCountInMonth">
        <template #default="scope">
          {{ scope.row.appealsCountInMonth ? scope.row.appealsCountInMonth : '' }}
        </template>
      </el-table-column>
    </el-table>

  </main>
</template>

<style>
.el-table .blue-text {
  color: cornflowerblue;
  font-weight: bold;
}

.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background: #ddd;
}
</style>

<script setup>
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";

const reportStore = useReportStore()
const tableData = ref([])
const maxDaysInMonths = ref(0)

const tableRowClassName = ({row}) => {
  if (row.title === "ИТОГО") return 'blue-text'
}

// добавляем потомков, и скрываем
function addChildren(data) {
  tableData.value = []
  data.forEach((el, ind) => {
    el.ind = ind
    el.title = 'Обращений за ' + el.monthRowTitle
    tableData.value.push(el)
    if (el.countByDays.length) {
      let q = JSON.parse(JSON.stringify(el.countByDays))
      el.children = [{
        title: el.monthRowTitle,
        countByDays: q.map(z => ({appealsCount: z.testDriveCount})),
      }]
    }
  })
}

// добавляем итоговую строку
function addSum() {
  if (!tableData.value.length) return false
  let sumDays = {}
  tableData.value.forEach(el => {
    el.countByDays.forEach((item, ind) => {
      if (sumDays[ind] !== undefined) sumDays[ind] += item.appealsCount
      else sumDays[ind] = item.appealsCount
    })
  })

  tableData.value.push({
    title: 'ИТОГО',
    countByDays: Object.entries(sumDays).map(el => ({day: el[0], appealsCount: el[1]})),
    appealsCountInMonth: Object.values(sumDays).reduce((s, i) => i + s, 0)
  })
}


tableData.value = []

reportStore.getSellAppeals().then(res => {
  if (!res.months || !res.months.length) return ElMessage.warning('Нет данных')
  maxDaysInMonths.value = res.maxDaysInMonths
  addChildren(res.months)
  addSum()
})


</script>
