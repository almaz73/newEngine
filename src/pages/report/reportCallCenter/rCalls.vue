<template>
  <main>
    <div class="filter-report">
      <h2>Количество обращений по дням 📞</h2>
      <div>
        <label class="label l_300">Выберите месяц</label>

        <el-date-picker
            type="month"
            v-model="searchFilter.selectedMonth"
            format="YYYY MMM"
            :clearable="false"
        />
      </div>

      <br>
      <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
      <el-button type="info" @click="init()">Сброс</el-button>
    </div>


    <el-table
        class="report-days-table title-place"
        :data="tableData"
        size="small"
        v-if="tableData.length"
        border
        empty-text="Нет данных"
        :row-class-name="tableRowClassName"
        @row-click="rowClick"
        highlight-current-row
    >
      <el-table-column width="180" label="ФИО">
        <template #default="scope">
         <span :class="{parentPartName:scope.row.level===1, partName:scope.row.level===2}">
            {{ scope.row.userFirstName }}
            {{ scope.row.userLastName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
          v-for="(column, index) in tableData[0].phoneAll.eventsAll"
          :key="index"
          :label="''+(index)"
          min-width="32"
      >
        <template #default="scope">
          {{ scope.row.phoneAll.eventsAll[index] ? scope.row.phoneAll.eventsAll[index] : '' }}
        </template>
      </el-table-column>
      <el-table-column label="ВСЕГО" width="60">
        <template #default="scope">
          {{ scope.row.phoneAll.countAll ? scope.row.phoneAll.countAll : '' }}
        </template>
      </el-table-column>

    </el-table>
  </main>
</template>
<style>
.title-place {
  width: 100%;
}

.title-place .partName {
  float: right;
  color: #4682b4;

}

.title-place .parentPartName {
  float: left;
  font-weight: bold;
}


</style>
<script setup>
import {Grid} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useReportStore} from "@/stores/reportStore";
import {ElMessage} from "element-plus";

const searchFilter = ref({selectedMonth: new Date()})

const globalStore = useGlobalStore()
const reportStore = useReportStore()
const tableData = ref([])
const myEmployees = ref([])
const tableRowClassName = ({row}) => {
  let styles = ''
  if (!row.isShow) styles += 'hide-row '
  if (row.level === 2) styles += 'gray-fon '
  if (row.summ) styles += 'blue-text '
  return styles
}

globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)

function rowClick(row) {
  if (row.level === 1) { // по нажатию родителя скрываем/показываем строку
    tableData.value.map(el => {
      if (el.parentNumber === row.number) {
        if (el.isExpanded) {
          el.isExpanded = false
          if (el.level === 2) el.isShow = false
        } else {
          el.isExpanded = true
          if (el.level === 2) el.isShow = true
        }
      }
      return el
    })
  }
}

function init() {
  searchFilter.value.selectedMonth = new Date()
}

init()

