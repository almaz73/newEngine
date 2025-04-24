<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 480"
            :top="40"
            :title="'Шина'"
            draggable
            resizable>
    <el-scrollbar maxHeight="480px">
      <el-form ref="form" :model="tire" class="error-to-message">
      <div class="modal-fields">
        <el-form-item prop="brand" :rules="{required: false, message: 'Марка', trigger: ['change']}">
        <label class="label l_100">Марка</label>
        <el-input v-model="tire.brand" disabled/>
      </el-form-item>
      <el-form-item prop="model" :rules="{required: true, message: 'Модель', trigger: ['change']}">
           <label class="label l_100">Модель</label>
        <el-input v-model="tire.model"/>
        </el-form-item>
        <br><br>
        <div style="text-align: right">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </div>
      </div>
      </el-form>  
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
import {checkEmptyFields} from "@/utils/globalFunctions";
const globalStore = useGlobalStore();
const isOpen = ref(false);
const tire = ref({});
const closeModal = () => isOpen.value = false;
const form = ref(null)
const modalHistory = ref(null);
const adminStore = useAdminStore();
let cb;


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  if (!row.id) tire.value = {brand: row.name};
  else adminStore.getTire(row.id).then(res => tire.value = res)
}


function save() {
  checkEmptyFields(form.value).then(res => {
    res && adminStore.saveTire(tire.value).then(() => {
      ElMessage({message: "Шина успешно сохранен", type: "success"});
      isOpen.value = false;
      cb();
    });
  }) 
}

defineExpose({open});


</script>