<template>
  <main>
    <div class="filter-report">
      <h2>Отчет по источнику обращений 🐊</h2>

      <div>
        <label class="label l_300">Выберите год и месяц</label>

        <el-date-picker
            type="month"
            v-model="searchFilter.monthYear"
            format="YYYY MMM"
            :clearable="false"
        />
      </div>

      <div>
        <label class="label l_300">Тип сделки</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.department"
            filterable>
          <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>

    <el-table
        size="small"
        v-if="tableData[0]"
        :data="tableData"
        :row-class-name="tableRowClassName"
        @rowClick="openAppeal"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="ФИО" prop="userTitle"/>
      <el-table-column
          minWidth="30"
          v-for="(column, ind) in tableData[0].appealSummByDays"
          :key="ind"
          :label="''+(ind+1)">
        {{ column ? column : '' }}
      </el-table-column>

      <el-table-column label="Всего" prop="appealsCount"/>
    </el-table>


  </main>
</template>

<style>
.el-table .red-text {
  color: #f56c6c;
}
</style>

<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";

const searchFilter = ref({})
const reportStore = useReportStore()
const tableData = ref([])
const departments = ref([])
let data = []

reportStore.getDepartments().then(res => departments.value = res.items)

const tableRowClassName = ({row}) => {
  if (row.appealId) return 'red-text'
}




function openAppeal(row) {
  console.log('row', row)

  // row.appealId && window.open('/v2/appeal/' + row.appealId, '_blank');
}

function init() {
  searchFilter.value.monthYear = new Date()
  searchFilter.value.department = 6




  tableData.value = data

}

init()



function toSearch() {
  const params = {
    department: searchFilter.value.department,
    month: searchFilter.value.monthYear.getMonth() + 1 - 1,
    year: searchFilter.value.monthYear.getFullYear()
  }
  reportStore.getSourceAppeals(params).then(res => {
    console.log('res', res)

    // res.models.push({
    //   employeeTitle: 'ИТОГО',
    // })

    tableData.value = res.models
  })
}

</script>
