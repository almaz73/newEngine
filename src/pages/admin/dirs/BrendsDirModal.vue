<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="globalStore.isMobileView? 330: 480"
              :top="40"
              :title="'Машина'"
              draggable
              resizable>
      <el-scrollbar maxHeight="480px">
  
        <span class="modal-fields">
          <span>
            <el-input placeholder="Марка *" title="Марка" v-model="car.brend"/>
            <br>
            <el-input placeholder="Модель *" title="Модель" v-model="car.model"/>
            <br>
            <el-select
                title="Тип"
                placeholder="Выберите значение"
                v-model="car.type"
                filterable
                clearable>
                <el-option v-for="item in autoTypeList" :key="item.id" :label="item.name"
                           :value="item.code"/>
             </el-select>
          </span>
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
  import {inspectionItemCategories, inspectionUiType, autoTypeList} from "@/utils/globalConstants";
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const car = ref({});
  const closeModal = () => isOpen.value = false;
  
  const modalHistory = ref(null);
  const adminStore = useAdminStore();
  let cb;
  const damages = ref([])
  
  
  function open(row, cbModal) {
    console.log(row,cbModal)
    cb = cbModal;
    isOpen.value = true;
    if (!row) car.value = {};
    else{
      car.value = {model:row.name,brend:row.brend}
    }
    // else adminStore.getInspection(row.id).then(res => insp.value = res);
  
    // adminStore.getDomage().then(res => damages.value = res.items);
  
  }
  
  
  function checking() {
    if (!car.value.brend) {
      return ElMessage({message: 'Поле "Марка" обязателен для заполнения', type: "warning"});
    }
    if (!car.value.model) {
      return ElMessage({message: 'Поле "Модель" обязателен для заполнения', type: "warning"});
    }
    if (!car.value.type) {
      return ElMessage({message: 'Поле "Тип" обязателен для заполнения', type: "warning"});
    }
  }
  
  function save() {
    console.log(car.value)
    if (checking()) return false;
    // adminStore.saveBrands(car.value).then(() => {
    //   ElMessage({message: "Осмотр успешно сохранен", type: "success"});
    //   isOpen.value = false;
    //   cb();
    // });
  }
  
  defineExpose({open});
  
  
  </script>