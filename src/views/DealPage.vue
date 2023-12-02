<template>
  <main>
    <el-button class="active">Все оценки:{{ fastFilter.buy }}</el-button>
    <el-button>По активным:{{ fastFilter.buyByActive }}</el-button>
    <el-button>На продаже:{{ fastFilter.buyOnSale }}</el-button>
    <el-button>Продано:{{ fastFilter.buySoldAuto }}</el-button>
    <el-button>Возврат:{{ fastFilter.returned }}</el-button>
  </main>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useWorkflowStore} from "@/stores/workflowStore";

const workflowStore = useWorkflowStore()

const params = {
  filter: '',
  id: '',
  limit: 25,
  mainFilter: 10,
  offset: 0,
  search: ''
}
workflowStore.getBuyWorkflows(params)
const fastFilter = ref({buy: 1000, buyByActive: 0, buyOnSale: 233, buySoldAuto: 200, returned: 2})
</script>