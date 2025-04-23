<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 500"
            :top="40"
            :title="'Модалка'"
            draggable>
    <el-scrollbar>
      <div class="modal-fields">
        <el-form ref="form" :model="entity" class="error-to-message">


            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>

        </el-form>
      </div>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory" />
</template>


<script setup>
import AppModal from '@/components/AppModal.vue'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import UsersDirModal_History from '@/pages/admin/dirs/UsersDirModal_History.vue'
import { useGlobalStore } from '@/stores/globalStore'


let cb
const globalStore = useGlobalStore()
const isOpen = ref(false)
const entity = ref({})
const form = ref(null)
const closeModal = () => isOpen.value = false

function open(cbModal) {
  cb = cbModal
  isOpen.value = true

}

function save() {

}


defineExpose({ open })


</script>