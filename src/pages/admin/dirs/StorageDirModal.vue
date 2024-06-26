<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="340"
              :top="40"
              :title="'Место хранения'"
              draggable>
      <el-scrollbar maxHeight="480px">
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields">
  
          <el-form-item prop="title" :rules="{required: true, message: 'Название', trigger: ['change']}">
              <label class="label-right l_100">Название</label>
              <el-input
                  style="width: 190px"
                  v-model="model.title"
                    clearable
                    placeholder="Название" />
            </el-form-item>
  
            <el-form-item prop="type" :rules="{required: true, message: 'Тип склада', trigger: ['change']}">
              <label class="label-right l_100">Тип склада</label>
              <el-select
                  style="width: 190px"
                  title="Тип склада"
                  placeholder="Тип склада"
                  v-model="model.type"
                  filterable
                  clearable>
                <el-option v-for="item in locationType" :key="item.code" :label="item.name"
                           :value="item.code"/>
             </el-select>
            </el-form-item>
            <el-form-item prop="places" :rules="{required: true, message: 'Количество мест', trigger: ['change']}">
              <label class="label-right l_100">Количество мест</label>
              <el-input
                  style="width: 190px"
                  v-model="model.places"
                    clearable
                    placeholder="Количество мест" />
            </el-form-item>
            <el-form-item prop="region" :rules="{required: true, message: 'Регион', trigger: ['change']}">
              <label class="label-right l_100">Регион</label>
              <el-input
                  style="width: 190px"
                  v-model="model.region"
                    clearable
                    placeholder="Регион" />
            </el-form-item>
            <el-form-item prop="city" :rules="{required: true, message: 'Город', trigger: ['change']}">
              <label class="label-right l_100">Город</label>
              <el-input
                  style="width: 190px"
                  v-model="model.city"
                    clearable
                    placeholder="Город" />
            </el-form-item>
            <el-form-item prop="address" :rules="{required: false, message: 'Адрес', trigger: ['change']}">
              <label class="label-right l_100">Адрес</label>
              <el-input
                  style="width: 190px"
                  v-model="model.address"
                    clearable
                    placeholder="Адрес" />
            </el-form-item>
            <el-form-item prop="latitude" :rules="{required: false, message: 'Широта', trigger: ['change']}">
              <label class="label-right l_100">Широта</label>
              <el-input
                  style="width: 190px"
                  v-model="model.latitude"
                    clearable
                    placeholder="Широта" />
            </el-form-item>
            <el-form-item prop="longitude" :rules="{required: false, message: 'Долгота', trigger: ['change']}">
              <label class="label-right l_100">Долгота</label>
              <el-input
                  style="width: 190px"
                  v-model="model.longitude"
                    clearable
                    placeholder="Долгота" />
            </el-form-item>
            <el-form-item prop="avitoShop" :rules="{required: false, message: 'Авито', trigger: ['change']}">
              <label class="label-right l_100">Авито</label>
              <el-input
                  style="width: 190px"
                  v-model="model.avitoShop"
                    clearable
                    placeholder="Авито" />
            </el-form-item>
            <el-form-item prop="orgelements" :rules="{required: true, message: 'Организация', trigger: ['change']}">
            <label class="label-right l_100">Организация</label>
                <el-select
                    style="width: 190px"
                    v-model="model.orgelements"
                    multiple
                    placeholder="Организация"
                    @change="test"
                    >


                    <el-option
                        v-for="item in org"
                        :key="item.id"
                        :label="item.parentName"
                        :value="item.id"
                    />
                </el-select> 
            </el-form-item>   
            <el-form-item prop="phone" :rules="{required: true, message: 'Контактный телефон', trigger: ['change']}">
              <label class="label-right l_100">Контактный телефон</label>
              <el-input
                  style="width: 190px"
                  v-model="model.phone"
                    clearable
                    placeholder="Контактный телефон"
                    maxlength="11" />
            </el-form-item>
            <el-form-item prop="phone" :rules="{required: true, message: 'Контактный телефон', trigger: ['change']}">
              <label class="label-right l_100">Синхронизация с DNM (Только для KIA)</label>
              <el-checkbox style="width: 190px"></el-checkbox>
            </el-form-item>
            <hr>
            <label class="label-right l_100">Кладовщики</label>
            <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
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
  import {colorTypeList} from "@/utils/globalConstants";
  import {checkEmptyFields} from "@/utils/globalFunctions";
  import {locationType} from "@/utils/globalConstants";
  const org = ref([])
  const departments = ref([])
  const globalStore = useGlobalStore();
  const isOpen = ref(false);
  const model = ref({ })
  const form = ref(null)
  const closeModal = () => isOpen.value = false;

  const adminStore = useAdminStore();
  let cb;
function test(){
    console.log(model.value.orgelements)
}
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
    console.log(row)
    if (!row) model.value = {orgElement:{id:null}, department:{id:null}, rate: null };
    else{
        model.value = JSON.parse(JSON.stringify(row))
    }
    if(!model.value.orgelements)  model.value.orgelements = []
    if(!model.value.storekeepers) model.value.storekeepers = []
    if(!model.value.avitoShop) model.value.avitoShop = ''
    console.log(model.value)
    if (row) model.value.orgelements.push({name:model.value.orgElementName,id:model.value.orgElementId})
    
    adminStore.getAllOrgWithDep().then(res => org.value = res.items)
    console.log(org.value)
    // if (model.value.orgElement.id) changeOrg(model.value.orgElement.id)
  }

  function checkPercentage(category) {
  if (model.value[category] > 100) {
    model.value[category] = 100;
  }
  if (model.value[category] < 0) {
    model.value[category] = 0;
  }
}


  function save() {
    model.value.isActive = true
    checkEmptyFields(form.value).then(res => {
    if(!res) return 

    adminStore.saveLocation(model.value).then(() => {
      ElMessage({message: "Запись  успешно сохранена", type: "success"});
      isOpen.value = false;
      cb();
    });
  }) 


  }

  defineExpose({open});


  </script>