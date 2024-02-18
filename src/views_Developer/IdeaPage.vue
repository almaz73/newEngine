<template>
  <div class="idea">
    <i> Временная страница для разработчиков</i>
    <h3 style="">Сборник идей по редизайну сайта</h3>

    <el-tabs v-model="activeName"
             @tab-click="handleClick">

      <el-tab-pane label="Что сделано" name="first">
        <TabDone/>
      </el-tab-pane>
      <el-tab-pane label="Идеи и предложения">
        <TabOffers/>
      </el-tab-pane>
      <el-tab-pane label="Вопросы">
        <TabAsks/>
      </el-tab-pane>


      <el-tab-pane label="Ошибки">
        <TabErrors/>
      </el-tab-pane>

      <el-tab-pane label="Требования">
        <TabRequirements/>
      </el-tab-pane>


      <el-tab-pane label="Идеальный вариант программы">
        <TabIdeal/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style>
.idea {
  padding: 8px;
}
</style>

<script setup lang="ts">

import TabOffers from "@/views_Developer/TabOffers.vue";
import TabIdeal from "@/views_Developer/TabIdeal.vue";
import TabErrors from "@/views_Developer/TabErrors.vue";
import TabAsks from "@/views_Developer/TabAsks.vue";
import TabDone from "@/views_Developer/TabDone.vue";
import TabRequirements from "@/views_Developer/TabRequirements.vue";
import {ref} from "vue";

const activeName = ref('first')

function handleClick() {

}
</script>

