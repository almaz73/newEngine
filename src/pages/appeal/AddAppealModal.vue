<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 500"
            :top="40"
            :title="'Обращения'"
            draggable>
    <el-scrollbar>

      <span class="modal-fields">
        <el-form ref="form" :model="model" @change="isDirty=true">
          <el-button-group style="vertical-align: center">
            <template v-for="flow in Workflows" :key="flow.value">
            <el-button v-if="flow.value<11"
                       @click.stop="changeType(flow)"
                       :type="flow.title!==currentButton.title?'success':''">
              {{ flow.title }}
            </el-button>
              </template>
          </el-button-group>
          <br><br>
            <small>
               <label class="label-right l_100">Источник *</label>
              <el-form-item prop="treatmentSourceId" style="display: inline-block"
                            :rules="{required: true, message: '', trigger: ['blur', 'change']}">
              <el-select
                  style="width: 110px; margin-right: 12px"
                  v-model="model.treatmentSourceId"
                  filterable>
                <el-option v-for="item in treatmentSources" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
              </el-form-item>
            </small>

            <small v-if="currentButton.title==='Выкуп'">
               <label class="label-right l_100">Вид выкупа</label>
              <el-form-item prop="BuyCategory" style="display: inline-block"
                            :rules="{required: true, message: '', trigger: ['blur', 'change']}">
                <el-select
                    style="width: 110px; margin-right: 12px"
                    v-model="model.BuyCategory"
                    filterable>
                  <el-option v-for="item in BuyCategoryTypes" :key="item.id" :label="item.title" :value="item.id"/>
                </el-select>
              </el-form-item>
            </small>

             <small>
               <label class="label-right l_100">Ответственный</label>
                 <el-select
                     style="width: 110px; margin-right: 12px"
                     v-model="model.flow"
                     filterable>
                <el-option v-for="item in managers" :key="item.id" :label="item.title" :value="item.id"/>
              </el-select>
            </small>
          <el-divider/>
          Автомобиль<br>
           <small>
                 <label class="label-right l_100">Обьявления</label>
                 <el-input v-model="model.categoryC"/>
            </small><br>
              <small>
               <label class="label-right l_100">Марка</label>
               <el-select style="width: 120px;"></el-select>
            </small>
            <small>
               <label class="label-right l_100">Модель</label>
               <el-select style="width: 120px;"></el-select>
            </small><br>
            <small>
                 <label class="label-right l_100">Год выпуска</label>
               <el-select style="width: 120px;"></el-select>
            </small>

          <el-divider/>

           Клиент<br>
          <small>
               <label class="label-right l_100">Тип клиента</label>
               <el-select style="width: 120px;"></el-select>
            </small>
          <br>
            <small>
               <label class="label-right l_100">Фамилия</label>
               <el-input></el-input>
            </small><br>
            <small>
               <label class="label-right l_100">Имя</label>
               <el-input></el-input>
            </small><br>
          <small>
               <label class="label-right l_100">Отчество</label>
               <el-input></el-input>
            </small><br>

          <small>
               <label class="label-right l_100">Контактный телефон</label>
               <el-input style="width: 100px; overflow: hidden "></el-input>
            </small>

           <small>
               <label class="label-right l_100">Контактная эл.почта</label>
               <el-input style="width: 100px; overflow: hidden "></el-input>
            </small><br>



          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false; resetForm()">Отмена</el-button>
          </span>
        </el-form>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
</template>


<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {Workflows} from "@/utils/globalConstants";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";

const currentButton = ref({title: 'Выкуп', value: 2})
const globalStore = useGlobalStore();
const isOpen = ref(false);
const model = ref({});
const treatmentSources = ref([])
const managers = ref([])
const modalHistory = ref(null);
const adminStore = useAdminStore();
const form = ref(null)
const submitForm = formEl => formEl && formEl.validate(valid => !valid)

const resetForm = formEl => {
  formEl && formEl.resetFields()
  model.value = {}
}

let cb;
const BuyCategoryTypes = ref([
  {id: 10, title: 'Свободный выкуп'},
  {id: 20, title: 'Выездной выкуп'},
  {id: 30, title: 'Регион'},
  {id: 40, title: 'Fleet'},
])

const closeModal = () => isOpen.value = false;

function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;

  globalStore.getTreatmentSources().then(res => {
    treatmentSources.value = res.items
  })
  globalStore.getUsers().then(res => {
    managers.value = res.items
  })
}

function changeType(flow) {
  currentButton.value = flow
}


function checking() {
  if (!model.value.treatmentSourceId) {
    return ElMessage({message: 'Поле "Источник" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.BuyCategory && currentButton.value.title==='Выкуп') {
    return ElMessage({message: 'Поле "Вид выкупа" обязетелен для заполнения', type: "warning"});
  }
  if (!model.value.validTo) {
    return ElMessage({message: 'Поле "Период действаия, до" обязетелен для заполнения', type: "warning"});
  }
}

function save() {
  checking()
  submitForm(form.value).then(res => { // проверка заполненности обязательных полей
    res && adminStore.saveMarkupCategory(model.value).then(() => {
      ElMessage({message: "Категория наценки успешно сохранена", type: "success"});
      isOpen.value = false;
      cb();
    });
  })


}

defineExpose({open});


</script>