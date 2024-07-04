<template>
  <div>
    <el-tabs @tab-click="tabchange" v-model="activeName">
      <el-tab-pane label="Общая информация" name="first">
        <MainInfo :mod="mod" />
      </el-tab-pane>
      <el-tab-pane label="Листы осмотра" name="second">
      </el-tab-pane>
      <el-tab-pane label="Заказ наряды" name="third">
      </el-tab-pane>
      <el-tab-pane label="История" name="fourth">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'
import MainInfo from '@/pages/deal/MainInfo.vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
const activeName = ref('first')
const dealStore = useDealStore()
const appealId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
const mod = ref(null)

function tabchange() {
}

dealStore.getDeal(appealId).then(res => {
  mod.value = res
  init()
})

function init() {
  useGlobalStore().setTitle('')

  globalStore.setTitle('Оценка. ' + mod.value.typeTitle)
  // globalStore.steps = [{ name: 'Обращение', done: true },
  //   { name: 'Осмотр', done: true }, { name: 'Оценка', done: false }]

  globalStore.steps = mod.value.workflowsChain
}


</script>