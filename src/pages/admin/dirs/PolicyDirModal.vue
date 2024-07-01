<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Категория наценки'"
              draggable>
      <el-scrollbar maxHeight="480px">
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
            <el-form-item prop="title" :rules="{required: true, message: 'Название', trigger: ['change']}">
                 <label class="label-right l_100">Название</label>
                 <el-input  v-model="model.title" class="input-width"/>
          </el-form-item>
          <el-form-item prop="description" :rules="{required: true, message: 'Описание', trigger: ['change']}">
                 <label class="label-right l_100">Описание</label>
                 <el-input  v-model="model.description" class="input-width"/>
          </el-form-item>
          <el-form-item prop="orgElement.id" :rules="{required: true, message: 'Тип', trigger: ['change']}">
              <label class="label-right l_100">Тип</label>
              <el-select
                  style="width: 190px"
                  placeholder="Тип"
                  v-model="model.typeTitle"
                  filterable
                  clearable>
                <el-option v-for="item in organizations" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>
          </el-form-item>
          <el-form-item prop="department.id" :rules="{required: false, message: 'Раздел', trigger: ['change']}">
              <label class="label-right l_100">Раздел</label>
              <el-select
                  style="width: 190px"
                  title="Раздел"
                  placeholder="Раздел"
                  v-model="model.sectionTitle"
                  filterable
                  clearable>
                <el-option v-for="item in departments" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>
          </el-form-item>
          <el-form-item prop="department.id" :rules="{required: false, message: 'Элемент', trigger: ['change']}">
              <label class="label-right l_100">Элемент</label>
              <el-select
                  style="width: 190px"
                  title="Элемент"
                  placeholder="Элемент"
                  v-model="model.itemTitle"
                  filterable
                  clearable>
                <el-option v-for="item in departments" :key="item.id" :label="item.name"
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
  import {useGlobalStore} from "@/stores/globalStore";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {Plus} from "@element-plus/icons-vue";
  import {ElMessage} from "element-plus";
  import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
  import {checkEmptyFields} from "@/utils/globalFunctions";
  const organizations = ref([])
  const departments = ref([])
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const model = ref({});
  const closeModal = () => isOpen.value = false;
  const form = ref(null)
  const modalHistory = ref(null);
  const adminStore = useAdminStore();
  let cb;
  
  
  function changeOrg(id) {
    adminStore.getDepartmentsWithBuyLocations(id).then(res => departments.value = res)
  }
  
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
  
    // if (row && !row.department) row.department = {id: null}
    // if (!row) model.value = {orgElement: {id: null}, department: {id: null}};
    if (row) model.value = JSON.parse(JSON.stringify(row))

  }


  function save() {
    checkEmptyFields(form.value).then(res => {
      res && adminStore.savePolicy(model.value).then(() => {
        ElMessage({message: "Строка успешно сохранена", type: "success"});
        isOpen.value = false;
        cb();
      });
    }) 
  
  }
  
  defineExpose({open});
  
  
  </script>