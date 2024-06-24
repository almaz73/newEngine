<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="360"
              :top="40"
              :title="'Категория наценки'"
              draggable>
      <div v-if="!isFilialsModal">
          <span class="modal-field">
              <label class="label-right l_100">Название</label>
              <el-input
                  style="width: 190px"
                  v-model="model.name"
                    clearable
                    placeholder="Название">
             </el-input>
              <label class="label-right l_100">Краткое наименование</label>
              <el-input
                  style="width: 190px"
                  v-model="model.shortName"
                    clearable
                    placeholder="Краткое наименование">
             </el-input>
            <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
          </span>
      </div>
      <div v-if="isFilialsModal">
          <span class="modal-field">
              <label class="label-right l_100">Название</label>
              <el-input
                  style="width: 190px"
                  v-model="model.name"
                    clearable
                    placeholder="Название">
             </el-input>
              <label class="label-right l_100">Корр.счет</label>
              <el-input
                  style="width: 190px"
                  v-model="model.correspondentAccount"
                    clearable
                    placeholder="Корреспондентский счет">
             </el-input>
              <label class="label-right l_100">БИК</label>
              <el-input
                  style="width: 190px"
                  v-model="model.bik"
                    clearable
                    placeholder="БИК">
             </el-input>
             <label class="label-right l_100">Адрес</label>

             <el-input
                 style="width: 190px"
                 v-model="model.registrationAddress.fiasAddress.value"
                 placeholder="Адрес">
             </el-input>
            <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
          </span>
      </div>
    </AppModal>
  </template>
  
  <script setup>
  import AppModal from "@/components/AppModal.vue";
  import {useGlobalStore} from "@/stores/globalStore";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";

  const isFilialsModal = ref(false)
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const model = ref({});
  const closeModal = () => isOpen.value = false;
  const adminStore = useAdminStore();
  let cb;
  
  function open(row, cbModal,_isFilialsModal) {
    cb = cbModal;
    isOpen.value = true;
    isFilialsModal.value = _isFilialsModal

    if (!row) model.value = {name:'', shortName:''};
    else model.value = JSON.parse(JSON.stringify(row))
    model.value.address = ''
  }
  function getAddress(){
    adminStore.getAddress(model.value.address).then(res => {
      console.log(res)
    })
  }
  
  function checking() {
    if (!model.value.name) {
      return ElMessage({message: 'Поле "Название" обязетелен для заполнения', type: "warning"});
    }
    if (!model.value.correspondentAccount && isFilialsModal.value) {
      return ElMessage({message: 'Поле "Корреспондентский счет" обязетелен для заполнения', type: "warning"});
    }
    if (!model.value.bik && isFilialsModal.value) {
      return ElMessage({message: 'Поле "Бик" обязетелен для заполнения', type: "warning"});
    }
    console.log(model.value.name,model.value.shortName)
  }
  
  function save() {
    if (checking()) return false;
    // todo на сайте нужно поправить сохранение на сервере
  }
  
  
  defineExpose({open});
  
  
  </script>