<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Матрица наценки'"
              draggable>
      <el-scrollbar>
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
  
              <label class="label-right l_100">Организация</label>
              <el-select
                  style="width: 190px"
                  placeholder="Организация"
                  @change="changeOrg"
                  v-model="model.orgElements"
                  filterable
                  multiple
                  clearable>
                <el-option v-for="item in organizations" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>

              <label class="label-right l_100">Отдел</label>
              <el-select
                  style="width: 190px"
                  title="Отдел"
                  placeholder="Отдел"
                  v-model="model.departments"
                  filterable
                  multiple
                  clearable>
                <el-option v-for="item in departments" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>

            <el-form-item prop="categoryA" :rules="{required: true, message: 'A, %', trigger: ['change']}">
             <label class="label-right l_100">A, %</label>
             <el-input type="number" v-model="model.categoryA" class="input-width" min="0" max="100" @input="checkPercentage('categoryA')"/>
            </el-form-item>
            <el-form-item prop="categoryB" :rules="{required: true, message: 'B, %', trigger: ['change']}">
               <label class="label-right l_100">B, %</label>
               <el-input type="number" v-model="model.categoryB" class="input-width" min="0" max="100" @input="checkPercentage('categoryB')"/>
              </el-form-item>
          <el-form-item prop="categoryC" :rules="{required: true, message: 'C, %', trigger: ['change']}">
               <label class="label-right l_100">C, %</label>
               <el-input type="number" v-model="model.categoryC" class="input-width" min="0" max="100" @input="checkPercentage('categoryC')"/>
              </el-form-item>
          <el-form-item prop="categoryD" :rules="{required: true, message: 'D, %', trigger: ['change']}">
               <label class="label-right l_100">D, %</label>
               <el-input type="number" v-model="model.categoryD" class="input-width" min="0" max="100" @input="checkPercentage('categoryD')"/>
              </el-form-item>
          <el-form-item prop="categoryS" :rules="{required: true, message: 'S, %', trigger: ['change']}">
               <label class="label-right l_100">S, %</label>
               <el-input type="number" v-model="model.categoryS" class="input-width" min="0" max="100" @input="checkPercentage('categoryS')"/>
              </el-form-item>
  
          <el-form-item prop="validFrom" :rules="{required: true, message: 'Период действия,  с', trigger: ['change']}">
               <label class="label-right l_100">Период действия,  с</label>
               <el-date-picker
                   style="width: 160px; overflow-x: hidden;"
                   editable
                   format="DD.MM.YYYY"
                   v-model="model.validFrom"/>
          </el-form-item>
  
          <el-form-item prop="validTo" :rules="{required: true, message: 'Период действия,  до', trigger: ['change']}">
               <label class="label-right l_100">Период действия,  до</label>
               <el-date-picker
                   style="width: 160px; overflow-x: hidden;"
                   editable
                   format="DD.MM.YYYY"
                   v-model="model.validTo"/>
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
  import {checkEmptyFields} from "@/utils/globalFunctions";
  const organizations = ref([])
  const departments = ref([])
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const model = ref({});
  const form = ref(null)
  const closeModal = () => isOpen.value = false;
  const adminStore = useAdminStore();
  let cb;
  
  
  function changeOrg(id) {
    adminStore.getBuyLocationsByOrganizations(id).then(res => departments.value = res)
  }
  
  function open(row, cbModal,copy) {
    cb = cbModal;
    isOpen.value = true;

    if (!row) model.value = {orgElements:[], departments:[]};
    else{
        model.value = JSON.parse(JSON.stringify(row))
        if(!row.departments) model.value.departments = [];
    } 
    if (copy) {
    model.value.id = 0
  }

    globalStore.getOrganizations().then(res => organizations.value = res.items)
    if (model.value.orgElements) changeOrg(model.value.orgElements)
  }
  function checkPercentage(category) {
  if (model.value[category] > 100) {
    model.value[category] = 100;
  }
  if (model.value[category] < 0) {
    model.value[category] = 0;
  }
}
  

  function checkingDate() {
    const validFromDate = new Date(model.value.validFrom);
    const validToDate = new Date(model.value.validTo);
    if (validToDate < validFromDate) {
      return ElMessage({message: 'Даты не по возрастанию', type: "warning"});
    }

  }

  function save() {
    checkEmptyFields(form.value).then(res => {
    if(!res) return 
    if(checkingDate()) return

    adminStore.saveMarkupMatrix(model.value).then(() => {
      ElMessage({message: "Категория наценки успешно сохранена", type: "success"});
      isOpen.value = false;
      cb();
    });
  }) 
  }
  
  defineExpose({open});
  
  
  </script>