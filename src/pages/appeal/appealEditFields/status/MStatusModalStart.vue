<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
            <label class="label-right l_100">Комментарий</label>
            <el-input
                v-model="mod.comment"
                type="textarea"
                placeholder="Введите комментарий">
           </el-input>

          <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="cb(false); isOpen = false">Отмена</el-button>
        </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import {useGlobalStore} from "@/stores/globalStore";

const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false);
const mod = ref({});
const closeModal = () => isOpen.value = false;
let cb;

function open(val, appealId, cbModal) {
  mod.value = val
  mod.value.appealId = appealId
  cb = cbModal;
  isOpen.value = true;
}

function save() {
  console.log(mod.value)
  let params = {
    comment: mod.value.comment,
    id: mod.value.appealId,
    newStatus: mod.value.id
  }
  useGlobalStore().isWaiting = true
  appealStoreStatus.setStatus(params).then(() => {
    isOpen.value = false
    location.reload()
  })
}


defineExpose({open});


</script>