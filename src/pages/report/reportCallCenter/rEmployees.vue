<template>
  <main>
    <h2>Отчет колл-центра по сотрудникам</h2>

    <div>
      <label class="label l_300">Период</label>

      <el-date-picker
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          v-model="searchFilter.lowCreateDatePeriod"

      />
      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      <el-date-picker
          format="DD.MM.YYYY"
          value-format="DD.MM.YYYY"
          v-model="searchFilter.highCreateDatePeriod"
      />

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
      <label class="label l_300">Cотруджник</label>
      <el-select
          style="width: 220px"
          v-model="searchFilter.employeeId"
          filterable>
        <el-option v-for="item in myEmployees" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
    </div>

    <div>
      <label class="label l_300">Отображение места выкупа</label>
      <el-select
          style="width: 220px"
          v-model="searchFilter.buyTypeView"
          filterable>
        <el-option v-for="item in BuyTypeViews" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
    </div>

    <br>
    <el-button :icon="Grid" type="danger" @click="toCearch()">Сформировать</el-button>
    <el-button type="info" @click="init()">Сброс</el-button>

    <br><br>
    <el-table
        style="margin-top: 24px"
        :data="tableData"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="ФИО" prop="employeeTitle"/>
      <el-table-column label="ФИО" prop="appealCount"/>
      <el-table-column label="Дата" width="100">
        <template #default="scope">
<!--          {{ formatDMY_hm(scope.row.createDate) }}-->
        </template>
      </el-table-column>
    </el-table>

  </main>
</template>
<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const searchFilter = ref({})
const globalStore = useGlobalStore()
const reportStore = useReportStore()
const tableData = ref([])
const dealTypes = ref([
  {title: 'Выкуп (трейд-ин)', value: 10},
  {title: 'Комиссия', value: 20},
])
const BuyTypeViews = [
  {id: 0, title: 'По умолчанию'},
  {id: 1, title: 'Иерархический'},
  {id: 2, title: 'Табличный'},
]

const myEmployees = ref([])
globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)

function init() {
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.dealType = null
  searchFilter.value.employeeId = null
  searchFilter.value.buyTypeView = null
}

init()

function toCearch() {
  let S = searchFilter.value
  let params = {
    lowCreateDatePeriod: S.lowCreateDatePeriod,
    highCreateDatePeriod: S.highCreateDatePeriod
  }
  if (S.dealType) params.dealType = S.dealType
  if (S.employeeId) params.employeeId = S.employeeId
  if (S.buyTypeView) params.buyTypeView = S.buyTypeView
  reportStore.getEmployee(params).then(res => {
    console.log('res=>', res)
    tableData.value = res.employees

  })
}


</script>
