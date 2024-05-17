<template>
  <main>
    <el-tabs @tab-click="tabchange" v-model="activeName">
      <el-tab-pane label="Общие отчеты" name="common">
        <ReportCommon ref="refCommon"/>
      </el-tab-pane>
      <el-tab-pane label="Колл-центр" name="callCenter">
        <ReportCallCenter ref="refCallCenter"/>
      </el-tab-pane>
      <el-tab-pane label="Отдел продаж" name="sell">
        <ReportSell ref="refSell"/>
      </el-tab-pane>
      <el-tab-pane label="Автосеть РФ" name="autoSet">
        <ReportAutoSet ref="refAutoSet"/>
      </el-tab-pane>
    </el-tabs>
  </main>

</template>

<script setup>

import {onMounted, ref} from "vue"
import {useGlobalStore} from "@/stores/globalStore";
import ReportCallCenter from "@/pages/report/reportCallCenter/ReportCallCenter.vue";
import ReportCommon from "@/pages/report/reportCommon/ReportCommon.vue";
import ReportSell from "@/pages/report/reportSell/ReportSell.vue";
import ReportAutoSet from "@/pages/report/reportAutoSet/ReportAutoSet.vue";

const globalStore = useGlobalStore()
const refCallCenter = ref(null)
const refCommon = ref(null)
const refSell = ref(null)
const refAutoSet = ref(null)
const activeName = ref('callCenter')


function tabchange(tab) {
  let tabName = tab.props.name;
  let link = tab.LastReport || {tab: tabName}
  if (tabName === 'callCenter') refCallCenter.value.open(link)
  if (tabName === 'common') refCommon.value.open(link)
  if (tabName === 'sell') refSell.value.open(link)
  if (tabName === 'autoSet') refAutoSet.value.open(link)
}


onMounted(() => {
  globalStore.setTitle('Отчеты')
  globalStore.steps = []
  // узнаю последний выбранный отчет, и отображаю его
  let LastReport = localStorage.getItem('LastReport')

  if (LastReport) {
    LastReport = JSON.parse(LastReport)
    activeName.value = LastReport.tab
    tabchange({props: {name: LastReport.tab}, LastReport})
  } else {
    // Если ничего не выбрано
    activeName.value = 'callCenter'
    refCallCenter.value.open({tab: 'callCenter'})
  }
})

</script>