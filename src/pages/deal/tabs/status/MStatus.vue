<template>
  <div>
    <div class="label l_200">Этап выкупа</div>
    <el-dropdown style="margin: -6px 0 6px">
      <el-button type="primary">
        {{ deal.dealStatusTitle }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            @click="makeChoice(item)"
            v-for="(item, ind) in StatusTypes" :key="ind">{{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <br>
    <St_Inspection ref="st_Inspection" />
    <St_AnalistConfimation ref="st_AnalistConfimation" />
    <St_clientsRefusal ref="st_clientsRefusal" />
    <St_ATrefused ref="st_ATrefused" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useDealStore } from '@/stores/dealStore'
import { DealStatusTable } from '@/utils/globalConstants'
import St_Inspection from '@/pages/deal/tabs/status/St_Inspection.vue'
import St_AnalistConfimation from '@/pages/deal/tabs/status/St_AnalistConfimation.vue'
import St_clientsRefusal from '@/pages/deal/tabs/status/St_clientsRefusal.vue'
import St_ATrefused from '@/pages/deal/tabs/status/St_ATrefused.vue'

const dealStore = useDealStore()
const { deal } = defineProps(['deal'])
const StatusTypes = ref([])
const availableStatuses = ref([])
const st_Inspection = ref(null)
const st_AnalistConfimation = ref(null)
const st_clientsRefusal = ref(null)
const st_ATrefused = ref(null)

function makeChoice(status) {
  console.log('status=', status)

  if (status.id === 20) st_Inspection.value.open(status, deal.dealId) //Осмотр
  if (status.id === 30) st_AnalistConfimation.value.open(status, deal.dealId) //Подтверждение аналитика'}
  if (status.id === 75) st_clientsRefusal.value.open(status, deal.dealId) //Отказ со стороны клиента
  if (status.id === 70) st_ATrefused.value.open(status, deal.dealId) //Отказ со стороны клиента
}

watchEffect(() => {
  deal.dealId && dealStore.getStatuses(deal.dealId).then(res => {
    availableStatuses.value = res.items
    res.items.forEach(el => {
      let item = DealStatusTable.find(item => item.id === el)
      item && StatusTypes.value.push(item)
    })
    sortFunction()
  })
})

// Список приходит разный, но будем выдавать в едином установленном порядке
let myList = [20, 30, 261, 262, 75, 23, 70, 76, 40, 50, 45, 60, 77, 80, 90, 150, 160, 170, 175, 180, 185, 28, 40, 25, 101, 102, 103, 104, 105, 106, 107,
  108, 109, 110, 111, 340, 310, 350, 149, 100, 300, 320, 350, 330, 360]

function sortFunction() {
  // доступы и ограничения
  // if (deal.workflowLeadType != 6) deleteNode(8)
  // if (deal.status == 17 && globalStore.account.role === 'CallEmployee') deleteNode(17)

  let newList = []
  myList.forEach(el => {
    let founded = StatusTypes.value.find(item => el === item.id)
    if (founded) newList.push(founded)
  })
  StatusTypes.value = newList
}
</script>