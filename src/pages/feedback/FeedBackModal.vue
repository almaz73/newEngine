<template>
  <AppModal v-if="isOpen"
            :title="'Сообщение'"
            :subtitle="'от '+(messageObj.fio || 'Анонимного пользователя')"
            :top="40"
            :width="globalStore.isMobileView? 360: 730"
            draggable
            resizable
            @closeModal="closeModal()">
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <img :src="messageObj.imgBlob" style="margin: 12px 0; border: 3px solid #999" alt=""/>
      <br>
      {{ messageObj.message }}
    </el-scrollbar>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";

const globalStore = useGlobalStore();
const isOpen = ref(false);
const messageObj = ref(null)
const isEditManagerName = ref(false)

const closeModal = () => {
  isOpen.value = false;
  isEditManagerName.value = false
}

function open(row) {
  messageObj.value = row
  isOpen.value = true;
}

defineExpose({open});
</script>