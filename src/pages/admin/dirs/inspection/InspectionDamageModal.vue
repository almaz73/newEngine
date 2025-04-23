<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="globalStore.isMobileView? 360: 480"
              :top="40"
              :title="'Повреждения'"
              draggable
              resizable>
      <el-scrollbar maxHeight="480px">

        <div class="modal-fields">
           <el-form ref="form" :model="insp" class="error-to-message">
            <el-form-item prop="damageName" :rules="{required: true, message: 'Название повреждения', trigger: ['change']}">
              <label class="label l_200">Название повреждения</label>
              <el-input v-model="insp.damageName"/>
            </el-form-item>
           </el-form>
          <el-divider/>
          <div style="text-align: right">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </div>
        </div>
      </el-scrollbar>
    </AppModal>
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
  import {checkEmptyFields} from "@/utils/globalFunctions";
  
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const closeModal = () => isOpen.value = false;
  const adminStore = useAdminStore();
  const insp = ref({})
  const form = ref(null)
  let cb;
  
  
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
    if (!row) insp.value = {damageName:''}
    else insp.value = JSON.parse(JSON.stringify(row))
  }

  function save() {
    checkEmptyFields(form.value).then(res => { // проверка заполненности обязательных полей
      res && adminStore.saveDamage(insp.value).then(() => {
        ElMessage({message: "Осмотр успешно сохранен", type: "success"});
        isOpen.value = false;
        cb();
      });
    })
  }
  
  defineExpose({open});
  
  
  </script>