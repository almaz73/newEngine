<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="360"
              :top="40"
              :title="isFilialsModal?'Филиал банка':'Банк'"
              draggable>
      <div v-if="!isFilialsModal">
        <el-form ref="form" :model="model" class="error-to-message">
          <span class="modal-field">
            <el-form-item prop="name" :rules="{required: true, message: 'Название', trigger: ['change']}">
              <label class="label-right l_100">Название</label>
              <el-input
                  style="width: 190px"
                  v-model="model.name"
                    clearable
                    placeholder="Название">
             </el-input>
            </el-form-item>
            <el-form-item prop="ShortName" :rules="{required: false, message: 'Краткое наименование', trigger: ['change']}">
              <label class="label-right l_100">Краткое наименование</label>
              <el-input
                  style="width: 190px"
                  v-model="model.shortName"
                    clearable
                    placeholder="Краткое наименование">
             </el-input>
             </el-form-item>
            <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
          </span>
        </el-form>
      </div>
      <div v-if="isFilialsModal">
        <el-form ref="form" :model="model" class="error-to-message">
          <span class="modal-field">
            <el-form-item prop="name" :rules="{required: true, message: 'Название', trigger: ['change']}">
              <label class="label-right l_100">Название</label>
              <el-input
                  style="width: 190px"
                  v-model="model.name"
                    clearable
                    placeholder="Название">
             </el-input>
            </el-form-item>
            <el-form-item prop="correspondentAccount" :rules="{required: true, message: 'Корреспондентский счет', trigger: ['change']}">
              <label class="label-right l_100">Корр.счет</label>
              <el-input
                  style="width: 190px"
                  v-model="model.correspondentAccount"
                    clearable
                    placeholder="Корреспондентский счет">
             </el-input>
            </el-form-item>
            <el-form-item prop="bik" :rules="{required: true, message: 'БИК', trigger: ['change']}">
              <label class="label-right l_100">БИК</label>
              <el-input
                  style="width: 190px"
                  v-model="model.bik"
                    clearable
                    placeholder="БИК">
             </el-input>
            </el-form-item>
            <el-form-item prop="model.registrationAddress.fiasAddress.value" :rules="{required: false, message: 'Адрес', trigger: ['change']}">
             <label class="label-right l_100">Адрес</label>

             <el-input
                 style="width: 190px"
                 v-model="model.registrationAddress.fiasAddress.value"
                 placeholder="Адрес">
             </el-input>
            </el-form-item>
            <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
          </span>
        </el-form>
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
  import {checkEmptyFields} from "@/utils/globalFunctions";
  const isFilialsModal = ref(false)
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const model = ref({});
  const form = ref(null)
  const closeModal = () => isOpen.value = false;
  const adminStore = useAdminStore();
  let cb;
  
  function open(row, cbModal,_isFilialsModal, activeBankId) {
    cb = cbModal;
    isOpen.value = true;
    isFilialsModal.value = _isFilialsModal

    if (!row){
      if(!isFilialsModal.value) model.value = {name:'', shortName:'',};
      else model.value = {name:'', correspondentAccount:'',bik:'',registrationAddress:{fiasAddress: {value:''}}};
    } 
    else model.value = JSON.parse(JSON.stringify(row))
    model.value.address = ''
    model.value.activeBankId = activeBankId
  }

  
  function save() {
    checkEmptyFields(form.value).then(res => {
      res && console.log('todo на сайте нужно поправить сохранение на сервере')
      if (!res) return false

      if (!isFilialsModal.value) {
        adminStore.saveBank({ name: model.value.name, shortName: model.value.shortName })
      } else {
        let params = {
          address: model.value.registrationAddress,
          bankId: model.value.activeBankId,
          bik: model.value.bik,
          correspondentAccount: model.value.correspondentAccount,
          name: model.value.name
        }
        adminStore.saveBankFilial(params)
      }
  })

  }
  
  
  defineExpose({open});
  
  
  </script>