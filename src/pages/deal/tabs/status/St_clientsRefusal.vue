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
                type="number"
                @input="()=>{mod.price=parseInt(mod.price)}"
                style="width: 180px;"
                v-model="mod.price"
                placeholder="Введите цену">
           </el-input>

            <label class="label l_150">Комментарий</label>
            <el-input
                type="textarea"
                style="width: 192px;"
                v-model="mod.comment">
           </el-input>

          <el-divider/>

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
import {ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {useGlobalStore} from '@/stores/globalStore'
import {useDealStore} from '@/stores/dealStore'
import {ElMessage} from "element-plus";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";

import router from "@/router";

const appealStoreStatus = useAppealStoreStatus()
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
  if (!mod.value.price) return ElMessage.error('Поле "Цена клиента" обязателен для заполнения')
  let params = {
    id: mod.value.dealId,
    price: mod.value.price
  }

  useDealStore().clientRefusal(params)
  appealStoreStatus.setStatus({comment: mod.value.comment, id: mod.value.dealId, newStatus: 75}).then(res => {
    if (res.status === 200) router.push(`/deal`)
  })
}


defineExpose({open})


</script>