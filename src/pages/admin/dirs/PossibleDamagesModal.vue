<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 480"
            :top="40"
            :title="'Возможные неисправности'"
            draggable
            resizable>
    <el-scrollbar maxHeight="480px">

      <span class="modal-fields">
        <el-form ref="form" :model="model" class="error-to-message">
              <label class="label l_150">Тип ТС</label>
               <el-form-item prop="autoType"
                             style="display: inline-block; width: 220px"
                             :rules="{required: true, message: 'Тип ТС', trigger: ['change']}">
                 <el-select
                     @change="autoType()"
                     v-model="model.autoType"
                     filterable
                     clearable>
                  <el-option v-for="item in autoTypes"
                             :key="item.value" :label="item.title" :value="item.value"/>
                  </el-select>
               </el-form-item>


              <label class="label l_150">Марка</label>
              <el-form-item prop="brand['id']"
                            style="display: inline-block; width: 220px"
                          :rules="{required: true, message: 'Марка', trigger: ['change']}">
                 <el-select
                     @change="changeBrand(model.brand.id, true)"
                     v-model="model.brand.id"
                 >
                  <el-option v-for="item in brands"
                             :key="item.id" :label="item.name" :value="item.id"/>
                 </el-select>
              </el-form-item>

              <label class="label l_150">Модель</label>
              <el-form-item prop="model['id']"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Модель', trigger: ['change']}">
                 <el-select
                     @change="getGenerations(model.model.id, true)"
                     v-model="model.model.id"
                     filterable
                     clearable>
                  <el-option v-for="item in models"
                             :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
              </el-form-item>

              <label class="label l_150">Поколение</label>
               <el-select
                   v-model="model.generations"
                   @change="getModifications(model.generations, true)"
                   multiple
                   style="width: 220px; margin-bottom: 10px"
                   filterable
                   clearable>
                <el-option v-for="item in allGenerations"
                           :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>

              <label class="label 150">Модификация</label>
               <el-select
                   v-model="model.modifications"
                   multiple
                   style="width: 220px; margin-bottom: 10px"
                   filterable
                   clearable>
                <el-option v-for="item in allModifications"
                           :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>

              <label class="label l_150">Возможные неисправности</label>
               <el-input type="textarea" v-model="model.description" style="width: 310px"/>
         <br><br>
        </el-form>
        <div style="text-align: right">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </div>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
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

const globalStore = useGlobalStore();
const isOpen = ref(false);
const model = ref({});
const closeModal = () => isOpen.value = false;

const modalHistory = ref(null);
const adminStore = useAdminStore();
let cb;
const damages = ref([])
const autoTypes = ref([])
const brands = ref([])
const models = ref([])
const allGenerations = ref([])
const allModifications = ref([])
const form = ref(null)


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  model.value = {brand: {name: ''}, model: {name: ''}};
  row && adminStore.getMalfunctionsById(row.id).then(res => {
    model.value = res
    changeBrand(res.brand.id)
    getGenerations(res.model.id)
    let ids = res.generations.map(el => el.id)
    getModifications(ids)
  });

  adminStore.getAutoTypes().then(res => autoTypes.value = res.items)
  globalStore.getBrands().then(res => brands.value = res)
  adminStore.getDomage().then(res => damages.value = res.items);
}

function autoType() {
  model.value.brand.id = null
  model.value.model.id = null
  model.value.generations = []
  model.value.modifications = []
}

function changeBrand(id, changed) {
  if (changed) {
    model.value.model.name = ''
    model.value.generations = []
    model.value.modifications = []
  }

  adminStore.getModels(id, model.value.autoType).then(res => {
    models.value = res
  });
}

function getGenerations(id, changed) {
  if (changed) allModifications.value = []
  adminStore.getGenerations(id).then(res => allGenerations.value = res);
}

function getModifications(ids, changed) {
  if (changed) allModifications.value = []
  adminStore.getModifications(ids).then(res => allModifications.value = res)
}


function checking() {
  if (!model.value.autoType) {
    return ElMessage({message: 'Поле "Тип ТС" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.brand.id) {
    return ElMessage({message: 'Поле "Марка" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.model.id) {
    return ElMessage({message: 'Поле "Модель" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.description) {
    return ElMessage({message: 'Поле "Возможные неисправности" обязетелен для заполнения', type: "warning"});
  }
}

function save() {
  checkEmptyFields(form.value).then(noErr => {
    if (!noErr) return false
    let params = Object.assign({}, model.value)
    params.autoType = {id: params.autoType}
    if (params.modifications.length && !params.modifications[0].id) params.modifications = params.modifications.map(el => ({id: el}))
    if (params.generations.length && !params.generations[0].id) params.generations = params.generations.map(el => ({id: el}))
    adminStore.saveMalfunctionsById(params).then(res => {
      if (res) {
        ElMessage({message: "Успешно", type: "success"});
        isOpen.value = false;
        cb();
      }
    });
  })
}

defineExpose({open});


</script>