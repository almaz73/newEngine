<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Подпись документов'"
              draggable>
      <el-scrollbar maxHeight="480px">
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
          <el-form-item prop="userId" :rules="{required: true, message: 'Пользователь', trigger: ['change']}">
              <label class="label-right l_100">Пользователь</label>
              <el-select
                  style="width: 190px"
                  title="Пользователь"
                  placeholder="Пользователь"
                  v-model="model.userId"
                  @change="getSign"
                  filterable
                  remote
                  :remote-method="getUser"
                  clearable>
                <el-option v-for="item in usersSelect" :key="item.id" :label="item.value"
                           :value="item.id"/>
             </el-select>
            </el-form-item>
          <el-form-item prop="legalId" :rules="{required: true, message: 'Тип склада', trigger: ['change']}">
              <label class="label-right l_100">Юр. Лицо</label>
              <el-select
                  style="width: 190px"
                  title="Юр. Лицо"
                  placeholder="Юр. Лицо"
                  v-model="model.legalId"
                  filterable
                  clearable>
                <el-option v-for="item in usersSign" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>
            </el-form-item>
          <el-form-item prop="signDocument" :rules="{required: true, message: 'Документ подписи (на основании)', trigger: ['change']}">
                 <label class="label-right l_100">Документ подписи (на основании)</label>
                 <el-input v-model="model.signDocument"/>
          </el-form-item>
          <el-form-item prop="data" :rules="{required: true, message: 'Дата', trigger: ['change']}">
             <label class="label-right l_100">Дата</label>
             <el-date-picker
                 style="width: 160px; overflow-x: hidden;"
                 editable
                 format="DD.MM.YYYY"
                 v-model="model.data"/>
      </el-form-item>
          <el-form-item prop="number" :rules="{required: true, message: 'Номер', trigger: ['change']}">
                 <label class="label-right l_100">Номер</label>
                 <el-input v-model="model.number"/>
          </el-form-item>
          <el-form-item prop="defaultSignText" :rules="{required: true, message: 'За кого подписывает', trigger: ['change']}">
                 <label class="label-right l_100">За кого подписывает</label>
                 <el-input v-model="model.defaultSignText"/>
          </el-form-item>
          <el-checkbox label="Документ по умолчанию" v-model="model.isDefault"/>
          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </span>
      </el-form>
      </el-scrollbar>
    </AppModal>
  </template>
  
  <script setup>
  import AppModal from "@/components/AppModal.vue";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  import {checkEmptyFields, formatDateDDMMYYYY} from "@/utils/globalFunctions";
  const isOpen = ref(false);
  const model = ref({});
  const closeModal = () => isOpen.value = false;
  const form = ref(null)
  const modalHistory = ref(null);
  const adminStore = useAdminStore();
  const usersSelect = ref([])
  const usersSign = ref([])
  let cb;
  

  function open(row, cbModal) {
    cb = cbModal;
    usersSelect.value = []
    usersSign.value = []
    isOpen.value = true;
    if(row){
      adminStore.getSignAuthorityUser(row.id).then(res => {
        model.value = res
        const parts = model.value.data.split('.');
        const formattedDateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
        model.value.data = new Date(Date.parse(formattedDateString));
        usersSelect.value.push({id:model.value.userId,value:model.value.userTitle})
        usersSign.value.push({id:model.value.legalId,name:model.value.legalTitle})
        getUser(model.value.userId)
        getSign()
      })  

    } 
    else model.value = {data:null}
  }
  function getUser(query){
    if(!query || query.length < 3) return false
    adminStore.findUser({search:query}).then(res => {
      usersSelect.value = res.models
    })
  }
  function getSign(){
    adminStore.getAvaliableSignUser(model.value.userId).then(res => {
      usersSign.value = res.models
    })
  }
  function save() {
    checkEmptyFields(form.value).then(res => {
      if(!res) return
      model.value.data = formatDateDDMMYYYY(model.value.data)
      adminStore.saveSignAuthority(model.value).then(() => {
        ElMessage({message: "Категория наценки успешно сохранена", type: "success"});
        isOpen.value = false;
        cb();
      });
    }) 
  
  }
  
  defineExpose({open});
  
  
  </script>