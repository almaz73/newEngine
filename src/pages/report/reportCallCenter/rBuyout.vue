<template>
  <main>
    <div class="filter-report">
      <h2>Отчет по выкупу        🌼</h2>

      <div>
        <label class="label l_300">Период</label>

        <el-date-picker
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
            v-model="searchFilter.lowCreateDatePeriod"

        />
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        <el-date-picker
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
            v-model="searchFilter.highCreateDatePeriod"
        />

      </div>

      <div>
        <label class="label l_300">Город</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.city"
            filterable>
          <el-option v-for="item in cities" :key="item" :label="item" :value="item"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Cотрудник</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.location"
            filterable>
          <el-option v-for="item in locations" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>
      </div>


      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>
    <el-tabs @tabChange="tabChange" v-model="activeName" v-if="tableData.length">
      <el-tab-pane label="Стандартый" name="standart">
        <el-table
            size="small"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @headerClick="headerClick"
            @rowClick="openAppeal"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column label="ФИО" prop="employeeTitle"/>
          <el-table-column label="Место выкупа" prop="locationTitle" v-if="tabView === 3"/>
          <el-table-column label="Обращения ⭐" prop="appealCount" v-if="star===1"/>
          <el-table-column label="Обращения ✰" prop="appealCount" v-else/>
          <el-table-column label="Оценки А/М ⭐" prop="buyCount" v-if="star===2"/>
          <el-table-column label="Оценки А/М ✰" prop="buyCount" v-else/>
          <el-table-column label="Обращения-оценки" prop="appealBuyProc"/>
          <el-table-column label="Выкуплено А/М ⭐" prop="boughtCount" v-if="star===3"/>
          <el-table-column label="Выкуплено А/М ✰" prop="boughtCount" v-else/>
          <el-table-column label="Обращения-выкуп, %" prop="onCommissionProc"/>
        </el-table>

      </el-tab-pane>
      <el-tab-pane label="Иерархический" name="ierarh">
        <el-table
            size="small"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @headerClick="headerClick"
            @rowClick="openAppeal"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column label="ФИО" prop="employeeTitle"/>
          <el-table-column label="Место выкупа" prop="locationTitle" v-if="tabView === 3"/>
          <el-table-column label="Обращения ⭐" prop="appealCount" v-if="star===1"/>
          <el-table-column label="Обращения ✰" prop="appealCount" v-else/>
          <el-table-column label="Оценки А/М ⭐" prop="buyCount" v-if="star===2"/>
          <el-table-column label="Оценки А/М ✰" prop="buyCount" v-else/>
          <el-table-column label="Обращения-оценки" prop="appealBuyProc"/>
          <el-table-column label="Выкуплено А/М ⭐" prop="boughtCount" v-if="star===3"/>
          <el-table-column label="Выкуплено А/М ✰" prop="boughtCount" v-else/>
          <el-table-column label="Обращения-выкуп, %" prop="onCommissionProc"/>
        </el-table>

      </el-tab-pane>
      <el-tab-pane label="Табличный" name="tabl">
        <el-table
            size="small"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @headerClick="headerClick"
            @rowClick="openAppeal"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
          <el-table-column label="ФИО" prop="employeeTitle"/>
          <el-table-column label="Место выкупа" prop="locationTitle" v-if="tabView === 3"/>
          <el-table-column label="Обращения ⭐" prop="appealCount" v-if="star===1"/>
          <el-table-column label="Обращения ✰" prop="appealCount" v-else/>
          <el-table-column label="Оценки А/М ⭐" prop="buyCount" v-if="star===2"/>
          <el-table-column label="Оценки А/М ✰" prop="buyCount" v-else/>
          <el-table-column label="Обращения-оценки" prop="appealBuyProc"/>
          <el-table-column label="Выкуплено А/М ⭐" prop="boughtCount" v-if="star===3"/>
          <el-table-column label="Выкуплено А/М ✰" prop="boughtCount" v-else/>
          <el-table-column label="Обращения-выкуп, %" prop="onCommissionProc"/>
        </el-table>
      </el-tab-pane>
    </el-tabs>


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
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";

const searchFilter = ref({})
const globalStore = useGlobalStore()
const reportStore = useReportStore()
const star = ref(1)
const tabView = ref(1)
const tableData = ref([])
const activeName = ref('standart')
const locations = ref([])
const cities = ref([])
// const adminStore=useAdminStore()
let data = []
let dataOld = []
const dealTypes = [{title: 'Выкуп (трейд-ин)', value: 10}, {title: 'Комиссия', value: 20}]

