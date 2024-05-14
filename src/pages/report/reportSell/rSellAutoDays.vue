<template>
  <main>
    <div class="filter-report">
      <h2>Количество марок авто в обращениях продаж по дням 🐰</h2>

      <div>
        <label class="label l_300">Выберите год и месяц</label>

        <el-date-picker
            type="month"
            v-model="searchFilter.monthYear"
            format="YYYY MMM"
            :clearable="false"
        />
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="getData()">Сформировать</el-button>
      <el-button type="info" @click="searchFilter ={monthYear: new Date(), department: 6}">Сброс</el-button>
      <br><br>
    </div>

    <el-table
        v-if="tableData[0]"
        :data="tableData"
        :row-class-name="tableRowClassName"
        row-key="userId"
        stripe
        :tree-props="{ children: 'children'}">
      <el-table-column label="Модель" prop="carModelTitle" min-width="120"/>

      <el-table-column
          minWidth="40"
          v-for="(column, ind) in tableData[0].countInDay"
          :key="ind"

          #default="scope"
          :label="String(ind+1)">
        {{ scope.row.countInDay[ind].count ? scope.row.countInDay[ind].count : '' }}
      </el-table-column>

      <el-table-column label="Всего" prop="countInMonth"/>
    </el-table>


  </main>
</template>

<style>
.el-table .blue-text {
  color: cornflowerblue;
  font-weight: bold;
}

.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell{
  background: #ddd;
}
</style>

<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {ElMessage} from "element-plus";

const searchFilter = ref({monthYear: new Date(), department: 6})
const reportStore = useReportStore()
const tableData = ref([])
const departments = ref([])

reportStore.getDepartments().then(res => departments.value = res.items)

const tableRowClassName = ({row}) => {
  if (row.carModelTitle === "ИТОГО") return 'blue-text'
}


// добавляем итоговую строку
function addSum() {
  if (!tableData.value.length) return false
  let sumDays = {}
  tableData.value.forEach(el => {
    el.countInDay.forEach((item, ind) => {
      if (sumDays[ind] !== undefined) sumDays[ind] += item.count
      else sumDays[ind] = item.count
    })
  })

  tableData.value.push({
    carModelTitle: 'ИТОГО',
    countInDay: Object.entries(sumDays).map(el => ({day: el[0], count: el[1]})),
    countInMonth: Object.values(sumDays).reduce((s, i) => i + s, 0)
  })
}


function getData() {
  tableData.value = []
  const params = {
    month: searchFilter.value.monthYear.getMonth() + 1,
    year: searchFilter.value.monthYear.getFullYear()
  }
  reportStore.getAutoSellPerDay(params).then(res => {
    if (!res.items || !res.items.length) {
      return ElMessage.warning('Нет данных')
    }

    tableData.value = res.items
    addSum()
  })
}

</script>
