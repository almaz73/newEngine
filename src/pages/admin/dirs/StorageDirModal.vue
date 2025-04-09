<template>
    <AppModal v-if="isOpen"
              @closeModal="closeModal()"
              :width="globalStore.isMobileView ? '360' : '680'"
              :top="40"
              :title="'Место хранения'"
              draggable
              resizable>
      <el-scrollbar maxHeight="520px">
        <el-form ref="form" :model="model" class="error-to-message">
        <span class="modal-fields modal-fields-2">
          <el-form-item prop="title" :rules="{required: true, message: 'Название', trigger: ['change']}">
              <label class="label-right l_100">Название</label>
              <el-input
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
                  v-model="model.places"
                    clearable
                    placeholder="Количество мест" />
            </el-form-item>
            <el-form-item prop="region" :rules="{required: true, message: 'Регион', trigger: ['change']}">
              <label class="label-right l_100">Регион</label>
              <el-input
                  v-model="model.region"
                    clearable
                    placeholder="Регион" />
            </el-form-item>
            <el-form-item prop="city" :rules="{required: true, message: 'Город', trigger: ['change']}">
              <label class="label-right l_100">Город</label>
              <el-input
                  v-model="model.city"
                    clearable
                    placeholder="Город" />
            </el-form-item>
            <el-form-item prop="address" :rules="{required: false, message: 'Адрес', trigger: ['change']}">
              <label class="label-right l_100">Адрес</label>
              <el-input
                  v-model="model.address"
                    clearable
                    placeholder="Адрес" />
            </el-form-item>
            <el-form-item prop="latitude" :rules="{required: false, message: 'Широта', trigger: ['change']}">
              <label class="label-right l_100">Широта</label>
              <el-input
                  v-model="model.latitude"
                    clearable
                    placeholder="Широта" />
            </el-form-item>
            <el-form-item prop="longitude" :rules="{required: false, message: 'Долгота', trigger: ['change']}">
              <label class="label-right l_100">Долгота</label>
              <el-input
                  v-model="model.longitude"
                    clearable
                    placeholder="Долгота" />
            </el-form-item>
            <el-form-item prop="avitoShop" :rules="{required: false, message: 'Авито', trigger: ['change']}">
              <label class="label-right l_100">Авито</label>
              <el-input
                  v-model="model.avitoShop"
                    clearable
                    placeholder="Авито" />
            </el-form-item>
            <el-form-item prop="orgElementsIds" :rules="{required: true, message: 'Организация', trigger: ['change']}">
            <label class="label-right l_100">Организация</label>
                <el-select
                    style="width: 190px"
                    v-model="model.orgElementsIds"
                    multiple
                    placeholder="Организация"
                    @change="changeArrById"
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
                  v-model="model.phone"
                    clearable
                    placeholder="Контактный телефон"
                    maxlength="11" />
            </el-form-item>
            <el-form-item prop="phone" :rules="{required: true, message: 'Контактный телефон', trigger: ['change']}">
              <label class="label-right l_100">Синхронизация с DNM (Только для KIA)</label>
              <el-checkbox></el-checkbox>
            </el-form-item>
            <span>
            <label class="label-right l_100">Кладовщики</label>
            <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
          </span>
        </span>
        <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
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
  .modal-fields-2{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px; 
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
  import {locationType} from "@/utils/globalConstants";
  const globalStore = useGlobalStore()
  const org = ref([])
  const isOpen = ref(false);
  const model = ref({ })
  const form = ref(null)
  const closeModal = () => isOpen.value = false;

  const adminStore = useAdminStore();
  let cb;
function changeArrById(){
    model.value.orgelements = model.value.orgElementsIds.map(modelId => org.value.find(el => el.id === modelId))
}
  function open(row, cbModal) {
    cb = cbModal;
    isOpen.value = true;
    if(row){
        model.value = JSON.parse(JSON.stringify(row))
        model.value.orgElementsIds = [model.value.orgElementId]
    }
    model.value.orgelements = model.value.orgelements || [];
    model.value.storekeepers = model.value.storekeepers || [];
    model.value.orgElementsIds = model.value.orgElementsIds || [];
    changeArrById()
    adminStore.getAllOrgWithDep().then(res => org.value = res.items)
  }



  function save() {
    model.value.isActive = true
    model.value.typeName = locationType.find(el => el.code === model.value.type)?.name
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