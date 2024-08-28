<template>
  <div class="insp-list-inner">
    <p>Запланированные работы</p>
    <span style=" flex-grow: 1"></span>
    <el-button v-if="plannedWorkLength" @click="showWorks=!showWorks">Итого {{ plannedWorkTotalSum }} руб.</el-button>
    <el-button v-if="oldPlainWorks.length" @click="showHistory=!showHistory">История изменений ( {{ plannedWorkLength }} )</el-button>
    <el-button @click="emits('goInspection', 100)">
      <EditPensilCtrl />
    </el-button>
  </div>

  <PlannedWorkInfo ref="plannedWorkInfo" :showWorks="showWorks" :showHistory="showHistory"/>
</template>
<script setup lang="ts">


import { ref } from 'vue'
import { useDealStore } from '@/stores/dealStore'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import PlannedWorkInfo from '@/pages/deal/tabs/collapses/inspectionList/PlannedWorkInfo.vue'

const dealStore = useDealStore()
const plannedWorkTotalSum = ref(0)
const plannedWorkLength = ref(0)
const damageItems = ref([])
const showWorks = ref(false)
const showHistory = ref(false)
const plannedWorkInfo = ref(null)
const oldPlainWorks = ref([])

const emits = defineEmits(['goInspection'])

function setPlainWork(data) {
  console.log('setPlainWork = ')
  let totalSum = 0
  data.map(item => {
    if (item.workName === undefined || item.workName === null) item.workName = 'Работа не выбрана'
    if (item.price === undefined || item.price === null) item.price = 0
    if (item.damageType != null && item.damageType !== undefined) {
      item.damageText = getDamageText(item.damageType)
    }
    totalSum += item.price
  })
  plannedWorkTotalSum.value = totalSum
  plannedWorkInfo.value.open(data)
  plannedWorkLength.value = data.length
}


function getDamageText(damageType: string) {
  let text = ''
  let splitted = damageType.split(',')
  if (splitted.length > 0) {
    for (let i = 0; splitted.length > i; i++) {
      let res = damageItems.value.find(item => item.id == splitted[i])
      if (i != splitted.length - 1) text += res.damageName + ' ,'
      else text += res ? res.damageName : ''
    }
  }
  return text
}

function open() {
  dealStore.getPlanedWork(dealStore.deal.inspectionId).then(res => {
    oldPlainWorks.value = res.data.items
  })

  dealStore.getDamages().then(res => {
    damageItems.value = res.data.items

    // запланированные работы
    dealStore.getPlannedWork(dealStore.deal.dealId).then(res => setPlainWork(res.data.items))
  })
}



defineExpose({ open })

</script>