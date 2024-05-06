<template>
  <main>
    <el-tabs @tab-click="tabchange" v-model="activeName">
      <el-tab-pane label="Колл-центр" name="callCenter">
        <ReportCallCenter ref="callCenter"/>
      </el-tab-pane>
      <el-tab-pane label="Another" name="another">
        <ReportCallCenter/>
      </el-tab-pane>
    </el-tabs>
  </main>

</template>

<script setup>

import {onMounted, ref} from "vue"
import {useGlobalStore} from "@/stores/globalStore";
import ReportCallCenter from "@/pages/report/reportCallCenter/ReportCallCenter.vue";

const globalStore = useGlobalStore()
const callCenter = ref(null)
const activeName = ref('callCenter')


function tabchange(tab) {
  let tabName = tab.props.name
  if (tabName === 'callCenter') {
    callCenter.value.open({tab:tabName})
  }
}

onMounted(() => {
  globalStore.setTitle('Отчеты')
  globalStore.steps = []
  // узнаю послдний выбранный отчет, и отображаю его
  let LastReport = localStorage.getItem('LastReport')
  if(LastReport){
    LastReport = JSON.parse(LastReport)
    activeName.value = LastReport.tab
    callCenter.value.open(LastReport)
  }else{
    // Если это колл центр
    activeName.value = 'callCenter'
    callCenter.value.open({tab:'callCenter'})
  }
})

</script>