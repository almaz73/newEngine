<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Категория наценки'"
              draggable>
      <el-scrollbar maxHeight="480px">
  
        <span class="modal-fields">
  
            <small>
              <label class="label-right l_100">Организация</label>
              <el-select
                  style="width: 190px"
                  placeholder="Организация"
                  @change="changeOrg"
                  v-model="model.orgElement.id"
                  filterable
                  clearable>
                <el-option v-for="item in organizations" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>
            </small>
  
            <small>
              <label class="label-right l_100">Отдел</label>
              <el-select
                  style="width: 190px"
                  title="Отдел"
                  placeholder="Отдел"
                  v-model="model.department.id"
                  filterable
                  clearable>
                <el-option v-for="item in departments" :key="item.id" :label="item.name"
                           :value="item.id"/>
             </el-select>
            </small>
            <small>
              <label class="label-right l_100">Название</label>
              <el-select
                  style="width: 190px"
                  title="Название"
                  placeholder="Названия"
                  v-model="model.typeTitle"
                  filterable
                  clearable>
                <el-option v-for="item in turnoverTypeRates" :key="item.value" :label="item.title"
                           :value="item.value"/>
             </el-select>
            </small>
            <small>
                 <label class="label-right l_100">Процент,   %</label>
                 <el-input type="number" v-model="model.rate" class="input-width"/>
            </small>
            <small>
               <label class="label-right l_100">Период действия,  с</label>
               <el-date-picker
                   style="width: 160px; overflow-x: hidden;"
                   editable
                   format="DD.MM.YYYY"
                   v-model="model.validFrom"/>
          </small>
  
          <small>
               <label class="label-right l_100">Период действия,  до</label>
               <el-date-picker
                   style="width: 160px; overflow-x: hidden;"
                   editable
                   format="DD.MM.YYYY"
                   v-model="model.validTo"/>
          </small>
  
          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </span>
      </el-scrollbar>
    </AppModal>
    <UsersDirModal_History ref="modalHistory"/>
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
  import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
  import {colorTypeList} from "@/utils/globalConstants"; 
  const organizations = ref([])
  const departments = ref([])
  const turnoverTypeRates = ref([])
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const model = ref({});
  const closeModal = () => isOpen.value = false;
  
  const modalHistory = ref(null);
  const adminStore = useAdminStore();
  let cb;
  
  
  function changeOrg(id) {
    adminStore.getDepartmentsWithBuyLocations(id).then(res => departments.value = res)
  }
  
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
    if (!row) model.value = {orgElement:{id:null}, department:{id:null}};
    else{
        model.value = JSON.parse(JSON.stringify(row))
        if(!row.department) model.value.department = {id:null};
    } 

    adminStore.getTurnoverTypeRates().then(res =>{
        console.log(res)
        turnoverTypeRates.value = res

    } )
    globalStore.getOrganizations().then(res => organizations.value = res.items)
    if (model.value.orgElement.id) changeOrg(model.value.orgElement.id)
  }
  
  
  function checking() {
    if (!model.value.orgElement) {
      return ElMessage({message: 'Поле "организация" обязетелен для заполнения', type: "warning"});
    }
    if (!model.value.validFrom) {
      return ElMessage({message: 'Поле "Период действаия, с" обязетелен для заполнения', type: "warning"});
    }
    if (!model.value.validTo) {
      return ElMessage({message: 'Поле "Период действаия, до" обязетелен для заполнения', type: "warning"});
    }
  }
  
  function save() {
    model.value.type = model.value.typeTitle
    model.value.isActive = true
    if (checking()) return false;
    adminStore.saveTurnoverRate(model.value).then(() => {
      ElMessage({message: "Запись успешно сохранена", type: "success"});
      isOpen.value = false;
      cb();
    });
  }
  
  defineExpose({open});
  
  
  </script>