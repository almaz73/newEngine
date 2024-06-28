<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Шаблоны причины'"
              draggable>
      <el-scrollbar maxHeight="480px">
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
            <el-form-item prop="typeTitle" :rules="{required: true, message: 'Тип', trigger: ['change']}">
               <label class="label-right l_100">Тип</label>
               <el-input disabled v-model="model.typeTitle"/>
          </el-form-item>
          <el-form-item prop="subTypeTitle" :rules="{required: false, message: 'Подтип', trigger: ['change']}">
            <label class="label-right l_100">Подтип</label>
            <el-select
                style="width: 190px"
                title="Подтип"
                placeholder="Подтип"
                v-model="model.subTypeTitle"
                filterable
                clearable>
              <el-option v-for="item in Workflows" :key="item.id" :label="item.title"
                         :value="item.id"/>
           </el-select>
        </el-form-item>
        <el-form-item prop="typeTitle" :rules="{required: true, message: 'Причина', trigger: ['change']}">
               <label class="label-right l_100">Причина</label>
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
  </template>
  
  <script setup>
  import AppModal from "@/components/AppModal.vue";
  import {useGlobalStore} from "@/stores/globalStore";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  import {checkEmptyFields} from "@/utils/globalFunctions";
  import {Workflows} from "@/utils/globalConstants"
  const isOpen = ref(false);
  const model = ref({});
  const closeModal = () => isOpen.value = false;
  const form = ref(null)
  const adminStore = useAdminStore();
  let cb;
  

  
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
    model.value = JSON.parse(JSON.stringify(row))
    model.value.typeTitle = "Обращение. Запрос на архивирование"
    model.value.type = 10

  }

  function save() {
    model.value.subType = model.value.subTypeTitle
    checkEmptyFields(form.value).then(res => {
      if(!res) return 

      
  
      adminStore.saveReasonTemplates(model.value).then(() => {
        ElMessage({message: "Категория наценки успешно сохранена", type: "success"});
        isOpen.value = false;
        cb();
      });
    }) 
  
  }
  
  defineExpose({open});
  
  
  </script>