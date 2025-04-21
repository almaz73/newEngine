<template>
  <main>
    <div class="filter-report">
      <h2>Отчет колл-центра по просроченным событиям</h2>
      <div>
        <label class="label l_300">Период</label>

        <el-date-picker
          v-model="searchFilter.DateStart"
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          :clearable="false"
        />
        &nbsp; &nbsp;
        <el-date-picker
          v-model="searchFilter.DateEnd"
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
        <label class="label l_300">Тип сделки</label>
        <el-select
          style="width: 220px"
          v-model="searchFilter.dealType"
          filterable>
          <el-option v-for="item in dealTypes" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Роли</label>
        <el-select
          style="width: 220px"
          multiple
          @change="changeGroup()"
          v-model="searchFilter.Roles"
          filterable>
          <el-option v-for="item in roles" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Сотрудник</label>
        <el-select
          style="width: 220px"
          multiple
          v-model="searchFilter.Users"
          filterable>
          <el-option v-for="item in myEmployees" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>
      </div>


      <br>
      <el-button :icon="Grid" type="danger" @click="getData()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <el-button :icon="Printer"  type="info"  @click="toPrint()">Печать</el-button>
    </div>
    <br>
    <el-table
      :data="tableData"
      size="small"
      v-if="tableData.length"
      border
      empty-text="Нет данных"
      :row-class-name="tableRowClassName"
      highlight-current-row
    >
      <el-table-column label="ФИО МЕНЕДЖЕРА" prop="responsible"/>
      <el-table-column label="ТИП СДЕЛКИ" prop="appealTypeName"/>
      <el-table-column label="МЕСТО ВЫКУПА" prop="location"/>
      <el-table-column label="НОМЕР ОБРАЩЕНИЯ">
        <template #default="scope">
          <a @click="openLink(scope.row)">{{scope.row.appealId}}</a>
        </template>
      </el-table-column>
      <el-table-column label="ФИО клиента / Телефон">
        <template #default="scope">
          {{formattingPhone(scope.row.clientPhone)}}
        </template>
      </el-table-column>
      <el-table-column label="Марка / Модель" prop="auto"/>
      <el-table-column label="ДАТА ПРОСРОЧЕННОГО СОБЫТИЯ" prop="expiredEventDate"/>
      <el-table-column label="ТИП СОБЫТИЯ" prop="type"/>
      <el-table-column label="СОБЫТИЕ" prop="expiredEventDescription" min-width="200"/>

    </el-table>

    <template v-if="total>2">
      <el-pagination
        v-model:page-size="rowsPerPage"
        :page-sizes="[5, 10, 20, 50]"
        layout="prev, pager, next, sizes"
        @current-change="changePage"
        @size-change="changePageSize"
        :total="total"
      />
      <div class="page-info">Всего {{ total }}</div>
    </template>
  </main>
</template>
<script setup lang="ts">
import {Grid, Printer} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useReportStore} from "@/stores/reportStore";
import { formatDateDDMMYYYY, formattingPhone } from "@/utils/globalFunctions";
import {useGlobalStore} from '@/stores/globalStore'
import { ElMessage } from "element-plus";

const globalStore = useGlobalStore()
const searchFilter = ref({Take:25, Skip:0})
const reportStore = useReportStore()
const tableData = ref([])
const myEmployees = ref([])
const allEmployees = ref([])
const dealTypes = [
  { title: 'Выкуп (трейд-ин)', value: 10 },
  { title: 'Комиссия', value: 20 }
]
const roles = ref([])
const period = ref(30)
const periodItem = [
  {title: 'За все время', value: 40},
  {title: 'Текущий месяц', value: 10},
  {title: 'Прошлый месяц', value: 20},
  {title: '2 месяца назад', value: 30},
]
const rowsPerPage = ref(25);
const total = ref(0);
let WorkflowLeadTypes = [];

reportStore.getwWorkflowLeadTypes().then(res => WorkflowLeadTypes = res.items);

function init() {
  period.value = 30;
  searchFilter.value.Roles = [];
  searchFilter.value.Users = [];
  searchFilter.value.dealType = null;
  tableData.value = [];
  monthChanged();
}

init();



globalStore.getRoles({roles:[110, 111, 112, 113]}).then(res => {
  allEmployees.value = res.items
  myEmployees.value = JSON.parse(JSON.stringify(allEmployees.value))
})

function changeGroup() {
  searchFilter.value.employeeId = null
  myEmployees.value = allEmployees.value.filter(el => {
    if (searchFilter.value.Roles.includes(el.role)) return el
  })
}


reportStore.getRolesForExpiredEventsReport().then(res=>roles.value = res)

const tableRowClassName = ({row}) => {
  let styles = ''
  if (!row.isShow) styles += 'hide-row '
  if (row.level === 2) styles += 'gray-fon '
  return styles
}


function monthChanged() {
  let currentMonth = new Date(new Date().setDate(1))
  if (period.value === 20) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
  if (period.value === 30) currentMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() - 2))

  searchFilter.value.DateStart = formatDateDDMMYYYY(currentMonth)
  searchFilter.value.DateEnd = formatDateDDMMYYYY(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))

  if (period.value === 40) {
    searchFilter.value.DateStart = null
    searchFilter.value.DateEnd = null
  }

}

function getLink() {
  let S = searchFilter.value;

  if (!S.Roles || !S.Roles.length) S.Roles = roles.value.map(el => el.value);

  let link = `?DateStart=`;

  if (S.DateStart) link += S.DateStart;
  link += `&DateEnd=`;
  if (S.DateEnd) link += `${S.DateEnd}`;
  if (S.Roles && S.Roles.length) S.Roles.forEach(el => link += "&Roles=" + el);
  if (S.Users && S.Users.length) S.Users.forEach(el => link += "&Users=" + el);
  S.Skip = S.Skip ? S.Skip : 0;
  S.Take = S.Take ? S.Take : 25;
  link += `&Skip=${S.Skip}&Take=${S.Take}`;

  setTimeout(() => {
    if (S.Roles.length === 4) S.Roles = [];
  });

  return link;
}

function toPrint() {
  ElMessage({ message: "Готово! Файл можно забрать из загрузок браузера.", type: "success" });
  location.href = "/api/report/call-center/GetExpiredEventsReportFile/" + getLink();
}


function getData() {
  reportStore.getExpiredEventsReport(getLink()).then(res => {
    tableData.value = res.data.items;
    total.value = res.data.total;

    tableData.value.map(el => {
      let found = WorkflowLeadTypes.find(item => item.name === el.appealType);
      if (found) el.appealTypeName = found.title;
    });

    if (!tableData.value.length) ElMessage.warning("Нет данных");
  });

}

function changePageSize() {
  searchFilter.value.Take = rowsPerPage.value;
  getData();
}

function changePage(val) {
  searchFilter.value.Skip = (val - 1) * rowsPerPage.value;
  getData();
}


function openLink(row) {
  if (row.appealType === "Commission") window.open("appeal/commission/" + row.appealId);
  else window.open("appeal/" + row.appealId);
}


</script>
