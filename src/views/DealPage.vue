<template>

  <main>
    <el-button class="active">Все оценки:{{ fastFilter.buy }}</el-button>
    <el-button>По активным:{{ fastFilter.buyByActive }}</el-button>
    <el-button>На продаже:{{ fastFilter.buyOnSale }}</el-button>
    <el-button>Продано:{{ fastFilter.buySoldAuto }}</el-button>
    <el-button>Возврат:{{ fastFilter.returned }}</el-button>


    <el-table
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
              class="deal-button"
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
  </main>
</template>
<style>
.deal-button {
  border: 1px solid #bdc1c2;
  width: 20px;
  height: 15px;
  background-color: #e6e6e6;
}

.el-table__body-wrapper td, .el-table__body-wrapper th {
//background: #f1f2f4; //border-top: 1px solid #bdc1c2;
}
</style>
<script setup lang="ts">
import {reactive, ref} from "vue";
import {useWorkflowStore} from "@/stores/workflowStore";
import {ElTable} from "element-plus";

function formatDate(val) {
  return new Date(val).toLocaleString('ru-Ru', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

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