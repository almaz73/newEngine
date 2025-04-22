<template>
  <AppModal v-if="isOpen"
            :title="'Сообщение'"
            :top="40"
            :width="globalStore.isMobileView? 360: 730"
            draggable
            resizable
            @closeModal="closeModal()">
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">


      <br>
      <img v-if="mod.imgBlob!=='null'" :src="mod.imgBlob" style="margin: 12px 0; border: 3px solid #999" alt=""/>
      <br>
      {{ mod && mod.message }}

      <br> <br>
      <details v-if="globalStore.account.role==='Admin'">
        <hr>
        <summary><small>Администрирование сообщения</small></summary>
        <label class="label"> Статус</label>
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

        <label class="label">Комментарий</label>
        <el-input
            v-model="mod.comment"
            type="textarea"
            placeholder="Введите комментарий от администратора">
        </el-input>
        <br><br>
        <el-button @click="save()" type="success" style="float: right">Сохранить</el-button>
      </details>
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
const mod = ref<any>({comment: ''})
const isEditManagerName = ref(false)
const feedbackStatusTypes = ref<any>([])
const feedbackType = ref(null)
let cb: any

const closeModal = () => {
  isOpen.value = false;
  isEditManagerName.value = false
}

function open(row: any, cbModal: any) {
  cb = cbModal
  mod.value = row
  isOpen.value = true;
  feedbackType.value = row.status.value

  adminStore.getFeedbackStatusTypes().then(res => {
    feedbackStatusTypes.value = res
  })
}

function save() {
  let params = {
    content: mod.value.message + ':::' + mod.value.imgBlob + (mod.value.comment ? (':::' + mod.value.comment) : ''),
    id: mod.value.id,
    status: feedbackType.value
  }
  adminStore.postFeedback(params).then(() => {
    isOpen.value = false;
    cb && cb()
  })
}

defineExpose({open});
</script>