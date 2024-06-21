<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Категория наценки'"
              draggable>
      <el-scrollbar v-if="!isFilialsModal" maxHeight="480px">
          <span class="modal-field">
            <small>
              <label class="label-right l_100">Название</label>
              <el-input
                  style="width: 190px"
                  v-model="model.name"
                    clearable
                    placeholder="Название">
             </el-input>
            </small>
            <small>
              <label class="label-right l_100">Краткое наименование</label>
              <el-input
                  style="width: 190px"
                  v-model="model.shortName"
                    clearable
                    placeholder="Краткое наименование">
             </el-input>
            </small>
            <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
          </span>
      </el-scrollbar>
      <el-scrollbar v-if="isFilialsModal" maxHeight="480px">
          <span class="modal-field">
            <small>
              <label class="label-right l_100">Название</label>
              <el-input
                  style="width: 190px"
                  v-model="model.name"
                    clearable
                    placeholder="Название">
             </el-input>
            </small>
            <small>
              <label class="label-right l_100">Корреспондентский счет</label>
              <el-input
                  style="width: 190px"
                  v-model="model.correspondentAccount"
                    clearable
                    placeholder="Корреспондентский счет">
             </el-input>
            </small>
            <small>
              <label class="label-right l_100">Бик</label>
              <el-input
                  style="width: 190px"
                  v-model="model.bik"
                    clearable
                    placeholder="Бик">
             </el-input>
            </small>
            <small>
              <label class="label-right l_100">Адрес</label>
              <!-- <el-input
                  style="width: 190px"
                  v-model="model.address.fiasAddress.value"
                    clearable
                    placeholder="Адрес">
             </el-input> -->
              <el-select
              
                v-model="model.address"
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="Адрес"
                style="width: 190px"
                @input="getAddress"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </small>
            <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
          </span>
      </el-scrollbar>
    </AppModal>
  </template>
  <style>
  .input-width {
    width: 100px;
    overflow-x: hidden;
  }
  
  </style>
  
  <script setup>
  import AppModal from "@/components/AppModal.vue";
  import {useGlobalStore} from "@/stores/globalStore";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";

  const organizations = ref([])
  const departments = ref([])
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
    console.log(_isFilialsModal)
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
    if (!model.value.correspondentAccount) {
      return ElMessage({message: 'Поле "Корреспондентский счет" обязетелен для заполнения', type: "warning"});
    }
    if (!model.value.bik) {
      return ElMessage({message: 'Поле "Бик" обязетелен для заполнения', type: "warning"});
    }
    console.log(model.value.name,model.value.shortName)
  }
  
  function save() {
    if (checking()) return false;

  }
  
  
  defineExpose({open});
  
  
  </script>