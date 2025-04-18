<template>
  <AppModal v-if="isOpen"
            :subtitle="subtitle"
            :title="'Обращение '+appealStore.currentRow.id+'. '+appealStore.currentRow.appealTitle"
            :top="8"
            :width="globalStore.isMobileView? 330: 1100"
            draggable
            resizable
            @closeModal="closeModal()">
    <el-scrollbar :maxHeight="globalStore.isMobileView?'550px':'800px'">
      <AppealEditFields ref="appealEditFields"/>

      <span class="modal-fields">
        <span>

        <br>
        </span>

        <span style="display: block; text-align: right; margin-right: 30px">
          <el-button type="info" @click="closeModal()">Закрыть</el-button>
        </span>
      </span>
    </el-scrollbar>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import AppealEditFields from "@/pages/appeal/appealEditFields/AppealEditFields.vue";


const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const appealEditFields = ref(null)
const isOpen = ref(false);
let cb;
const subtitle = ref('')
const isEditManagerName = ref(false)

const closeModal = () => {
  isOpen.value = false;
  isEditManagerName.value = false
}


function open(row, cbModal) {
  if (!row) return false
  cb = cbModal;
  isOpen.value = true;

  setTimeout(() => appealEditFields.value.open(row, cbModal))
}


defineExpose({open});

</script>