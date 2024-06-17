<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 480"
            :top="40"
            :title="'Шина'"
            draggable
            resizable>
    <el-scrollbar maxHeight="480px">

      <span class="modal-fields">
        <span>
        <label class="label l_100">Марка</label>
        <el-input v-model="tire.brand" disabled/>
           <label class="label l_100">Модель</label>
        <el-input v-model="tire.model"/>
        </span>
        <br><br>
        <div style="text-align: right">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </div>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
</template>
<style>


</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";

const globalStore = useGlobalStore();
const isOpen = ref(false);
const tire = ref({});
const closeModal = () => isOpen.value = false;

const modalHistory = ref(null);
const adminStore = useAdminStore();
let cb;


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  if (!row.id) tire.value = {brand: row.name};
  else adminStore.getTire(row.id).then(res => tire.value = res)
}


function checking() {
  if (!tire.value.brand) {
    return ElMessage({message: 'Поле "Марка" обязетелен для заполнения', type: "warning"});
  }
  if (!tire.value.model) {
    return ElMessage({message: 'Поле "Модель" обязетелен для заполнения', type: "warning"});
  }
}

function save() {
  if (checking()) return false;
  adminStore.saveTire(tire.value).then(() => {
    ElMessage({message: "Шина успешно сохранена", type: "success"});
    isOpen.value = false;
    cb();
  });
}

defineExpose({open});


</script>