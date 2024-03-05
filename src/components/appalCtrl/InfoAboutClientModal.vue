<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 600"
            :top="73"
            :title="'Подробно о клиенте'"
            :subtitle="' Клиент: '+ appeal.leadName "
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <small>
        <span class="label-red"> &nbsp; &nbsp; &nbsp; &nbsp; Шаблон сообщения:</span>

      </small>
      <br>
      <small>
        <span class="label-red">Текст отправляемой смс:</span><br>
      </small>
      <br><br>
      <small>
        <span class="label-red label-right">Дата встречи:</span>

      </small>

      <br>
    </el-scrollbar>
    <div style="text-align: right">
      <el-button type="info" @click="clear()">Отменить</el-button>
    </div>
  </AppModal>
</template>

<script setup>

import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()

const isOpen = ref(false)
const appeal = ref(null)
let cb;



function clear() {

  isOpen.value = false
  cb('moCach')
}




function open(row, cbModal) {
  cb = cbModal
  appeal.value = row
  isOpen.value = true
}

defineExpose({open});

</script>