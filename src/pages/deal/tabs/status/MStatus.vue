<template>
  <div>
    <div class="label l_200">Этап выкупа</div>
    <el-dropdown>
      <el-button type="primary">
        {{ dealStore.deal.dealStatusTitle }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            @click="makeChoice(item)"
            v-for="(item, ind) in StatusTypes" :key="ind">{{ item.id }} {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <br>
    <St_Inspection ref="st_Inspection" />
    <St_AnalistConfimation ref="st_AnalistConfimation" />
    <St_clientsRefusal ref="st_clientsRefusal" />
    <St_ATrefused ref="st_ATrefused" />
    <MoreInfo ref="moreInfo" />
    <ClientBack ref="clientBack" />
    <SetPrice ref="setPrice" />
    <SetPriceOld ref="setPriceOld"/>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDealStore } from '@/stores/dealStore'
import { DealStatusTable } from '@/utils/globalConstants'
import St_Inspection from '@/pages/deal/tabs/status/St_Inspection.vue'
import St_AnalistConfimation from '@/pages/deal/tabs/status/St_AnalistConfimation.vue'
import St_clientsRefusal from '@/pages/deal/tabs/status/St_clientsRefusal.vue'
import St_ATrefused from '@/pages/deal/tabs/status/St_ATrefused.vue'
import MoreInfo from '@/pages/deal/tabs/status/MoreInfo.vue'
import ClientBack from '@/pages/deal/tabs/status/ClientBack.vue'
import SetPrice from '@/pages/deal/tabs/status/SetPrice.vue'
import SetPriceOld from "@/pages/deal/tabs/status/SetPriceOld.vue";
import {bought} from '@/pages/deal/tabs/status/Bought77'
import { useRoute } from 'vue-router'

const route = useRoute()

const dealStore = useDealStore()

const StatusTypes = ref([])
const availableStatuses = ref([])
const st_Inspection = ref(null)
const st_AnalistConfimation = ref(null)
const st_clientsRefusal = ref(null)
const st_ATrefused = ref(null)
const moreInfo = ref(null)
const clientBack = ref(null)
const setPrice = ref(null)
const setPriceOld = ref(null)

interface Status {
  id: number,
  name: string
}

function makeChoice(status: Status) {
  console.warn('status=', status)


  if (status.id === 20) st_Inspection.value.open(status, dealStore.deal.dealId) //Осмотр
  if (status.id === 23) moreInfo.value.open(status, dealStore.deal.dealId) //Вернуть
  if (status.id === 28) clientBack.value.open(status, dealStore.deal.dealId) //Вернуть
  if (status.id === 30) st_AnalistConfimation.value.open(status, dealStore.deal.dealId) //Подтверждение аналитика'}
  if (status.id === 40) {
    if (dealStore.deal.useUpdatedMarkup) setPrice.value.open(status, dealStore.deal) //Подтверждение аналитика'}
    else setPriceOld.value.open(status, dealStore.deal) //Подтверждение аналитика, старая'}
  }
  if (status.id === 70) st_ATrefused.value.open(status, dealStore.deal.dealId) //Отказ со стороны клиента
  if (status.id === 75) st_clientsRefusal.value.open(status, dealStore.deal.dealId) //Отказ со стороны клиента
  if (status.id === 77) bought(dealStore.deal, route.params) //'Оформить выкуп
  if (status.id === 261) moreInfo.value.open(status, dealStore.deal.dealId) //Вернуть


  if (![20, 23, 28, 30, 40, 75, 70, 77, 261].includes(status.id)) alert('Новое')
}

// Список приходит неупорядоченный, будем выдавать в таком порядке:
let myList = [20, 30, 261, 262, 75, 23, 70, 76, 40, 50, 45, 60, 77, 80, 90, 150, 160,
  170, 175, 180, 185, 28, 25, 101, 102, 103, 104, 105, 106, 107,
  108, 109, 110, 111, 340, 310, 350, 149, 100, 300, 320, 350, 330, 360]

function sortFunction() {

  let newList: [] = []
  myList.forEach(el => {
    let founded = StatusTypes.value.find(item => el === item.id)
    if (founded) newList.push(founded)
  })
  StatusTypes.value = newList
}


onMounted(() => {
  // const dealId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
  const dealId = route.params.appealId

  dealStore.getStatuses(+dealId).then(res => {
    availableStatuses.value = res.items

    res.items.forEach((el: any) => {
      let item = DealStatusTable.find(item => item.id === el.value)

      item && StatusTypes.value.push(item)
    })

    sortFunction()
  })
})

defineExpose({ open })
</script>