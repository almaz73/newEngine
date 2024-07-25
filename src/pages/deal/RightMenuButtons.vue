<template>
  <div class="rightMenu">
    <PrintDocumentsCtrl />

    <el-button type="info">
      Подобные автомобили
    </el-button>
    <el-button type="info">
      Необходимые документы
    </el-button>


  </div>
</template>

<style scoped>
.rightMenu {
  max-width: 730px;
  align-content: center;
}

.rightMenu button, .rightMenu div {
  margin-bottom: 1px;
  margin-left: 10px;
}

</style>

<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'
import PrintDocumentsCtrl from '@/controls/PrintDocumentsCtrl.vue'

const dealStore = useDealStore()
</script>