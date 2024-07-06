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
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/AppModal.vue'
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'

const globalStore = useGlobalStore()
const isOpen = ref(false)
const mod = ref({})
const closeModal = () => isOpen.value = false

function open(val, dealId) {
  mod.value = val
  mod.value.dealId = dealId
  isOpen.value = true
}

function save() {
  let params = {
    comment: mod.value.comment,
    buyId: mod.value.dealId,
    newStatus: mod.value.id
  }


  globalStore.isWaiting = true
  useDealStore().setConfirmation(params).then(res => {
    globalStore.isWaiting = false
    isOpen.value = false
    if (res.status === 200) location.reload()
  })
}

defineExpose({ open })

</script>