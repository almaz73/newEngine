<template>
  <main>
    <div class="filter-report">
      <h2>Отчет по выкупу 🌼</h2>

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
            placeholder="Выберите значение"
            @change="cityChanged(searchFilter.city)"
            filterable>
          <el-option v-for="item in cities" :key="item" :label="item" :value="item"/>
        </el-select>
      </div>

      <div>
        <label class="label l_300">Место выкупа</label>
        <el-select
            style="width: 220px"
            v-model="searchFilter.location"
            placeholder="Выберите значение"
            filterable>
          <el-option v-for="item in locations" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>
      </div>


      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
      <br><br>
    </div>
    <el-table
        size="small"
        :data="tableData"
        v-if="tableData.length"
        :row-class-name="tableRowClassName"
        @headerClick="headerClick"
        @rowClick="openAppeal"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column label="Место выкупа" prop="location"/>
      <el-table-column label="Обращения ⭐" prop="appealCount" v-if="star===1"/>
      <el-table-column label="Обращения ✰" prop="appealCount" v-else/>
      <el-table-column label="Осмотров ⭐" prop="buyCount" v-if="star===2"/>
      <el-table-column label="Осмотров ✰" prop="buyCount" v-else/>
      <el-table-column label="Выкуплено ⭐" prop="bougthCount" v-if="star===3"/>
      <el-table-column label="Выкуплено ✰" prop="bougthCount" v-else/>
      <el-table-column label="Выкуплено/осмотр" prop="buyAppeal"/>
      <el-table-column label="Выкуплено/обращения" prop="bougthBuy"/>
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
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";

const searchFilter = ref({})
const reportStore = useReportStore()
const star = ref(1)
const tableData = ref([])
const locations = ref([])
const cities = ref([])
let dataOld = []


function cityChanged(city) {
  reportStore.getLocation({city, types: 10}).then(res => {
    cities.value = res.citys
    locations.value = res.items
  })
}


const tableRowClassName = ({row}) => {
  if (row.appealId) return 'red-text'
}

function headerClick(a) {
  if (a.label === "Обращения ✰") star.value = 1
  if (a.label === "Осмотров ✰") star.value = 2
  if (a.label === "Выкуплено ✰") star.value = 3
  makeStandart(true)
}

function openAppeal(row) {
  row.appealId && window.open('/v2/appeal/' + row.appealId, '_blank');
}

function init() {
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.type = 20
  searchFilter.value.location = null
  searchFilter.value.city = null
  cityChanged()
}

init()

function toSearch() {
  reportStore.getByuouts(searchFilter.value).then(res => {
    dataOld = res.items
    if (dataOld.length) makeStandart(true)
    else ElMessage.warning('Нет данных')
  })
}

function makeStandart() {
  let data = JSON.parse(JSON.stringify(dataOld))
  tableData.value = []
  let idCount = 0
  data.forEach(el => {
    el.children = []
    idCount++
    el.id = idCount
    el.appeals && el.appeals.forEach(item => {
      if (star.value === 1 && (!item.inspected && !item.finished)) add(el, item)
      if (star.value === 2 && (item.inspected && !item.finished)) add(el, item)
      if (star.value === 3 && (item.inspected && item.finished)) add(el, item)
    })
  })

  function add(el, item) {
    idCount++
    item.id = idCount
    item.appealCount = item.appealId
    item.buyCount = item.clientFirstName
    item.buyAppeal = item.appealClientTitle
    item.bougthBuy = '☎ ' + item.clientPhone
    item.buyAppeal = '🚕 ' + item.carBrand + ' ' + item.carModel
    el.children.push(item)
  }

  tableData.value = data
}


</script>
