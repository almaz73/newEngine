<template>
  <main>
    <div class="filter-report">
      <h2>Отчет по менеджерам КСО (Входящий звонок) 🌴</h2>

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
      <el-button :icon="Grid" type="danger"
                 :disabled="!searchFilter.organization"
                 @click="getData()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>

    <el-table
        size="small"
        v-if="tableData[0]"
        :row-class-name="tableRowClassName"
        @rowClick="openAppeal"
        selectable="false"
        row-key="ind"
        :tree-props="{ children: 'children'}"
        :data="tableData">

      <el-table-column label="ФИО № Обращения" min-width="150">
        <template #default="scope">
          <span v-if="isNaN(scope.row.rowTitle)">{{scope.row.rowTitle}}</span>
          <a class="blue-text" v-else>{{scope.row.rowTitle}}</a>
        </template>
      </el-table-column>

      <el-table-column label="Назначенные встречи" prop="appointedMeetsCount"/>
      <el-table-column label="Встречи" prop="meetingsCount"/>
      <el-table-column label="Обращения в отдел ксо" prop="creditApplicationCount"/>
      <el-table-column label="Конверсия встречи/обращения в ксо	" prop="applicationInProcessCount"/>
      <el-table-column label="Подача заявки	" prop="applicationApprovalCount"/>
      <el-table-column label="Конверсия встречи/подача заявки" prop="applicationIssueCount"/>

      <el-table-column label="Одобрения" prop="sellsCount"/>
      <el-table-column label="Конверсия подача заявки/одобрения" prop="applicationInProcessConversion"/>
      <el-table-column label="Выдачи в кредит конверсия выдачи/одобрения" prop="creditApplicationConversion"/>
      <el-table-column label="Конверсия выдачи/встречи" prop="applicationApprovalConversion"/>
      <el-table-column label="Выдачи авто" prop="applicationIssueApprovalConversion"/>
      <el-table-column label="Конверсия выдачи авто/выдачи кредит" prop="applicationIssueMeetingsConversion"/>
    </el-table>


  </main>
</template>



<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const searchFilter = ref({startDate: new Date(), communicationType:10})
const reportStore = useReportStore()
const tableData = ref([])
const period = ref(10)
const organizations = ref([])
const periodItem = [
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]
const communicationTypes = [
  {title: 'Входящий звонок', value: 10},
  {title: 'Визит', value: 20},
]


let counColor = 0
const tableRowClassName = () => {
  if (counColor++ % 2) return 'gray-fon '
}

globalStore.getOrganizations().then(res => organizations.value = res.items)

function openAppeal(row) {
  !isNaN(row.rowTitle) && window.open('/v2/appeal/' + row.rowTitle, '_blank');
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

// добавляем потомков
function addChildren(data) {
  tableData.value = []
  data.forEach((el, ind) => {
    el.ind = ind
    tableData.value.push(el)
    if (el.appeals && el.appeals.length) {
      el.children = []
      el.appeals.forEach(item => {
        el.children.push({
          rowTitle: item.appealId,
          callsCount: item.callsCount,
          appointedMeetsCount: item.appointedMeetsCount,
          appointedMeetsConversion: item.appointedMeetsConversion,
          meetingsCount: item.meetingsCount,
          meetingsConversion:item.meetingsConversion,
          sellsCount:+item.isSold,
          meetingSellsConversion: +item.isSold * 100,
          callSellsConversion: +item.isSold * 100 * item.callsCount,
          gm1: item.gm1
        })
      })

    }
  })
}
function getData() {
  tableData.value = []

  reportStore.getCreditFunnel(searchFilter.value).then(res => {
    if (!res.items.length) return ElMessage.warning('Нет данных')
    addChildren(res.items)
  })

}
</script>
