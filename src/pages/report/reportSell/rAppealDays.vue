<template>
  <main>
    <div class="filter-report">
      <h2>Количество обращений по дням </h2>

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
        size="small"
        :data="tableData"
        :row-class-name="tableRowClassName"
        row-key="userId"
        :tree-props="{ children: 'children'}">
      <el-table-column label="ФИО" prop="userFullName" min-width="120"/>

      <el-table-column
          minWidth="35"
          v-for="(column, ind) in tableData[0].meetingCountPerDay"
          :key="ind"

          #default="scope"
          :label="String(ind+1)">
        {{ scope.row.meetingCountPerDay[ind] || '' }}
      </el-table-column>

      <el-table-column label="Всего" prop="meetingCount"/>
    </el-table>


  </main>
</template>

<style>
.el-table .blue-text {
  color: cornflowerblue;
  font-weight: bold;
}


.el-table .gray-fon {
  --el-table-tr-bg-color: #eee;
  cursor: initial;
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
  if (row.userFullName === "ИТОГО") return 'blue-text'
  if (row.children) return 'gray-fon '
}

// добавляем потомков, и скрываем
function addChildren(data) {
  tableData.value = []
  data.forEach((el, ind) => {
    el.ind = ind
    el.title = 'Обращений за ' + el.monthRowTitle
    tableData.value.push(el)
    if (el.meetingCountPerDay.length) {
      let work = JSON.parse(JSON.stringify(el.worksheetCountPerDay))
      let tradeIn = JSON.parse(JSON.stringify(el.tradInCountPerDay))
      let recomend = JSON.parse(JSON.stringify(el.recomendationCountPerDay))
      let meet = JSON.parse(JSON.stringify(el.meetingCountPerDay))
      el.children = [{
        userFullName: 'Рабочих листов',
        meetingCountPerDay: work,
      }, {
        userFullName: 'Трейд-ин',
        meetingCountPerDay: tradeIn,
      }, {
        userFullName: 'Рекомендация',
        meetingCountPerDay: recomend,
      }, {
        userFullName: 'Рекомендация',
        meetingCountPerDay: meet,
      }]
    }
  })
}

// добавляем итоговую строку
function addSum() {
  if (!tableData.value.length) return false
  let meetingCountPerDay = {}
  tableData.value.forEach(el => {
    el.meetingCountPerDay.forEach((item, ind) => {
      if (meetingCountPerDay[ind] !== undefined) meetingCountPerDay[ind] += item
      else meetingCountPerDay[ind] = item
    })
  })

  tableData.value.push({
    userFullName: 'ИТОГО',
    meetingCountPerDay: meetingCountPerDay,
    meetingCount: Object.values(meetingCountPerDay).reduce((s, i) => i + s, 0)
  })
}


function getData() {
  tableData.value = []
  const params = {
    month: searchFilter.value.monthYear.getMonth() + 1,
    year: searchFilter.value.monthYear.getFullYear()
  }

  reportStore.getAppealsDays(params).then(res => {
    if (!res.items || !res.items.length) return ElMessage.warning('Нет данных')
    addChildren(res.items)
    addSum()
  })

}

</script>
