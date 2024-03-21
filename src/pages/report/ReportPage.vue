<template>
  <main>
    <el-tabs @tab-click="tabchange" style="margin:0 12px" v-model="activeName">
      <el-tab-pane label="Колл-центр" name="callCenter">
        <ReportCallCenter ref="callCenter"/>
      </el-tab-pane>
      <el-tab-pane label="Колл-центр" name="another1111">
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


function tabchange(a, b) {
  if (a.props.name == 'callCenter') callCenter.value.open()
}

onMounted(() => {
  globalStore.setTitle('Отчеты')
  globalStore.steps = []
})

</script>