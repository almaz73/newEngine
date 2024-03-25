<template>
  <main>
    <h2>Количество обращений по дням</h2>
    <div>
      <label class="label l_300">Выберите год и месяц</label>

      <el-date-picker
          type="month"
          v-model="searchFilter.selectedMonth"
          format="YYYY MMM"
      />
    </div>

    <div>
      <label class="label l_300">Вариант отчета</label>
      <el-select
          style="width: 220px"
          v-model="searchFilter.chosenReportType"
          filterable>
        <el-option v-for="item in reportTypes" :key="item.value" :label="item.title" :value="item.value"/>
      </el-select>
    </div>

    <div>
      <label class="label l_300">Тип сделки</label>
      <el-select
          style="width: 220px"
          v-model="searchFilter.chosenDealType"
          filterable>
        <el-option v-for="item in dealTypes" :key="item.value" :label="item.title" :value="item.value"/>
      </el-select>
    </div>


    <br>
    <el-button :icon="Grid" type="danger" @click="toSearch()">Сформировать</el-button>
    <el-button type="info" @click="init()">Сброс</el-button>


    <el-table
        class="report-days-table"
        :data="tableData"
        size="small"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column width="220">
        <template #default="scope">
          <span style="float: left; max-width: 142px">{{ scope.row.title }}</span>
          <span style="float: right">
            <small>Обращений</small><br>
            <small class="red-text">Осмотров</small>
          </span>
        </template>
      </el-table-column>
      <el-table-column
          v-for="(column, index) in tableData[0].days"
          :key="index"
          :label="''+(index+1)"
          min-width="30"
      >
        <template #default="scope">
          <!--                          <span>{{ scope.row.days[index].appealsCount }}</span>-->
          <div>{{ scope.row.days[index].appealsCount }}</div>
          <div class="red-text">{{ scope.row.days[index].buysCount }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #default="scope">
         {{scope.row.buyTotalCount}}
        </template>
      </el-table-column>

    </el-table>
  </main>
</template>
<style>
.report-days-table {
  margin-top: 24px;
  width: calc(100vw - 130px)
}

@media (width < 500px) {
  .report-days-table {
    width: 100vw
  }
}
</style>
<script setup>
import {Grid} from "@element-plus/icons-vue";
import {computed, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useReportStore} from "@/stores/reportStore";

const searchFilter = ref({selectedMonth: new Date()})

const globalStore = useGlobalStore()
const reportStore = useReportStore()

const tableData = ref([
  {
    "number": 1,
    "title": "Альметьевск",
    "days": [
      {
        "day": 1,
        "appealsCount": 19,
        "buysCount": 7,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 2,
        "appealsCount": 11,
        "buysCount": 5,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 3,
        "appealsCount": 13,
        "buysCount": 6,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 4,
        "appealsCount": 14,
        "buysCount": 3,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 5,
        "appealsCount": 8,
        "buysCount": 4,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 6,
        "appealsCount": 19,
        "buysCount": 4,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 7,
        "appealsCount": 13,
        "buysCount": 5,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 8,
        "appealsCount": 13,
        "buysCount": 4,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 9,
        "appealsCount": 9,
        "buysCount": 8,
        "buyoutsCount": 1,
        "onCommissionCount": 0
      },
      {
        "day": 10,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 11,
        "appealsCount": 19,
        "buysCount": 6,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 12,
        "appealsCount": 9,
        "buysCount": 4,
        "buyoutsCount": 1,
        "onCommissionCount": 0
      },
      {
        "day": 13,
        "appealsCount": 16,
        "buysCount": 4,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 14,
        "appealsCount": 30,
        "buysCount": 6,
        "buyoutsCount": 1,
        "onCommissionCount": 0
      },
      {
        "day": 15,
        "appealsCount": 20,
        "buysCount": 8,
        "buyoutsCount": 1,
        "onCommissionCount": 0
      },
      {
        "day": 16,
        "appealsCount": 2,
        "buysCount": 5,
        "buyoutsCount": 1,
        "onCommissionCount": 0
      },
      {
        "day": 17,
        "appealsCount": 12,
        "buysCount": 2,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 18,
        "appealsCount": 11,
        "buysCount": 6,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 19,
        "appealsCount": 27,
        "buysCount": 11,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 20,
        "appealsCount": 11,
        "buysCount": 6,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 21,
        "appealsCount": 19,
        "buysCount": 5,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 22,
        "appealsCount": 7,
        "buysCount": 5,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 23,
        "appealsCount": 3,
        "buysCount": 6,
        "buyoutsCount": 1,
        "onCommissionCount": 0
      },
      {
        "day": 24,
        "appealsCount": 2,
        "buysCount": 1,
        "buyoutsCount": 1,
        "onCommissionCount": 0
      },
      {
        "day": 25,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 26,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 27,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 28,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 29,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 30,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 31,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      }
    ],
    "parentNumber": 0,
    "level": 1,
    "isShow": true,
    "isExpanded": false,
    "appealTotalCount": 307,
    "buyTotalCount": 121,
    "buyoutTotalCount": 7,
    "onCommissionTotalCount": 0,
    "buyPercentage": 39,
    "buyoutPercentage": 5,
    "onCommissionPercentage": 0
  },
  {
    "number": 1,
    "title": "Габдреева Регина",
    "days": [
      {
        "day": 1,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 2,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 3,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 4,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 5,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 6,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 7,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 8,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 9,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 10,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 11,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 12,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 13,
        "appealsCount": 1,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 14,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 15,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 16,
        "appealsCount": 0,
        "buysCount": 1,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 17,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 18,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 19,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 20,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 21,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 22,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 23,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 24,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 25,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 26,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 27,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 28,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 29,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 30,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      },
      {
        "day": 31,
        "appealsCount": 0,
        "buysCount": 0,
        "buyoutsCount": 0,
        "onCommissionCount": 0
      }
    ],
    "parentNumber": 1,
    "level": 2,
    "isShow": false,
    "isExpanded": false,
    "appealTotalCount": 1,
    "buyTotalCount": 1,
    "buyoutTotalCount": 0,
    "onCommissionTotalCount": 0,
    "buyPercentage": 100,
    "buyoutPercentage": 0,
    "onCommissionPercentage": 0
  }])
const dealTypes = [{title: 'Выкуп (трейд-ин)', value: 10}, {title: 'Комиссия', value: 20}]
const reportTypes = [{title: 'По городам', value: 10}, {title: 'По местам хранения', value: 20}];
const myEmployees = ref([])
const columns = computed(() => { // получить массив дней в месяце
  let days = new Date(searchFilter.value.selectedMonth.getFullYear(),
      searchFilter.value.selectedMonth.getMonth() + 1, 0).getDate()
  return Array.from({length: days}, (_, i) => i + 1)
})

globalStore.getRoles([110, 111]).then(res => myEmployees.value = res.items)

function init() {
  searchFilter.value.selectedMonth = new Date()
  searchFilter.value.chosenReportType = 10
  searchFilter.value.chosenDealType = 10
}

init()

/*tableData.value = [
  {
    "day": 1,
    "appealsCount": 19,
    "buysCount": 7,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 2,
    "appealsCount": 11,
    "buysCount": 5,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 3,
    "appealsCount": 13,
    "buysCount": 6,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 4,
    "appealsCount": 14,
    "buysCount": 3,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 5,
    "appealsCount": 8,
    "buysCount": 4,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 6,
    "appealsCount": 19,
    "buysCount": 4,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 7,
    "appealsCount": 13,
    "buysCount": 5,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 8,
    "appealsCount": 13,
    "buysCount": 4,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 9,
    "appealsCount": 9,
    "buysCount": 8,
    "buyoutsCount": 1,
    "onCommissionCount": 0
  },
  {
    "day": 10,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 11,
    "appealsCount": 19,
    "buysCount": 6,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 12,
    "appealsCount": 9,
    "buysCount": 4,
    "buyoutsCount": 1,
    "onCommissionCount": 0
  },
  {
    "day": 13,
    "appealsCount": 16,
    "buysCount": 4,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 14,
    "appealsCount": 30,
    "buysCount": 6,
    "buyoutsCount": 1,
    "onCommissionCount": 0
  },
  {
    "day": 15,
    "appealsCount": 20,
    "buysCount": 8,
    "buyoutsCount": 1,
    "onCommissionCount": 0
  },
  {
    "day": 16,
    "appealsCount": 2,
    "buysCount": 5,
    "buyoutsCount": 1,
    "onCommissionCount": 0
  },
  {
    "day": 17,
    "appealsCount": 12,
    "buysCount": 2,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 18,
    "appealsCount": 11,
    "buysCount": 6,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 19,
    "appealsCount": 27,
    "buysCount": 11,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 20,
    "appealsCount": 11,
    "buysCount": 6,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 21,
    "appealsCount": 19,
    "buysCount": 5,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 22,
    "appealsCount": 7,
    "buysCount": 5,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 23,
    "appealsCount": 3,
    "buysCount": 6,
    "buyoutsCount": 1,
    "onCommissionCount": 0
  },
  {
    "day": 24,
    "appealsCount": 2,
    "buysCount": 1,
    "buyoutsCount": 1,
    "onCommissionCount": 0
  },
  {
    "day": 25,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 26,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 27,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 28,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 29,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 30,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  },
  {
    "day": 31,
    "appealsCount": 0,
    "buysCount": 0,
    "buyoutsCount": 0,
    "onCommissionCount": 0
  }
]*/


function toSearch() {
  let S = searchFilter.value
  let params = {
    year: S.selectedMonth.getFullYear(),
    month: S.selectedMonth.getMonth() + 1,
    dealType: S.chosenDealType,
    type: S.chosenReportType
  }
  reportStore.getMonthly(params).then(res => tableData.value = res.items)

  console.log('---', tableData.value)
}


</script>
