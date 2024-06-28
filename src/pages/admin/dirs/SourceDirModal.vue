<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Источник'"
              draggable>
      <el-scrollbar maxHeight="480px">
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
          <el-form-item prop="name" :rules="{required: true, message: 'Название', trigger: ['change']}">
               <label class="label-right l_100">Название</label>
               <el-input v-model="model.name"/>
          </el-form-item>
          <el-form-item prop="parentName" :rules="{required: false, message: 'Категория', trigger: ['change']}">
              <label class="label-right l_100">Категория</label>
              <el-select
                  style="width: 190px"
                  title="Категория"
                  placeholder="Категория"
                  v-model="model.parentName"
                  filterable
                  clearable>
                <el-option v-for="item in CommunicationTypes" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>
          </el-form-item>
          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </span>
      </el-form>
      </el-scrollbar>
    </AppModal>
  </template>
  <style>
  </style>
  
  <script setup>
  import AppModal from "@/components/AppModal.vue";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  import {checkEmptyFields} from "@/utils/globalFunctions";
  import {CommunicationTypes} from "@/utils/globalConstants";
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
      res && adminStore.saveTreatment(model.value).then(() => {
        ElMessage({message: "Категория успешно сохранена", type: "success"});
        isOpen.value = false;
        cb();
      });
    }) 
  
  }
  
  defineExpose({open});
  
  
  </script>