function toSearch() {
  let S = searchFilter.value
  let params = {
    year: S.selectedMonth.getFullYear(),
    month: S.selectedMonth.getMonth() + 1
  }
  reportStore.getCalls(params).then(res => {
    if (!res.report.length) ElMessage.warning('Нет данных')

    res.report = [
      {
        "phoneEvents": [
          {
            "closeType": 10,
            "closeTypeTitle": "Не доступен",
            "closeTypeCount": 0,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 0,
              "4": 0,
              "5": 0,
              "6": 0,
              "7": 0,
              "8": 0,
              "9": 0,
              "10": 0,
              "11": 0,
              "12": 0,
              "13": 0,
              "14": 0,
              "15": 0,
              "16": 0,
              "17": 0,
              "18": 0,
              "19": 0,
              "20": 0,
              "21": 0,
              "22": 0,
              "23": 0,
              "24": 0,
              "25": 0,
              "26": 0,
              "27": 0,
              "28": 0,
              "29": 0,
              "30": 0,
              "31": 0
            }
          },
          {
            "closeType": 11,
            "closeTypeTitle": "Не берет трубку",
            "closeTypeCount": 22,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 1,
              "4": 4,
              "5": 0,
              "6": 0,
              "7": 0,
              "8": 2,
              "9": 5,
              "10": 10,
              "11": 0,
              "12": 0,
              "13": 0,
              "14": 0,
              "15": 0,
              "16": 0,
              "17": 0,
              "18": 0,
              "19": 0,
              "20": 0,
              "21": 0,
              "22": 0,
              "23": 0,
              "24": 0,
              "25": 0,
              "26": 0,
              "27": 0,
              "28": 0,
              "29": 0,
              "30": 0,
              "31": 0
            }
          },
          {
            "closeType": 12,
            "closeTypeTitle": "Звонок завершен",
            "closeTypeCount": 23,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 2,
              "4": 4,
              "5": 0,
              "6": 0,
              "7": 0,
              "8": 3,
              "9": 8,
              "10": 6,
              "11": 0,
              "12": 0,
              "13": 0,
              "14": 0,
              "15": 0,
              "16": 0,
              "17": 0,
              "18": 0,
              "19": 0,
              "20": 0,
              "21": 0,
              "22": 0,
              "23": 0,
              "24": 0,
              "25": 0,
              "26": 0,
              "27": 0,
              "28": 0,
              "29": 0,
              "30": 0,
              "31": 0
            }
          }
        ],
        "userLastName": "Абязова",
        "userFirstName": "Халида",
        "phoneAll": {
          "countAll": 45,
          "eventsAll": {
            "1": 0,
            "2": 0,
            "3": 3,
            "4": 8,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 5,
            "9": 13,
            "10": 16,
            "11": 0,
            "12": 0,
            "13": 0,
            "14": 0,
            "15": 0,
            "16": 0,
            "17": 0,
            "18": 0,
            "19": 0,
            "20": 0,
            "21": 0,
            "22": 0,
            "23": 0,
            "24": 0,
            "25": 0,
            "26": 0,
            "27": 0,
            "28": 0,
            "29": 0,
            "30": 0,
            "31": 0
          }
        }
      },
      {
        "phoneEvents": [
          {
            "closeType": 10,
            "closeTypeTitle": "Не доступен",
            "closeTypeCount": 0,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 0,
              "4": 0,
              "5": 0,
              "6": 0,
              "7": 0,
              "8": 0,
              "9": 0,
              "10": 0,
              "11": 0,
              "12": 0,
              "13": 0,
              "14": 0,
              "15": 0,
              "16": 0,
              "17": 0,
              "18": 0,
              "19": 0,
              "20": 0,
              "21": 0,
              "22": 0,
              "23": 0,
              "24": 0,
              "25": 0,
              "26": 0,
              "27": 0,
              "28": 0,
              "29": 0,
              "30": 0,
              "31": 0
            }
          },
          {
            "closeType": 11,
            "closeTypeTitle": "Не берет трубку",
            "closeTypeCount": 54,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 5,
              "4": 0,
              "5": 10,
              "6": 0,
              "7": 0,
              "8": 1,
              "9": 1,
              "10": 1,
              "11": 0,
              "12": 0,
              "13": 0,
              "14": 4,
              "15": 0,
              "16": 0,
              "17": 0,
              "18": 1,
              "19": 1,
              "20": 2,
              "21": 2,
              "22": 2,
              "23": 9,
              "24": 0,
              "25": 0,
              "26": 7,
              "27": 0,
              "28": 3,
              "29": 2,
              "30": 3,
              "31": 0
            }
          },
          {
            "closeType": 12,
            "closeTypeTitle": "Звонок завершен",
            "closeTypeCount": 185,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 2,
              "4": 1,
              "5": 17,
              "6": 0,
              "7": 0,
              "8": 18,
              "9": 7,
              "10": 0,
              "11": 0,
              "12": 17,
              "13": 9,
              "14": 8,
              "15": 14,
              "16": 11,
              "17": 0,
              "18": 0,
              "19": 20,
              "20": 0,
              "21": 0,
              "22": 0,
              "23": 0,
              "24": 0,
              "25": 0,
              "26": 20,
              "27": 11,
              "28": 14,
              "29": 4,
              "30": 12,
              "31": 0
            }
          }
        ],
        "userLastName": "Алиакберов",
        "userFirstName": "Данис",
        "phoneAll": {
          "countAll": 239,
          "eventsAll": {
            "1": 0,
            "2": 0,
            "3": 7,
            "4": 1,
            "5": 27,
            "6": 0,
            "7": 0,
            "8": 19,
            "9": 8,
            "10": 1,
            "11": 0,
            "12": 17,
            "13": 9,
            "14": 12,
            "15": 14,
            "16": 11,
            "17": 0,
            "18": 1,
            "19": 21,
            "20": 2,
            "21": 2,
            "22": 2,
            "23": 9,
            "24": 0,
            "25": 0,
            "26": 27,
            "27": 11,
            "28": 17,
            "29": 6,
            "30": 15,
            "31": 0
          }
        }
      },
      {
        "phoneEvents": [
          {
            "closeType": 10,
            "closeTypeTitle": "Не доступен",
            "closeTypeCount": 24,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 4,
              "4": 0,
              "5": 0,
              "6": 2,
              "7": 1,
              "8": 0,
              "9": 1,
              "10": 2,
              "11": 1,
              "12": 0,
              "13": 0,
              "14": 3,
              "15": 3,
              "16": 3,
              "17": 2,
              "18": 0,
              "19": 0,
              "20": 0,
              "21": 1,
              "22": 1,
              "23": 0,
              "24": 0,
              "25": 0,
              "26": 0,
              "27": 0,
              "28": 0,
              "29": 0,
              "30": 0,
              "31": 0
            }
          },
          {
            "closeType": 11,
            "closeTypeTitle": "Не берет трубку",
            "closeTypeCount": 129,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 5,
              "4": 0,
              "5": 7,
              "6": 10,
              "7": 1,
              "8": 0,
              "9": 5,
              "10": 7,
              "11": 10,
              "12": 0,
              "13": 0,
              "14": 9,
              "15": 13,
              "16": 4,
              "17": 10,
              "18": 9,
              "19": 1,
              "20": 0,
              "21": 7,
              "22": 10,
              "23": 9,
              "24": 8,
              "25": 4,
              "26": 0,
              "27": 0,
              "28": 0,
              "29": 0,
              "30": 0,
              "31": 0
            }
          },
          {
            "closeType": 12,
            "closeTypeTitle": "Звонок завершен",
            "closeTypeCount": 184,
            "eventsInDay": {
              "1": 0,
              "2": 0,
              "3": 16,
              "4": 0,
              "5": 1,
              "6": 11,
              "7": 2,
              "8": 0,
              "9": 13,
              "10": 9,
              "11": 10,
              "12": 0,
              "13": 0,
              "14": 9,
              "15": 11,
              "16": 10,
              "17": 12,
              "18": 9,
              "19": 0,
              "20": 0,
              "21": 16,
              "22": 17,
              "23": 16,
              "24": 16,
              "25": 6,
              "26": 0,
              "27": 0,
              "28": 0,
              "29": 0,
              "30": 0,
              "31": 0
            }
          }
        ],
        "userLastName": "Быкова",
        "userFirstName": "Надежда",
        "phoneAll": {
          "countAll": 337,
          "eventsAll": {
            "1": 0,
            "2": 0,
            "3": 25,
            "4": 0,
            "5": 8,
            "6": 23,
            "7": 4,
            "8": 0,
            "9": 19,
            "10": 18,
            "11": 21,
            "12": 0,
            "13": 0,
            "14": 21,
            "15": 27,
            "16": 17,
            "17": 24,
            "18": 18,
            "19": 1,
            "20": 0,
            "21": 24,
            "22": 28,
            "23": 25,
            "24": 24,
            "25": 10,
            "26": 0,
            "27": 0,
            "28": 0,
            "29": 0,
            "30": 0,
            "31": 0
          }
        }
      }]

    normalizeTableData(res.report)
  })

}

