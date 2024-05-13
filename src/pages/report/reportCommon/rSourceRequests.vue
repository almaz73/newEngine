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
        <label class="label l_300">Отдел</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.department"
            filterable>
          <el-option v-for="item in departments" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="getData()">Сформировать</el-button>
      <el-button type="info" @click="searchFilter ={monthYear: new Date(), department: 6}">Сброс</el-button>
      <br><br>
    </div>

    <el-table
        size="small"
        v-if="tableData[0]"
        :data="tableData"
        :row-class-name="tableRowClassName"
        row-key="userId"
        :tree-props="{ children: 'children'}">
      <el-table-column label="ФИО" min-width="200">
        <template #default="scope">
          <span>
            {{ scope.row.userTitle }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
          minWidth="30"
          v-for="(column, ind) in tableData[0].appealSummByDays"
          :key="ind"
          #default="scope"
          :label="String(ind+1)">
        {{ scope.row.appealSummByDays[ind] ? scope.row.appealSummByDays[ind] : '' }}
      </el-table-column>

      <el-table-column label="Всего" prop="appealsCount"/>
    </el-table>


  </main>
</template>

<style>
.el-table .red-text {
  color: #f56c6c;
  background: #ffefef;
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
  if (row.days) return 'red-text'
}


// добавляем потомков, и скрываем
function addChildren(data) {
  tableData.value = []
  data.forEach(el => {
    tableData.value.push(el)
    if (el.days.length) {
      el.children = []
      el.days.forEach(item => {
        el.children.push({
          userTitle: item.roleTitle,
          appealSummByDays: item.appealsPerDay,
          appealsCount: item.appealsCount,
          parentId: el.userId,
          isShow: false,
        })
      })
    }
  })
}

// добавляем итоговую строку
function addSum() {
  if (!tableData.value.length) return false
  let sumDays = {}
  tableData.value.forEach(el => {
    el.appealSummByDays.forEach((item, ind) => {
      if (!el.days) return false
      if (sumDays[ind] !== undefined) sumDays[ind] += item
      else sumDays[ind] = item
    })
  })

  tableData.value.push({
    userTitle: 'ИТОГО',
    appealSummByDays: Object.values(sumDays),
    appealsCount: Object.values(sumDays).reduce((s, i) => i + s, 0)
  })
}


function getData() {
  tableData.value = []
  const params = {
    department: searchFilter.value.department,
    month: searchFilter.value.monthYear.getMonth() + 1,
    year: searchFilter.value.monthYear.getFullYear()
  }
  reportStore.getSourceAppeals(params).then(res => {
    if (!res.models || !res.models.length) {
      return ElMessage.warning('Нет данных')
    }
    addChildren(res.models)
    addSum()
  })
}

</script>
