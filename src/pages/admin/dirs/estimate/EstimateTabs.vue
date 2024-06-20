<template>
  <el-tabs @tab-click="tabchange" v-model="activeName">
    <el-tab-pane label="Категория наценки" name="first">
      <EstimateCategory/>
    </el-tab-pane>
    <el-tab-pane label="Матрица наценки">
      <EstimateMatrix ref="matrixRef"/>
    </el-tab-pane>
    <el-tab-pane label="История" >
      <EstimateHistory ref="historyRef"/>
    </el-tab-pane>
    <el-tab-pane label="Норма оборачиваемости">
      <EstimateTurnoverRate ref="turnoverRateRef"/>
    </el-tab-pane>


  </el-tabs>
</template>
<script setup lang="ts">
import EstimateCategory from "@/pages/admin/dirs/estimate/EstimateCategory.vue"
import EstimateMatrix from "@/pages/admin/dirs/estimate/EstimateMatrix.vue"
import EstimateHistory from "@/pages/admin/dirs/estimate/EstimateHistory.vue"
import EstimateTurnoverRate from "@/pages/admin/dirs/estimate/EstimateTurnoverRate.vue"
import {ref} from "vue";

const activeName = ref('first')
const matrixRef = ref(null);
const historyRef = ref(null);
const turnoverRateRef = ref(null);
function tabchange(val: any) {
  if (val.props.label === 'Матрица наценки') matrixRef.value.open()
  else if (val.props.label === 'История') historyRef.value.open()
  else if (val.props.label === 'Норма оборачиваемости') turnoverRateRef.value.open()
}
</script>