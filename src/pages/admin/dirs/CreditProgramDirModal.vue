<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Кредитная программа'"
              draggable>
      <el-scrollbar maxHeight="480px">
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
          <el-form-item prop="creditPercent" :rules="{required: true, message: 'Процентная ставка', trigger: ['change']}">
              <label class="label-right l_100">Процентная ставка</label>
              <el-input
                  style="width: 190px"
                  v-model="model.creditPercent"
                  clearable
                  placeholder="Процентная ставка">
             </el-input>
          </el-form-item>
          <el-form-item prop="bankItem.bank.bankId" :rules="{required: true, message: 'Банк партнер', trigger: ['change']}">
           <label class="label-right l_100">Банк партнер</label>
           <el-select
            v-model="model.bankItem.bank.bankId"
            style="width: 190px"
            @change="changeBank"
            clearable
          >
            <el-option
              v-for="item in banks"
              :key="item.bankId"
              :label="item.name"
              :value="item.bankId"
            />
          </el-select> 
        </el-form-item> 
        <el-form-item prop="bankItem.bankId" :rules="{required: true, message: 'Филиал', trigger: ['change']}">
           <label class="label-right l_100">Филиал</label>
           <el-select

            v-model="model.bankItem.bankItemId"
            style="width: 190px"
            @change="changeFilial"
          >
            <el-option
              v-for="item in filials"
              :key="item.bankItemId"
              :label="item.name"
              :value="item.bankItemId"
            />
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
  
  <script setup>
  import AppModal from "@/components/AppModal.vue";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  import {checkEmptyFields} from "@/utils/globalFunctions";
  const isOpen = ref(false);
  const model = ref({});
  const banks = ref([])
  const filials = ref([])
  const form = ref(null)
  const closeModal = () => isOpen.value = false;
  const adminStore = useAdminStore();
  let cb;
  
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;

    if(!row)model.value.bankItem = {bank:{bankName:null,bankId:null}}
    else{
        model.value = JSON.parse(JSON.stringify(row))

        changeBank(model.value.bankItem.bankId)
        
    }
    adminStore.getBanks().then(res => {
        banks.value = res.items
    })

  }

  function changeBank(id){

    if(id){
        adminStore.getBankFilials2(id).then(res => {
        filials.value = res.items
    })
    }
  }

  function changeFilial(){
    model.value.bankItem = filials.value.find(el => el.bankItemId == model.value.bankItem.bankItemId)
    model.value.bankItemId = model.value.bankItem.bankItemId
  }

  function save() {
    checkEmptyFields(form.value).then(res => {
      res && adminStore.saveCreditProgram(model.value, 20).then(() => {
      ElMessage({message: "Запись успешно сохранена", type: "success"});
      isOpen.value = false;
      cb();
    });
    }) 
  
  }
  
  defineExpose({open});
  </script>