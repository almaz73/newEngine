<template>
  <el-tabs @tab-click="tabchange" v-model="activeName">
    <el-tab-pane label="Категория наценки" name="tab1">
      <EstimateCategory/>
    </el-tab-pane>
    <el-tab-pane label="Матрица наценки" name="tab2">
      <EstimateMatrix />
    </el-tab-pane>
    <el-tab-pane label="История" name="tab3">
      <EstimateHistory />
    </el-tab-pane>
    <el-tab-pane label="Норма оборачиваемости" name="tab4">
    </el-tab-pane>
    

  </el-tabs>
</template>
<script setup lang="ts">
import EstimateCategory from "@/pages/admin/dirs/estimate/EstimateCategory.vue"
import EstimateMatrix from "@/pages/admin/dirs/estimate/EstimateMatrix.vue"
import EstimateHistory from "@/pages/admin/dirs/estimate/EstimateHistory.vue"
import {ref} from "vue";

const activeName = ref('tab1')

function tabchange(val) {
  console.log('val', val)
}
</script>