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


    <br>
    <el-button :icon="Grid" type="danger" @click="toCearch()">Сформировать</el-button>
    <el-button type="info" @click="initFilter()">Сброс</el-button>
    <br><br>
    <el-tabs @tabChange="tabChange()" v-model="activeName">
      <el-tab-pane label="Стандартый" name="standart">
        <el-table
            size="small"
            :data="tableData"
            :row-class-name="tableRowClassName"
            @rowClick="rowClick"
            row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column label="ФИО" prop="employeeTitle"/>
          <el-table-column label="Обращения" prop="appealCount"/>
          <el-table-column label="Оценки А/М" prop="buyCount"/>
          <el-table-column label="Обращения-оценки" prop="appealBuyProc"/>
          <el-table-column label="Выкуплено А/М" prop="boughtCount"/>
          <el-table-column label="Обращения-выкуп, %" prop="onCommissionProc"/>

        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Иерархический" name="ierarh">
        Иерархический
      </el-tab-pane>
      <el-tab-pane label="Табличный" name="tabl">
        Табличный
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
import {useReportStore} from "@/stores/reportStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";

const searchFilter = ref({})
const globalStore = useGlobalStore()
const reportStore = useReportStore()
const tableData = ref([])
const activeName = ref('standart')
let data = []
const dealTypes = ref([
  {title: 'Выкуп (трейд-ин)', value: 10},
  {title: 'Комиссия', value: 20},
])

const tableRowClassName = ({row}) => {
  if (row.appealId) return 'red-text'
  return ''
}

const myEmployees = ref([])
globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)

function tabChange(tab) {
  console.log('tabChange tab', tab)
}

function rowClick(row) {
  window.open('/v2/appeal/' + row.appealId, '_blank');
}

function initFilter() {
  searchFilter.value.lowCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().setDate(1)))
  searchFilter.value.highCreateDatePeriod = formatDateDDMMYYYY(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
  searchFilter.value.dealType = 10
  searchFilter.value.employeeId = null
  searchFilter.value.buyTypeView = null
}