globalStore.getPlaces().then(res => {
  console.log('res', res)
  res.items.map(el => el.name = el.title + '  - (' + el.city + ' ' + el.typeTitle + ')')
  cities.value =  res.citys
  locations.value =  res.items
})

const tableRowClassName = ({row}) => {
  if (row.appealId) return 'red-text'
}

const myEmployees = ref([])
globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)

function tabChange(tab) {
  if (tab === 'standart') tabView.value = 1;
  if (tab === 'ierarh') tabView.value = 2;
  if (tab === 'tabl') tabView.value = 3;
  makeStandart()
}

function headerClick(a) {
  if (a.label === "Обращения ✰") star.value = 1
  if (a.label === "Оценки А/М ✰") star.value = 2
  if (a.label === "Выкуплено А/М ✰") star.value = 3
  makeStandart(true)
}

function openAppeal(row) {
  row.appealId && window.open('/v2/appeal/' + row.appealId, '_blank');
}

function init() {
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.dealType = 10
  searchFilter.value.employeeId = null
  searchFilter.value.buyTypeView = null
}

init()

function toSearch() {
  let S = searchFilter.value
  let params = {
    lowCreateDatePeriod: S.lowCreateDatePeriod,
    highCreateDatePeriod: S.highCreateDatePeriod
  }
  if (S.dealType) params.dealType = S.dealType
  if (S.employeeId) params.employeeId = S.employeeId
  if (S.buyTypeView) params.buyTypeView = S.buyTypeView
  reportStore.getEmployee(params).then(res => {
    dataOld = res.employees

    if (dataOld.length) makeStandart(true)
    else ElMessage.warning('Нет данных')
  })
}

function makeStandart() {
  let isPlace = tabView.value === 3
  // кеширующие поля
  data = JSON.parse(JSON.stringify(dataOld))
  tableData.value = []
  let idCount = 0
  let count1 = 0
  let count2 = 0
  let count3 = 0
  let count4 = 0
  let count5 = 0
  if ([1, 3].includes(tabView.value)) {
    data.forEach(el => {
      let count = 0
      el.children = []
      idCount++
      count1 += el.appealCount
      count2 += el.appealBuyProc
      count3 += el.buyCount
      count4 += el.boughtCount
      count5 += el.onCommissionProc
      el.id = idCount
      el.buyoutLocations.forEach(item => {
        let arrList = item.listAppeals
        if (star.value === 2) arrList = item.listBuys
        if (star.value === 3) arrList = item.listBoughts
        arrList.forEach(z => {
          count++;
          idCount++
          z.id = idCount
          if (isPlace) z.locationTitle = item.locationTitle
          z.employeeTitle = count + '. Выкуп'
          z.appealCount = z.appealClientTitle
          z.buyCount = '☎ ' + z.appealClientPhone
          z.appealBuyProc = '🚕 ' + z.appealAuto
          el.children.push(z)
        })
      })
    })
  }
  if (tabView.value === 2) {
    data.forEach(el => {
      let count = 0
      el.children = []
      idCount++
      count1 += el.appealCount
      count2 += el.appealBuyProc
      count3 += el.buyCount
      count4 += el.boughtCount
      count5 += el.onCommissionProc
      el.id = idCount
      el.buyoutLocations.forEach(item => {
        item.children = []
        idCount++;
        item.id = idCount
        item.employeeTitle = item.locationTitle
        let arrList = item.listAppeals
        if (star.value === 2) arrList = item.listBuys
        if (star.value === 3) arrList = item.listBoughts
        arrList.forEach(z => {
          count++;
          idCount++
          z.id = idCount
          z.employeeTitle = count + '. Выкуп'
          z.appealCount = z.appealClientTitle
          z.buyCount = '☎ ' + z.appealClientPhone
          z.appealBuyProc = '🚕 ' + z.appealAuto
          item.children.push(z)
        })
        el.children.push(item)
      })
    })
  }

  data.push({
    employeeTitle: 'ИТОГО',
    appealCount: count1,
    appealBuyProc: count2,
    buyCount: count3,
    boughtCount: count4,
    onCommissionProc: count5,
  })

  tableData.value = data
}


</script>
