<template>
  <main>
    <el-tabs @tab-click="tabchange" v-model="activeName">
      <el-tab-pane label="Общие отчеты" name="common" v-if="permit('reportTabs','reportCommon')">
        <ReportCommon ref="refCommon"/>
      </el-tab-pane>
      <el-tab-pane label="Колл-центр" name="callCenter" v-if="permit('reportTabs','reportCallCenter')">
        <ReportCallCenter ref="refCallCenter"/>
      </el-tab-pane>
      <el-tab-pane label="Отдел аналитики" name="analitic" v-if="permit('reportTabs','reportAnalitic')">
        <ReportAnalitic ref="refAnalitic"/>
      </el-tab-pane>
      <el-tab-pane label="Отдел продаж" name="sell" v-if="permit('reportTabs', 'reportSell')">
        <ReportSell ref="refSell"/>
      </el-tab-pane>
      <el-tab-pane label="Автосеть РФ" name="autoSet" v-if="permit( 'reportTabs', 'reportAutoSet')">
        <ReportAutoSet ref="refAutoSet"/>
      </el-tab-pane>
      <el-tab-pane label="Отдел выкупа" name="bayer" v-if="permit( 'reportTabs', 'reportBayer')">
        <ReportBayer ref="refBayer"/>
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
import ReportAnalitic from "@/pages/report/rAnalitic/ReportAnalitic.vue"
import {permit} from "@/utils/permit";
import ReportBayer from "@/pages/report/rBayer/ReportBayer.vue";


const globalStore = useGlobalStore()
const refCallCenter = ref(null)
const refCommon = ref(null)
const refSell = ref(null)
const refAnalitic = ref(null)
const refAutoSet = ref(null)
const refBayer = ref(null)
const activeName = ref('callCenter')


function tabchange(tab) {
  let tabName = tab.props.name;
  let link = tab.LastReport || {tab: tabName}
  if (tabName === 'callCenter') refCallCenter.value.open(link)
  if (tabName === 'common') refCommon.value.open(link)
  if (tabName === 'sell') refSell.value.open(link)
  if (tabName === 'autoSet') refAutoSet.value.open(link)
  if (tabName === 'analitic') refAnalitic.value.open(link)
  if (tabName === 'bayer') refBayer.value.open(link)
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
  }
})

</script>