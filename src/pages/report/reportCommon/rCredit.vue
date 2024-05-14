<template>
  <main>
    <div class="filter-report">
      <h2>Отчет по кредитам 🦉</h2>
      <div>
        <label class="label l_300">Вид отчета</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.reportType"
            @change="changeType()"
            filterable>
          <el-option v-for="item in reportTypes" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </div>

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


      <div v-if="searchFilter.reportType===10">
        <label class="label l_300">Оформитель</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.user"
            filterable>
          <el-option v-for="item in decorators" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>
      </div>

      <div v-if="searchFilter.reportType===40">
        <label class="label l_300">Менеджеры</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.manager"
            filterable>
          <el-option v-for="item in managers" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>
      </div>

      <div v-if="searchFilter.reportType===30">
        <label class="label l_300">Партнеры</label>
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
        class="tableStyle"
        selectable="false"
        :data="tableData">
      <el-table-column label="Наименование" prop="title"/>
      <el-table-column label="Обращения, шт" prop="appealsCount"/>
      <el-table-column label="Подано заявок, шт" prop="creditCount"/>
      <el-table-column label="Обр/заявки,%" prop="creditCountProc">
      </el-table-column>
      <el-table-column label="Одобрено, шт" prop="approvedCount"/>
      <el-table-column label="Одобрено, %" prop="approvedCountProc"/>
      <el-table-column label="Одоб.с лимитом" prop="approvedLimitCount"/>
      <el-table-column label="Одоб.с лимитом, %" prop="approvedLimitCountProc"/>
      <el-table-column label="Отказано,шт" prop="deniedCount"/>
      <el-table-column label="Отказано, %" prop="deniedCountProc"/>
      <el-table-column label="Выдано, шт" prop="completedCount"/>
      <el-table-column label="Выдано, %" prop="completedCountProc"/>
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
</style>


<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const searchFilter = ref({startDate: new Date(), reportType: 10})
const reportStore = useReportStore()
const tableData = ref([])
const period = ref(10)
const managers = ref([])
const organizations = ref([])
const periodItem = [
  {title: 'Текущий месяй', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]
const reportTypes = ref([
  {id: 10, name: 'Оформители'},
  {id: 20, name: 'Банки'},
  {id: 40, name: 'Менеджеры'},
]);

const decorators = ref([])

reportStore.getCreditReportUsers().then(res => {
  decorators.value = res.items
  managers.value = res.items
})

if (
    globalStore.account.role === 'Admin' ||
    globalStore.account.role === 'RegionManager' ||
    globalStore.account.id === 38
) {
  reportTypes.value.push({id: 30, name: 'Партнеры'});
}

function changeType() {
  searchFilter.value.user = null
  searchFilter.value.bank = null
  searchFilter.value.manager = null
  searchFilter.value.organization = null
  if (searchFilter.value.reportType === 10 && !organizations.value.length) {
    globalStore.getOrganizations().then(res => organizations.value = res.items)
  }
}


function init() {
  searchFilter.value.startDate = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.endDate = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.reportType = 10;
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

  reportStore.getCreditReport(searchFilter.value).then(res => {
    if (!res.length) return ElMessage.warning('Нет данных')
    tableData.value = res
  })
}

</script>
