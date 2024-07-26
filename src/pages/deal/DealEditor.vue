<template>
  <div>
    <el-tabs @tab-click="tabchange" v-model="activeName">
      <el-tab-pane label="Общая информация" name="first">
        <MainInfo/>
      </el-tab-pane>
      <el-tab-pane label="Листы осмотра" name="second">

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

const globalStore = useGlobalStore()
const activeName = ref('first')
const dealStore = useDealStore()
const dealId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
const mod = ref(null)
const dealHistory = ref(null)

function tabchange(val) {

  console.log('val', val)

  if (val.props.name === 'fourth') dealHistory.value.open()
}

dealStore.getDeal(dealId).then(res => {
  mod.value = res
  dealStore.deal = res
  init()
})

function init() {
  useGlobalStore().setTitle('')

  globalStore.setTitle('Оценка. ' + (mod.value?mod.value.typeTitle:''))
  // globalStore.steps = [{ name: 'Обращение', done: true },
  //   { name: 'Осмотр', done: true }, { name: 'Оценка', done: false }]

  globalStore.steps = mod.value.workflowsChain
}


</script>