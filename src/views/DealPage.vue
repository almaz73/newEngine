<template>

  <main>
    <el-button class="active">Все оценки:{{ fastFilter.buy }}</el-button>
    <el-button>По активным:{{ fastFilter.buyByActive }}</el-button>
    <el-button>На продаже:{{ fastFilter.buyOnSale }}</el-button>
    <el-button>Продано:{{ fastFilter.buySoldAuto }}</el-button>
    <el-button>Возврат:{{ fastFilter.returned }}</el-button>

    <el-table :data="workflowStore.list" style="width: 100%">
      <el-table-column prop="brand" label="Автомобиль"/>
      <el-table-column prop="userName" label="Менеджер"/>
      <el-table-column prop="statusTitle" label="Статус"/>
    </el-table>
  </main>

</template>
<script setup lang="ts">
import {reactive} from "vue";
import {useWorkflowStore} from "@/stores/workflowStore";

const workflowStore = useWorkflowStore()
const fastFilter = reactive({buy: 0, buyByActive: 0, buyOnSale: 0, buySoldAuto: 0, returned: 0})
const params = {
  filter: '{}',
  id: '',
  limit: 25,
  mainFilter: 10,
  offset: 0,
  search: ''
}
workflowStore.getBuyWorkflows(params).then(res => {
  fastFilter.buy = res.buyDealsCount
  fastFilter.buyByActive = res.buyByActiveCount
  fastFilter.buyOnSale = res.buyOnSellAutoCount
  fastFilter.buySoldAuto = res.buySoldAutoCount
  fastFilter.returned = res.buyReturnedAutoCount
})

</script>