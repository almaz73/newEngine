<template>
  <AppModal v-if="isOpen"
            :subtitle="subtitle"
            :title="'Обращение '+appealStore.currentRow.id+'. '+appealStore.currentRow.appealTitle"
            :top="0"
            :width="globalStore.isMobileView? 330: 1100"
            draggable
            resizable
            @closeModal="closeModal()">
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'730px'">
      <AppealEditFields ref="appealFields"/>

      <span class="modal-fields">
        <span>

        <br>
        </span>

        <div style="text-align: right">
          <el-button type="info" @click="closeModal()">Закрыть</el-button>
        </div>
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
const appealFields = ref(null)
const isOpen = ref(false);
let cb;
const subtitle = ref('')
const isEditManagerName = ref(false)
const carPhoto = ref(null)

const closeModal = () => {
  isOpen.value = false;
  isEditManagerName.value = false
}


function open(row, cbModal) {
  if (!row) return false
  if (row.smallPhoto) carPhoto.value = row.smallPhoto[0]
  cb = cbModal;
  isOpen.value = true;

  setTimeout(() => appealFields.value.open(row, cbModal))
}


defineExpose({open});

</script>