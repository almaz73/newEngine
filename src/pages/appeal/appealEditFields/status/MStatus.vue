<template>
  <small class="label-right">Статус</small>
  <el-dropdown style="margin-bottom: 4px">
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
  <MStatusModalStart ref="mStatusModalStart"/>
  <MStatusModalArchive ref="mStatusModalArchive"/>
  <MStatusModaComission ref="mStatusModaComission"/>
  <MStatusModaTradeIn ref="mStatusModaTradeIn"/>
  <MStatusModalBuyout ref="mStatusModalBuyout"/>
</template>

<script setup lang="ts">
import {useAppealStore} from "@/stores/appealStore";
import {ref, watchEffect} from "vue";
import {AppealStatusTable} from "@/utils/globalConstants";
import MStatusModalStart from "@/pages/appeal/appealEditFields/status/MStatusModalStart.vue";
import MStatusModalArchive from "@/pages/appeal/appealEditFields/status/MStatusModalArchive.vue";
import MStatusModaComission from "@/pages/appeal/appealEditFields/status/MStatusModaComission.vue";
import MStatusModaTradeIn from "@/pages/appeal/appealEditFields/status/MStatusModaTradeIn.vue";
import MStatusModalBuyout from "@/pages/appeal/appealEditFields/status/MStatusModalBuyout.vue";

const props = defineProps(['appeal'])
const appealStore = useAppealStore()
const AppealStatusTypes = ref([])
const appealAvailableStatuses = ref([])
const oldStatus = ref({})
const mStatusModalStart = ref(null)
const mStatusModalArchive = ref(null)
const mStatusModaComission = ref(null)
const mStatusModaTradeIn = ref(null)
const mStatusModalBuyout = ref(null)

watchEffect(() => {
  props.appeal.id && appealStore.getStatuses(props.appeal.id).then(res => {
    appealAvailableStatuses.value = res.items
    res.items.forEach(el => {
      let item = AppealStatusTable.find(item => item.id === el)
      item && AppealStatusTypes.value.push(item)
    })
    sortFunction()
  })
})

// Список приходит разный, но будем выдавать в едином установленном порядке
function sortFunction() {
  let newList=[]
  let myList = [11, 263, 264, 265, 8, 14, 16, 17, 400, 340, 100, 111, 149, 100, 104, 300, 340, 310, 320, 350, 330, 360]
  myList.forEach(el=>{
    let founded = AppealStatusTypes.value.find(item => el === item.id)
    if (founded) newList.push(founded)
  })
  AppealStatusTypes.value = newList
}

function makeChoice(val) {
  oldStatus.value = {id: props.appeal.status, name: props.appeal.statusTitle}
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.status = val.id
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.statusTitle = val.name

  console.log('val', val)
  if (val.id === 11) mStatusModalStart.value.open(val, props.appeal.id, reset) //'Обращение. В работу'
  if (val.id === 17) mStatusModalArchive.value.open(val, props.appeal, reset) //'Обращение. Запрос архивирования'
  if (val.id === 263) mStatusModaComission.value.open(val, props.appeal, reset) //'Передать на комиссию'
  if (val.id === 265) mStatusModaTradeIn.value.open(val, props.appeal, reset) //'Передать на комиссию'
  if (val.id === 264) mStatusModalBuyout.value.open(val, props.appeal, reset) //'Передать на выкуп'
}

function reset() {
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.status = oldStatus.value.id
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.statusTitle = oldStatus.value.name
}


</script>


