<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 500"
            :top="40"
            :title="'Обращения'"
            draggable>
    <el-scrollbar>

      <span class="modal-fields">
        <el-form ref="form" :model="newWorkflow">
          <el-button-group style="vertical-align: center">
            <template v-for="flow in workflowTypes" :key="flow.value">
            <el-button v-if="flow.value<11"
                       @click.stop="changeWorkflowType(flow)"
                       :type="flow.title!==currentButton.title?'success':''">
              {{ flow.title }}
            </el-button>
              </template>
          </el-button-group>
          <br><br>
            <small>
               <label class="label-right l_100">Источник *</label>
              <el-form-item prop="treatmentSourceId" style="display: table-cell; width: 220px"
                            :rules="{required: true, message: '', trigger: ['blur', 'change']}">
              <el-select
                  v-model="newWorkflow.treatmentSourceId"
                  filterable>
                <el-option v-for="item in treatmentSources" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
              </el-form-item>
            </small>

            <br>
            <small v-if="currentButton.title==='Выкуп'">
               <label class="label-right l_100">Вид выкупа</label>
              <el-form-item prop="BuyCategory" style="display: table-cell; width: 220px"
                            :rules="{required: true, message: '', trigger: ['blur', 'change']}">
                <el-select
                    v-model="newWorkflow.BuyCategory"
                    filterable>
                  <el-option v-for="item in BuyCategoryTypes" :key="item.id" :label="item.title" :value="item.id"/>
                </el-select>
              </el-form-item>
            </small>
            <br>
             <small>
               <label class="label-right l_100">Ответственный</label>
                 <el-select
                     style="width: 220px"
                     v-model="newWorkflow.managerId"
                     filterable>
                <el-option v-for="item in managers" :key="item.id" :label="item.fullName" :value="item.id"/>
              </el-select>
            </small>
          <hr/>
          Автомобиль<br>
          <small>
                 <label class="label-right l_100">Объявления</label>
                 <el-input v-model="newWorkflow.description"/>
          </small><br>
          <small>
               <label class="label-right l_100">Марка</label>
               <el-form-item prop="carBrand" style="display: table-cell"
                             :rules="{required: true, message: '', trigger: ['blur']}">
                  <el-select
                      style="width: 140px"
                      v-model="newWorkflow.carBrand"
                      @change="changeBrand(newWorkflow.carBrand)"
                      :filterable="!globalStore.isMobileView"
                      clearable
                  >
                    <el-option v-for="brand in brands" :key="brand.id" :label="brand.name" :value="brand.id"/>
                  </el-select>
               </el-form-item>
          </small>
          <small>
            <label class="label-right l_100">Модель</label>
            <el-form-item prop="carModelId" style="display: table-cell"
                          :rules="{required: true, message: '', trigger: ['blur']}">
              <el-select
                  style="width: 110px"
                  v-model="newWorkflow.carModelId"
                  :filterable="!globalStore.isMobileView"
                  placeholder="Модель">
                <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </small>
          <small>
            <label class="label-right l_100">Год выпуска</label>
            <el-form-item prop="carModelId" style="display: table-cell"
                          :rules="{required: true, message: '', trigger: ['blur']}">
                <el-select placeholder="Год выпуска"
                           clearable
                           style="width: 110px"
                           v-model="newWorkflow.yearReleased">
                    <el-option v-for="item in Years" :key="item.name" :label="item.name" :value="item.name"/>
                  </el-select>
            </el-form-item>
          </small>

          <hr/>

          Клиент<br>

          <small>
               <label class="label-right l_100">Тип клиента</label>
                <el-select
                    :disabled="isClientChosen"
                    style="width: 200px"
                    v-model="newWorkflow.lead.leadType"
                    filterable>
              <el-option v-for="item in LeadType" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
            </small>
          <br>
            <small>
               <label class="label-right l_100">Фамилия</label>
               <el-input v-model="newWorkflow.lead.person.lastName" :disabled="isClientChosen"/>
            </small><br>
            <small>
              <label class="label-right l_100">Имя</label>
              <el-form-item prop="lead.person['firstName']" style="display: table-cell"
                            :rules="{required: true, message: '', trigger: ['blur']}">
                 <el-input v-model="newWorkflow.lead.person.firstName" :disabled="isClientChosen"/>
              </el-form-item>
            </small><br>
          <small>
               <label class="label-right l_100">Отчество</label>
               <el-input v-model="newWorkflow.lead.person.middleName" :disabled="isClientChosen"/>
            </small><br>

          <small>
               <label class="label l_200">Контактный телефон *</label>
            
            <el-form-item prop="lead.person['phone']" style="display: table-cell"
                          :rules="{required: true, message: '', trigger: ['blur']}">
               <el-autocomplete
                   v-model="newWorkflow.lead.person.phone"
                   :disabled="isClientChosen"
                   :formatter="(value) =>value && formattingPhone(value, (val)=>newWorkflow.lead.person.phone=val)"
                   :fetch-suggestions="telChanged"
                   :trigger-on-focus="false"
                   @select="handlePhone"
                   clearable
                   placeholder="Введите телефон"
               />
            </el-form-item>


          </small>
          <small>

             <label class="label l_200">Контактная эл.почта</label>
               <el-input placeholder="Email"
                         :disabled="isClientChosen"
                         @change="emailValidate(newWorkflow.lead.person.email)"
                         title="Email" v-model="newWorkflow.lead.person.email"/>
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
import AppModal from '@/components/AppModal.vue'
import {useAppealStore} from '@/stores/appealStore'
import {useGlobalStore} from '@/stores/globalStore'
import {LeadType, WorkflowsVariants, Years} from '@/utils/globalConstants'
import {useAdminStore} from '@/stores/adminStore'
import {ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import UsersDirModal_History from '@/pages/admin/dirs/UsersDirModal_History.vue'
import {emailValidate, formattingPhone} from '@/utils/globalFunctions'

const currentButton = ref({title: 'Выкуп', value: 2})
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const isOpen = ref(false)
const treatmentSources = ref([])
const managers = ref([])
const modalHistory = ref(null)
const adminStore = useAdminStore()
const form = ref(null)
const brands = ref([])
const models = ref([])
const submitForm = formEl => formEl && formEl.validate(valid => !valid)
const isClientChosen = ref(false)
const account = localStorage.getItem('account')
const user = account && JSON.parse(account);
const newLead = {source: 10, leadId: 0, leadType: 10, person: {}}
const newWorkflow = ref({managerId: user.id, lead: newLead, type: 15});
const workflowTypes = ref([])


globalStore.getBrands().then(res => brands.value = res)


// В зависимости от аккаунта, позволяется создать разный подбор типов обращений
function getWorkflowTypeEnum(userRole) {
  if (userRole == 'BuyerEmployee' || userRole == 'BuyerManager') {
    workflowTypes.value = WorkflowsVariants.Buyers;
    workflowTypes.value = makeArr(WorkflowsVariants.Buyers)
    newWorkflow.value.workflowLeadType = 2;
  } else if (userRole == 'SalesEmployee' || userRole == 'SalesManager' || userRole == 'Agent') {
    workflowTypes.value = WorkflowsVariants.Sell;
    workflowTypes.value = makeArr(WorkflowsVariants.Sell)
    newWorkflow.value.workflowLeadType = 1;
  } else if (userRole == 'SimpleEmployee') {
    workflowTypes.value = WorkflowsVariants.Other;
    workflowTypes.value = makeArr(WorkflowsVariants.Other)
    newWorkflow.value.workflowLeadType = 6;
  } else if (userRole == 'GenManager') {
    workflowTypes.value = WorkflowsVariants.GenManager;
    workflowTypes.value = makeArr(WorkflowsVariants.GenManager)
    newWorkflow.value.workflowLeadType = 2;
  } else {
    workflowTypes.value = makeArr(WorkflowsVariants.AllUsers)
    newWorkflow.value.workflowLeadType = 2;
  }
}

function makeArr(arr) {
  return Object.entries(arr).map(el => ({value: el[0], title: el[1]}));
}

getWorkflowTypeEnum(user.role)

function changeBrand(id) {
  newWorkflow.value.carModelId = null
  id && globalStore.getModels(id).then((res) => models.value = res)
}

const resetForm = formEl => {
  formEl && formEl.resetFields()
  newWorkflow.value = {managerId: user.id, lead: newLead, type: 15}
}

let cb
const BuyCategoryTypes = ref([
  {id: 10, title: 'Свободный выкуп'},
  {id: 20, title: 'Выездной выкуп'},
  {id: 30, title: 'Регион'},
  {id: 40, title: 'Fleet'}
])

const closeModal = () => {
  isOpen.value = false
}

function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true
  isClientChosen.value = false
  globalStore.getTreatmentSources().then(res => {
    treatmentSources.value = res.items
  })
  globalStore.getenabledemployeers().then(res => {
    console.log('res', res)

    managers.value = res.items
    managers.value.map(user => user.fullName = user.lastName + ' '
        + user.firstName + ' ' + (user.middleName == null ? ' ' : user.middleName))
  })
}