function normalizeTableData(report) {
  tableData.value = []
  let summCallsByDays = []

  report.forEach((el, ind) => {
    tableData.value.push({
      userLastName: el.userLastName,
      userFirstName: el.userFirstName,
      phoneAll: el.phoneAll,
      isExpanded: false,
      isShow: true,
      level: 1,
      number: ind
    })
    if (el.phoneEvents) {
      el.phoneEvents.forEach(item => {
        tableData.value.push({
          userLastName: item.closeTypeTitle,
          phoneAll: {
            eventsAll: item.eventsInDay,
            countAll: item.closeTypeCount
          },
          isExpanded: false,
          isShow: false,
          level: 2,
          parentNumber: ind
        })
      })


    }
  })

  let sum = getSummCallsByDays(report)

  tableData.value.push(sum)

  console.log(' sum', sum)
  console.log(' tableData.value', tableData.value)
// window.DDD  =report
}

function getSummCallsByDays(report) {
  let daySum = {phoneAll: {countAll: 0, eventsAll: {}}, userLastName: 'Итого', isShow: true, summ: true};
  report.forEach(item => {
    Object.entries(item.phoneAll.eventsAll).forEach(z => {
      if (daySum.phoneAll.eventsAll[z[0]] === undefined) daySum.phoneAll.eventsAll['' + z[0]] = z[1]
      else daySum.phoneAll.eventsAll[z[0]] += z[1]
      daySum.phoneAll.countAll += z[1]
    })
  })

  return daySum
}


</script>
