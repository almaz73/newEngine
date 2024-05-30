<template>
  <div class="idea">
    <h3 style="">Идеи веб-программирования, которые помогут бизнесу</h3>

    <el-tabs v-model="activeName" @tab-click="handleClick"  name="first">
      <el-tab-pane label="Общие мысли ">
        <TabCommon/>
      </el-tab-pane>

      <el-tab-pane label="Улучшение интерфейса сайта">
        <TabInterface/>
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

import TabInterface from "@/myView/TabInterface.vue";
import TabCommon from "@/myView/TabCommon.vue";
import {ref} from "vue";

const activeName = ref('first')

function handleClick() {

}
</script>

