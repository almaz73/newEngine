<template>

  <main>
    <div class="place-filter">
      <el-button class="active">Все оценки:{{ fastFilter.buy }}</el-button>
      <el-button>По активным:{{ fastFilter.buyByActive }}</el-button>
      <el-button>На продаже:{{ fastFilter.buyOnSale }}</el-button>
      <el-button>Продано:{{ fastFilter.buySoldAuto }}</el-button>
      <el-button>Возврат:{{ fastFilter.returned }}</el-button>
    </div>

    <el-table
        style="margin-top: 24px"
        v-if="!globalStore.isMobileView"
        :data="workflowStore.list"
        ref="singleTableRef"
        highlight-current-row>
      <el-table-column label="Автомобиль">
        <template #default="scope">
          <span style="color:#d34439"> {{ scope.row.brand }} {{ scope.row.model }} {{
              scope.row.yearReleased
            }}<br></span>
          {{ scope.row.vin }}<br>
          <button
              class="deal-car-color"
              disabled
              :style="{'background-color': scope.row.bodyColorCode}"
          ></button>
          &nbsp; Пробег:{{ scope.row.rowmileage }}
        </template>
      </el-table-column>
      <el-table-column label="Менеджер">
        <template #default="scope">
          <b>{{ scope.row.userName }}</b><br>
          {{ scope.row.location }}<br>
          <b>{{ scope.row.locationCity }}</b>
        </template>
      </el-table-column>
      <el-table-column label="Статус">
        <template #default="scope">
          <span style="color:#d34439">{{ scope.row.statusTitle }}</span><br>
          {{ scope.row.dealTypeTitle }}<br>
          {{ formatDate(scope.row.created) }}
        </template>
      </el-table-column>

      <el-table-column prop="" label=""/>
    </el-table>


    <!--    для мобилки таблица-->
    <div class="vertical-table" v-if="globalStore.isMobileView" style="width: 100vw">
      <div v-for="row in workflowStore.list" :key="row.id">
        <div class="head">
          <span class="deal-car-color" :style="{'background-color': row.bodyColorCode}"></span>
          <span>Пробег:{{ row.rowmileage }} </span>
          <span>vin: {{ row.vin }}</span>
        </div>
        <div><small>Авто:</small> {{ row.brand }} {{ row.model }} {{ row.yearReleased }}</div>
        <div><small>Менеджер:</small> {{ row.userName }}</div>
        <div><small>Место: </small> {{ row.locationCity }}/ {{ row.location }}</div>
        <div><small>Статус:</small> {{ row.statusTitle }}</div>
        <div><small>Клиент:</small> {{ row.clientTitle }}</div>
        <div><small>Дата:</small> {{ formatDate(row.created) }}</div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useWorkflowStore} from "@/stores/workflowStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ElTable} from "element-plus";

function formatDate(val) {
  return new Date(val).toLocaleString('ru-Ru', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

const globalStore = useGlobalStore()
const workflowStore = useWorkflowStore()
const fastFilter = reactive({buy: 0, buyByActive: 0, buyOnSale: 0, buySoldAuto: 0, returned: 0})
const params = {
  filter: '{}',
  id: '',
  limit: 10,
  mainFilter: 10,
  offset: 0,
  search: ''
}
const singleTableRef = ref<InstanceType<typeof ElTable>>()
const setCurrent = (row) => {
  console.log('row', row)
  singleTableRef.value!.setCurrentRow(row)
}

workflowStore.getBuyWorkflows(params).then(res => {
  fastFilter.buy = res.buyDealsCount
  fastFilter.buyByActive = res.buyByActiveCount
  fastFilter.buyOnSale = res.buyOnSellAutoCount
  fastFilter.buySoldAuto = res.buySoldAutoCount
  fastFilter.returned = res.buyReturnedAutoCount
})

</script>