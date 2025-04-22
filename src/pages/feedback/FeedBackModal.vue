<template>
  <AppModal v-if="isOpen"
            :title="'Сообщение'"
            :top="40"
            :width="globalStore.isMobileView? 360: 730"
            draggable
            resizable
            @closeModal="closeModal()">
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <el-select
          v-if="globalStore.account.role==='Admin'"
          style="width: 210px"
          placeholder="Выберите статус"
          v-model="feedbackType"
          >
        <el-option v-for="item in feedbackStatusTypes" :key="item.value" :label="item.title"
                   :value="item.value"/>
      </el-select>
      <br>

      <img :src="messageObj.imgBlob" style="margin: 12px 0; border: 3px solid #999" alt=""/>
      <br>
      {{ messageObj && messageObj.message }}
    </el-scrollbar>
  </AppModal>
</template>

<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";

const adminStore = useAdminStore()
const globalStore = useGlobalStore();
const isOpen = ref(false);
const messageObj = ref<any>(null)
const isEditManagerName = ref(false)
const feedbackStatusTypes = ref<any>([])
const feedbackType = ref(null)


const closeModal = () => {
  isOpen.value = false;
  isEditManagerName.value = false
}

function open(row: any) {
  console.log('row = ',row)
  
  messageObj.value = row
  isOpen.value = true;

  feedbackType.value = row.status.value

  adminStore.getFeedbackStatusTypes().then(res => {
    feedbackStatusTypes.value = res
  })
}

defineExpose({open});
</script>