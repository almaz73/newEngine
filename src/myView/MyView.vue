<template>
  <div class="idea">
    <h3 style="">Идеи веб-программирования, которые помогут бизнесу</h3>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="Общие мысли " name="first">
        <TabCommon/>
      </el-tab-pane>

      <el-tab-pane label="Почему Vue3">
        <TabWhyVue3/>
      </el-tab-pane>

      <el-tab-pane label="Как переходить">
        <TabInterface/>
      </el-tab-pane>
      <el-tab-pane label="Предложения по коду">
        <TabCode/>
      </el-tab-pane>
      <el-tab-pane label="Дополнительные предложения">
        <TabSpeed/>
      </el-tab-pane>

      <el-tab-pane label="Интересно">
        <TabFeature/>
      </el-tab-pane>

      <el-tab-pane label="О целях">
        <TabGoals/>
      </el-tab-pane>

    </el-tabs>


    <RouterLink to="/ideas">Еще Идеи по редизайну</RouterLink>
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
import TabWhyVue3 from "@/myView/TabWhyVue3.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import TabCode from "@/myView/TabCode.vue";
import TabSpeed from "@/myView/TabSpeed.vue";
import TabFeature from "@/myView/TabFeature.vue";
import TabGoals from "@/myView/TabGoals.vue";

const globalStore = useGlobalStore()
const activeName = ref('first')

function handleClick() {

}

globalStore.setTitle('Развитие')
</script>