function changeWorkflowType(flow) {
  currentButton.value = flow
}

const telChanged = value => {
  if (value.length < 3) return []
  value = value.replace(/\D/g, '')
  return appealStore.getContragent(value).then(res => {
    res = res.map(el => {
      el.value = el.lastName + ' ' + el.firstName + ' ' + el.middleName + ' ( ' + el.phone + ' ) '
      return el
    })
    return res
  })
}

function handlePhone(val) {
  newWorkflow.value.lead.person = val
  isClientChosen.value = true
}


function checking() {
  if (!newWorkflow.value.treatmentSourceId) {
    return ElMessage({message: 'Поле "Источник" обязетелен для заполнения', type: 'warning'})
  }
  if (!newWorkflow.value.BuyCategory && currentButton.value.title === 'Выкуп') {
    return ElMessage({message: 'Поле "Вид выкупа" обязетелен для заполнения', type: 'warning'})
  }
  if (!newWorkflow.value.carBrand) {
    return ElMessage({message: 'Поле "Марка" обязетелен для заполнения', type: 'warning'})
  }
  if (!newWorkflow.value.carModelId) {
    return ElMessage({message: 'Поле "Модель" обязетелен для заполнения', type: 'warning'})
  }

  if (!newWorkflow.value.yearReleased) {
    return ElMessage({message: 'Поле "Год выпуска" обязетелен для заполнения', type: 'warning'})
  }

  if (!newWorkflow.value.lead.person.firstName) {
    return ElMessage({message: 'Поле "Имя" обязетелен для заполнения', type: 'warning'})
  }
  if (!newWorkflow.value.lead.person.phone) {
    return ElMessage({message: 'Поле "Контактный телефон" обязетелен для заполнения', type: 'warning'})
  }
}

function save() {
  checking()
  submitForm(form.value).then(res => { // проверка заполненности обязательных полей
    newWorkflow.value.lead.treatmentSourceId = newWorkflow.value.treatmentSourceId;

    res && appealStore.saveAppeal(newWorkflow.value).then(res => {
      if (!res) return false
      res && ElMessage({message: 'Категория наценки успешно сохранена', type: 'success'})
      isOpen.value = false
      cb()
    })
  })


}

defineExpose({open})


</script>