<template>
  <div>
    <el-tabs @tab-click="tabchange" v-model="activeName">
      <el-tab-pane label="Общая информация" name="first">
        <MainInfo/>
      </el-tab-pane>
      <el-tab-pane label="Листы осмотра" name="second">
        <C_InspectionList ref="c_InspectionList"/>
      </el-tab-pane>
      <el-tab-pane label="Заказ наряды" name="third">
      </el-tab-pane>
      <el-tab-pane label="История" name="fourth">
        <DealHistory ref="dealHistory"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'
import {ref} from 'vue'
import MainInfo from '@/pages/deal/tabs/MainInfo.vue'
import {useGlobalStore} from '@/stores/globalStore'
import DealHistory from '@/pages/deal/tabs/DealHistory.vue'
import C_InspectionList from "@/pages/deal/tabs/collapses/C_InspectionList.vue";
import router from "@/router";


const globalStore = useGlobalStore()
const c_InspectionList = ref(null)
const activeName = ref('first')
const dealStore = useDealStore()
const dealId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
const mod = ref(null)
const dealHistory = ref(null)

function tabchange(val) {
  if (val.props.name === 'fourth') dealHistory.value.open()
  if (val.props.name === 'second') {
    let autoId = dealStore.deal.auto.autoId
    router.push(`/auto/${autoId}/deal/${dealId}/inspection`)
  }
}

dealStore.getDeal(dealId, true).then(res => {
  mod.value = res
  dealStore.deal = res
  init()
})

function init() {
  useGlobalStore().setTitle('')

  globalStore.setTitle('Оценка. ' + (mod.value ? mod.value.typeTitle : ''))
  // globalStore.steps = [{ name: 'Обращение', done: true },
  //   { name: 'Осмотр', done: true }, { name: 'Оценка', done: false }]

  if (mod.value) globalStore.steps = mod.value.workflowsChain
}


</script>