<template>
    <el-tabs @tab-click="tabchange" v-model="activeName">
      <el-tab-pane label="Осмотр" name="first">
        <InspectionView/>
      </el-tab-pane>
      <el-tab-pane label="Повреждение">
        <InspectionDamage ref="viewRef"/>
      </el-tab-pane>
  
    </el-tabs>
  </template>
  <script setup lang="ts">
  import InspectionView from "@/pages/admin/dirs/inspection/InspectionView.vue"
  import InspectionDamage from "@/pages/admin/dirs/inspection/InspectionDamage.vue"
  import {ref} from "vue";
  
  const activeName = ref('first')
  const viewRef = ref(null);
  function tabchange(val: any) {

    if (val.props.label === 'Повреждение') viewRef.value.open()
  }
  </script>