<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="globalStore.isMobileView? 330: 480"
              :top="40"
              :title="'Элемент осмотра'"
              draggable
              resizable>
      <el-scrollbar maxHeight="480px">
  
        <span class="modal-fields">
          <small>
            <label class="label-right l_150">Провреждения:</label>
            <el-input title="Провреждения" v-model="insp.damageName"/>
          </small>
          <div style="text-align: right">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </div>
        </span>
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
  import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
  import {inspectionItemCategories, inspectionUiType} from "@/utils/globalConstants";
  
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const insp = ref({});
  const closeModal = () => isOpen.value = false;
  const adminStore = useAdminStore();
  let cb;
  
  
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
    if (!row) model.value = {damageName:''};
    else insp.value = JSON.parse(JSON.stringify(row))
  }
  
  
  function checking() {
    if (!insp.value.damageName) {
      return ElMessage({message: 'Поле "Повреждение" обязателен для заполнения', type: "warning"});
    }
  }
  
  function save() {
    if (checking()) return false;
    adminStore.saveDamage(insp.value).then(() => {
      ElMessage({message: "Осмотр успешно сохранен", type: "success"});
      isOpen.value = false;
      cb();
    });
  }
  
  defineExpose({open});
  
  
  </script>