<template>
  <small class="label-right">Статус</small>
  <el-dropdown style="margin: -6px 0 6px">
    <el-button type="primary">
      {{ appeal.statusTitle }}
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
            @click="makeChoice(item)"
            v-for="(item, ind) in AppealStatusTypes" :key="ind">{{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <br>
  <StatusStart ref="statusStart"/>
  <StatusArchive ref="statusArchive"/>
  <StatusComission ref="statusComission"/>
  <StatusTradeIn ref="statusTradeIn"/>
  <StatusBuyout ref="statusBuyout"/>
  <StatusToArchive ref="statusToArchive"/>
  <StatusDecor ref="statusDecor"/>
  <CreateTypeSell ref="createTypeSell"/>
</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from '@/stores/dealStore'
import {ref, watchEffect} from 'vue'
import {AppealStatusTable} from "@/utils/globalConstants";
import StatusStart from "@/pages/appeal/appealEditFields/status/StatusStart.vue";
import StatusArchive from "@/pages/appeal/appealEditFields/status/StatusArchive.vue";
import StatusComission from "@/pages/appeal/appealEditFields/status/StatusComission.vue";
import StatusTradeIn from "@/pages/appeal/appealEditFields/status/StatusTradeIn.vue";
import StatusBuyout from "@/pages/appeal/appealEditFields/status/StatusBuyout.vue";
import StatusToArchive from "@/pages/appeal/appealEditFields/status/StatusToArchive.vue";
import StatusDecor from "@/pages/appeal/appealEditFields/status/StatusDecor.vue";
import CreateTypeSell from '@/pages/appeal/appealEditFields/status/CreateTypeSell.vue'

const props = defineProps(['appeal'])
const globalStore = useGlobalStore()
const dealStore = useDealStore()
const AppealStatusTypes = ref([])
const appealAvailableStatuses = ref([])
const statusStart = ref<any>()
const statusArchive = ref<any>()
const statusComission = ref<any>()
const statusTradeIn = ref<any>()
const statusBuyout = ref<any>()
const statusToArchive = ref<any>()
const statusDecor = ref<any>()
const createTypeSell = ref<any>()

watchEffect(() => {
  props.appeal.id && getStatuses(props.appeal.id)
})

function getStatuses(appealId: number) {
  dealStore.getStatuses(appealId).then(res => {
    appealAvailableStatuses.value = res.items
    res.items.forEach((el: any) => {
      let item = AppealStatusTable.find(item => item.id === el.value)
      if (item) AppealStatusTypes.value.push(item)
    })
    sortFunction()
  })
}

// Список приходит разный, но будем выдавать в едином установленном порядке
let myList = [11, 263, 264, 265, 8, 14, 16, 17, 400, 340, 100, 111, 149, 100, 104, 300, 340, 310, 320, 350, 330, 360]
const deleteNode = (val: number) => myList = myList.filter(el => el !== val)

function sortFunction() {
  // доступы и ограничения
  deleteNode(14) // неясно, когда показать  selectedSellInAppeal в старой проге всегда null
  if (props.appeal.workflowLeadType != 6) deleteNode(8)
  if (props.appeal.status == 17 && globalStore.account.role === 'CallEmployee') deleteNode(17)

  let newList: [] = []
  myList.forEach(el => {
    let founded = AppealStatusTypes.value.find(item => el === item.id)
    if (founded && !newList.includes(founded)) newList.push(founded)
  })
  AppealStatusTypes.value = newList
}

function makeChoice(val: any) {
  if (val.id === 11) statusStart.value.open(val, props.appeal.id) //'Обращение. В работу'
  if (val.id === 16) statusToArchive.value.open(val, props.appeal) //'Обращение. Запрос архивирования'
  if (val.id === 17) statusArchive.value.open(val, props.appeal) //'Обращение. Архивировать'
  if (val.id === 263) statusComission.value.open(val, props.appeal) //'Передать на комиссию'
  if (val.id === 264) statusBuyout.value.open(val, props.appeal) //'Передать на выкуп'
  if (val.id === 265) statusTradeIn.value.open(val, props.appeal) //'Передать на комиссию'
  if (val.id === 400) statusDecor.value.open(val, props.appeal) //'Обращение. Оформление'

  if (val.id === 340) {
    console.log('todo нужно проверить')
    createTypeSell.value.open(val, props.appeal)
  } //'Создание обращения с типом "Продажа"' // не смог проверить

  if (![11, 17, 263, 265, 264, 16, 400].includes(val.id)) {
    alert(' новое не проверенное ')
  }
}

</script>


