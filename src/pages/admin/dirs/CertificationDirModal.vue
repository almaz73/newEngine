<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Программы'"
              draggable>
      <el-scrollbar maxHeight="480px">
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
          <el-form-item prop="title" :rules="{required: true, message: 'Название', trigger: ['change']}">
                 <label class="label-right l_100">Название</label>
                 <el-input v-model="model.title"/>
          </el-form-item>
  
          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </span>
      </el-form>
      </el-scrollbar>
    </AppModal>
    <UsersDirModal_History ref="modalHistory"/>
  </template>
  
  <script setup>
  import AppModal from "@/components/AppModal.vue";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
  import {checkEmptyFields} from "@/utils/globalFunctions";
  const isOpen = ref(false);
  const model = ref({});
  const closeModal = () => isOpen.value = false;
  const form = ref(null)
  const modalHistory = ref(null);
  const adminStore = useAdminStore();
  let cb;
  

  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
    model.value = JSON.parse(JSON.stringify(row))
  }
  
  function save() {
    checkEmptyFields(form.value).then(res => {
      res && adminStore.saveCertification(model.value).then(() => {
        ElMessage({message: "Категория наценки успешно сохранена", type: "success"});
        isOpen.value = false;
        cb();
      });
    }) 
  
  }
  
  defineExpose({open});
  
  
  </script>