<template>

  <div>
    <div class="insp_time">
      <span v-if="inspection.createDate">{{ formatDMY_hm(inspection.createDate) }}</span>
      <br />
      {{ inspection.createdUserLastName }} {{ inspection.createdUserFistName }}
    </div>

    <div class="insp_time" style="background: #3cac71">
      <span v-if="inspection.lastUpdateDate">{{ formatDMY_hm(inspection.lastUpdateDate) }}</span>
      <br />
      {{ inspection.lastUpdateUserLastName }} {{ inspection.lastUpdateUserFistName }}
    </div>

    <!--    <span ng-if="dealStore.deal.malfunctions" style="font-size: large"><a data-uk-modal="{target:'#damages', center:true}">Возможные неисправнсти</a></span>-->

    <div style="margin-top: 12px">
      <span style="background: #d34338;  padding: 3px 10px; margin-right: 8px"></span> <span>Создан</span>
      <span style="margin-left:60px ;background: #3cac71;  padding: 3px 10px; margin-right: 8px"></span>
      <span>Изменен</span>
    </div>

    <div v-for="item in inspectionItemCategories" :key="item.id"
         class="inspect-blocks">
      <p>{{ item.name }}</p>
      <el-button>
        <EditPensilCtrl />
      </el-button>
    </div>

    <div  class="inspect-blocks" style="display: block">
        <PlannedWork ref="plannedWork"/>
    </div>

  </div>
</template>

<style>
.insp_time {
  border-radius: 5px;
  background: #d34338;
  color: white;
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px
}
</style>

<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'
import { formatDMY_hm } from '@/utils/globalFunctions'
import { inspectionItemCategories } from '@/utils/globalConstants'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import PlannedWork from "@/pages/deal/tabs/collapses/inspectionList/PlannedWork.vue";
import PlannedWorkCase from "@/pages/deal/tabs/collapses/inspectionList/PlannedWorkCase.vue";

const dealStore = useDealStore()
const inspection = ref({})
const plannedWork = ref(null)

function open() {
  dealStore.getInspection(dealStore.deal.inspectionId, false).then(function(data) {
    console.log('data = ',data)

    inspection.value = data
    plannedWork.value.open()
  })


  // dealStore.getStatuses(dealStore.deal.dealId).then(res => {
  //   console.log('r   e   s', res)
  // })


  // dealStore.getInspectionitem(dealStore.deal.inspectionId).then(res => {
  //   console.log('res', res)
  // })
}

defineExpose({ open })

</script>
