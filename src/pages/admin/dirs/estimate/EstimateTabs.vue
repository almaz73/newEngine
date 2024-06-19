<template>
  <el-tabs @tab-click="tabchange" v-model="activeName">
    <el-tab-pane label="Категория наценки" name="first">
      <EstimateCategory/>
    </el-tab-pane>
    <el-tab-pane label="Матрица наценки">
      <EstimateMatrix ref="estimateMatrix"/>
    </el-tab-pane>
    <el-tab-pane label="История">
      <EstimateHistory/>
    </el-tab-pane>
    <el-tab-pane label="Норма оборачиваемости">
    </el-tab-pane>


  </el-tabs>
</template>
<script setup lang="ts">
import EstimateCategory from "@/pages/admin/dirs/estimate/EstimateCategory.vue"
import EstimateMatrix from "@/pages/admin/dirs/estimate/EstimateMatrix.vue"
import EstimateHistory from "@/pages/admin/dirs/estimate/EstimateHistory.vue"
import {ref} from "vue";

const activeName = ref('first')
const estimateMatrix = ref(null)

function tabchange(val) {
  if (val.props.label === 'Матрица наценки') estimateMatrix.value.open()
}
</script>