initFilter()

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
    data = res.employees

    /*
    data = [{
      "employeeTitle": "Валиева Юлия",
      "appealCount": 8,
      "buyCount": 8,
      "boughtCount": 0,
      "onCommissionCount": 0,
      "appealBuyProc": 100.0,
      "appealBoughtProc": 0.0,
      "onCommissionProc": 0.0,
      "buyoutLocations": [
        {
          "locationTitle": "Выкуп (Магнитогорск)",
          "locationId": 434,
          "appealCount": 7,
          "buyCount": 6,
          "boughtCount": 0,
          "onCommissionCount": 0,
          "appealBuyProc": 85.7,
          "appealBoughtProc": 0.0,
          "onCommissionProc": 0.0,
          "listAppeals": [
            {
              "appealId": 1675303,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Павел ",
              "appealClientPhone": "89630834385",
              "appealAuto": "Hyundai Solaris"
            },
            {
              "appealId": 1675455,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Сергей ",
              "appealClientPhone": "89959272281",
              "appealAuto": "Hyundai Solaris"
            },
            {
              "appealId": 1675473,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Владимир ",
              "appealClientPhone": "89043007469",
              "appealAuto": "Datsun on-DO"
            },
            {
              "appealId": 1675875,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Данил ",
              "appealClientPhone": "89995816866",
              "appealAuto": "ВАЗ (LADA) Granta"
            },
            {
              "appealId": 1677701,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Татьяна ",
              "appealClientPhone": "89995856432",
              "appealAuto": "ВАЗ (LADA) Granta"
            },
            {
              "appealId": 1678518,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Александр ",
              "appealClientPhone": "89823145303",
              "appealAuto": "Renault Megane"
            },
            {
              "appealId": 1677492,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Вячеслав ",
              "appealClientPhone": "89123097386",
              "appealAuto": "Hyundai Solaris"
            }
          ],
          "listBuys": [
            {
              "appealId": 1675303,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": " Павел ",
              "appealClientPhone": "89630834385",
              "appealAuto": "Hyundai Solaris"
            },
            {
              "appealId": 1675875,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": " Данил ",
              "appealClientPhone": "89995816866",
              "appealAuto": "ВАЗ (LADA) Granta"
            },
            {
              "appealId": 1675455,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": " Сергей ",
              "appealClientPhone": "89959272281",
              "appealAuto": "Hyundai Solaris"
            },
            {
              "appealId": 1677492,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": " Вячеслав ",
              "appealClientPhone": "89123097386",
              "appealAuto": "Hyundai Solaris"
            },
            {
              "appealId": 1677701,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": " Татьяна ",
              "appealClientPhone": "89995856432",
              "appealAuto": "ВАЗ (LADA) Granta"
            },
            {
              "appealId": 1678518,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": " Александр ",
              "appealClientPhone": "89823145303",
              "appealAuto": "Renault Megane"
            }
          ],
          "listBoughts": [],
          "listOnCommission": []
        },
        {
          "locationTitle": "Выездной выкуп (Магнитогорск)",
          "locationId": 433,
          "appealCount": 1,
          "buyCount": 2,
          "boughtCount": 0,
          "onCommissionCount": 0,
          "appealBuyProc": 200.0,
          "appealBoughtProc": 0.0,
          "onCommissionProc": 0.0,
          "listAppeals": [
            {
              "appealId": 1676494,
              "appealType": 2,
              "appealTypeTitle": "Выкуп",
              "appealClientTitle": " Анатолий ",
              "appealClientPhone": "89191173664",
              "appealAuto": "Volkswagen Jetta"
            }
          ],
          "listBuys": [
            {
              "appealId": 1676494,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": " Анатолий ",
              "appealClientPhone": "89191173664",
              "appealAuto": "Volkswagen Jetta"
            },
            {
              "appealId": 1672302,
              "appealType": 0,
              "appealTypeTitle": null,
              "appealClientTitle": "Караченцев Дмитрий Петрович",
              "appealClientPhone": "89220197277",
              "appealAuto": "ВАЗ (LADA) Granta"
            }
          ],
          "listBoughts": [],
          "listOnCommission": []
        }
      ]
    },
      {
        "employeeTitle": "Грибова Ольга",
        "appealCount": 3,
        "buyCount": 0,
        "boughtCount": 0,
        "onCommissionCount": 0,
        "appealBuyProc": 0.0,
        "appealBoughtProc": 0.0,
        "onCommissionProc": 0.0,
        "buyoutLocations": [
          {
            "locationTitle": "ОВ АСП Победа КЗН",
            "locationId": 165,
            "appealCount": 2,
            "buyCount": 0,
            "boughtCount": 0,
            "onCommissionCount": 0,
            "appealBuyProc": 0.0,
            "appealBoughtProc": 0.0,
            "onCommissionProc": 0.0,
            "listAppeals": [
              {
                "appealId": 1690521,
                "appealType": 2,
                "appealTypeTitle": "Выкуп",
                "appealClientTitle": " Динар ",
                "appealClientPhone": "89397427693",
                "appealAuto": null
              },
              {
                "appealId": 1677534,
                "appealType": 2,
                "appealTypeTitle": "Выкуп",
                "appealClientTitle": " Юрий ",
                "appealClientPhone": "89046659001",
                "appealAuto": "ВАЗ (LADA) 2114 Samara"
              }
            ],
            "listBuys": [],
            "listBoughts": [],
            "listOnCommission": []
          },
          {
            "locationTitle": "Выезд ОВ АСП Победа КЗН",
            "locationId": 59,
            "appealCount": 1,
            "buyCount": 0,
            "boughtCount": 0,
            "onCommissionCount": 0,
            "appealBuyProc": 0.0,
            "appealBoughtProc": 0.0,
            "onCommissionProc": 0.0,
            "listAppeals": [
              {
                "appealId": 1677114,
                "appealType": 2,
                "appealTypeTitle": "Выкуп",
                "appealClientTitle": " Адель ",
                "appealClientPhone": "89991692901",
                "appealAuto": "ВАЗ (LADA) 2114 Samara"
              }
            ],
            "listBuys": [],
            "listBoughts": [],
            "listOnCommission": []
          }
        ]
      }]
    */

    if (data.length)makeStandart()
    else ElMessage.warning('Нет данных')
  })
}

function makeStandart() {
  console.log('data', data)
  tableData.value = []
  let idCount = 0
  let count1 = 0
  let count2 = 0
  let count3 = 0
  let count4 = 0
  let count5 = 0
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
      item.listAppeals.forEach(z => {
        count++;
        idCount++
        z.id = idCount
        z.employeeTitle = count + '. Выкуп'
        z.appealCount = z.appealClientTitle
        z.buyCount = '☎ ' + z.appealClientPhone
        z.appealBuyProc = '🚕 ' + z.appealAuto
        el.children.push(z)
      })
    })
  })
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
