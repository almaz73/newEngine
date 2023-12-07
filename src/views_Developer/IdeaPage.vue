<template>
  <div>
    <h4 style="">Сборник идей по редизайну сайта</h4>

    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="Вопросы" name="first">
        <TabAsks/>
      </el-tab-pane>

      <el-tab-pane label="Ошибки">
        <TabErrors/>
      </el-tab-pane>

      <el-tab-pane label="Требования">
        <TabRequirements/>
      </el-tab-pane>

      <el-tab-pane label="Идеи и предложения">
        <TabOffers/>
      </el-tab-pane>



      <el-tab-pane label="Идеальный вариант программы">
        <TabIdeal/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>

</style>

<script setup lang="ts">

import TabOffers from "@/views_Developer/TabOffers.vue";
import TabIdeal from "@/views_Developer/TabIdeal.vue";
import TabErrors from "@/views_Developer/TabErrors.vue";
import TabAsks from "@/views_Developer/TabAsks.vue";
import TabRequirements from "@/views_Developer/TabRequirements.vue";

function handleClick(){

}
</script>

