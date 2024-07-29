<template>
  <div class="rightMenu">
    <PrintDocumentsCtrl />
    <el-button type="info" @click="simularCarsModal.open()">
      Подобные автомобили
    </el-button>
  </div>
  <SimularCarsModal ref="simularCarsModal"/>
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
import SimularCarsModal from "@/components/SimularCarsModal.vue";

const dealStore = useDealStore()
const simularCarsModal = ref(null)
</script>