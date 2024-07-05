<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="360"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
           <label class="label l_150">Цена клиента</label>
            <el-input
              style="width: 180px;"
              v-model="mod.price"
              placeholder="Введите цену">
           </el-input>

          <el-divider />

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
import { useAppealStoreStatus } from '@/stores/appealStoreStatus'
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'

const appealStoreStatus = useAppealStoreStatus()
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
    id: mod.value.dealId,
    price: mod.value.price
  }

  console.log('params', params)

  useGlobalStore().isWaiting = true
  useDealStore().changePrice(params).then(() => {
    isOpen.value = false
    location.reload()
  })
}


defineExpose({ open })


</script>