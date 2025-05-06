<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 500"
            :top="40"
            :title="'Обращение - '+workflowTypes.find(el=>el.value===String(newWorkflow.workflowLeadType)).title"
            draggable>
    <el-scrollbar>
      <div class="modal-fields">
        <el-form ref="form" :model="newWorkflow" class="error-to-message">
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

          <div v-if="!['8', '10'].includes(newWorkflow.workflowLeadType)">
            <small>
               <label class="label-right l_100">Источник</label>
              <el-form-item prop="treatmentSourceId" style="display: table-cell; width: 220px"
                            :rules="{required: true, message: 'Источник', trigger: ['blur', 'change']}">
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
                            :rules="{required: true, message: 'Вид выкупа', trigger: ['blur', 'change']}">
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

          <div v-if="newWorkflow.workflowLeadType!==6 ">
          Автомобиль<br>
          <small>
                 <label class="label-right l_100">Объявление</label>
                 <el-input v-model="newWorkflow.description"/>
          <br></small>
          <small>
               <label class="label-right l_100">Марка</label>
               <el-form-item prop="carBrand" style="display: table-cell"
                             :rules="{required: true, message: 'Марка', trigger: ['blur', 'change']}">
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
                          :rules="{required: true, message: 'Модель', trigger: ['blur', 'change']}">
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
            <el-form-item prop="yearReleased" style="display: table-cell"
                          :rules="{required: true, message: 'Год выпуска', trigger: ['blur', 'change']}">
                <el-select placeholder="Год выпуска"
                           clearable
                           style="width: 110px"
                           v-model="newWorkflow.yearReleased">
                    <el-option v-for="item in Years" :key="item.name" :label="item.name" :value="item.name"/>
                  </el-select>
            </el-form-item>
          </small>
          </div>
        <hr>
          </div>
    <component
        v-if="['8', '10'].includes(newWorkflow.workflowLeadType)"
        :is="comissionFields" :newWorkflow="newWorkflow" :disablePerson="disablePerson"
        :treatmentSources="treatmentSources" :brands="brands"/>

   <div v-if="!['8', '10'].includes(newWorkflow.workflowLeadType)">
        Клиент
      <br>
          <small>
               <label class="label-right l_100">Тип клиента</label>
                <el-select
                    :disabled="disablePerson"
                    style="width: 200px"
                    v-model="newWorkflow.lead.leadType"
                    filterable>
              <el-option v-for="item in LeadType" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
            </small>
          <br>


          <div v-if="newWorkflow.lead.leadType===10">
            <small>
              <label class="label-right l_100">Фамилия</label>
              <el-autocomplete
                  style="display: table-cell"
                  v-model="newWorkflow.lead.person.lastName"
                  :disabled="disablePerson"
                  :fetch-suggestions="getAgent"
                  :trigger-on-focus="false"
                  @select="setClient"
                  clearable
                  placeholder="Введите Фамилию"
              />
            <br></small>



            <small>
              <label class="label-right l_100">Имя</label>
              <el-form-item prop="lead.person['firstName']" style="display: table-cell"
                            :rules="{required: true, message: 'Имя', trigger: ['blur']}">
                 <el-input v-model="newWorkflow.lead.person.firstName" :disabled="disablePerson"/>
              </el-form-item>
            <br></small>

            <small>
               <label class="label-right l_100">Отчество</label>
               <el-input v-model="newWorkflow.lead.person.middleName" :disabled="disablePerson"/>
            <br></small>

           <small>
              <label class="label l_200">Контактный телефон</label>

              <el-form-item prop="lead.person['phone']" style="display: table-cell"
                            :rules="{required: true, message: 'Контактный телефон', trigger: ['blur']}">
                <el-autocomplete
                    v-model="newWorkflow.lead.person.phone"
                    :fetch-suggestions="getAgent"
                    :trigger-on-focus="false"
                    @select="setClient"
                    clearable
                    placeholder="Введите телефон"
                    maxlength="11"
                />
              </el-form-item>

            </small>
            <small>

             <label class="label l_200">Контактная эл.почта</label>
               <el-input placeholder="Email"
                         @change="emailValidate(newWorkflow.lead.person.email)"
                         title="Email" v-model="newWorkflow.lead.person.email"/>
              </small><br>
          </div>

           <div v-if="newWorkflow.lead.leadType===20">
            <small>
               <label class="label-right l_100">ИНН</label>
               <el-input v-model="newWorkflow.lead.legalEntity.inn" :disabled="disablePerson"/>
            </small><br>

            <small>
               <label class="label-right l_100">НДС</label>
               <el-checkbox v-model="newWorkflow.lead.legalEntity.nds" :disabled="disablePerson"/>
            </small><br>

            <small>
               <label class="label-right l_100">Наименование организации </label>
               <el-input v-model="newWorkflow.lead.legalEntity.name" :disabled="disablePerson"/>
            </small><br>

            <small>
               <label class="label-right l_100">Фамилия</label>
               <el-input v-model="newWorkflow.lead.legalEntity.person.lastName" :disabled="disablePerson"/>
            </small><br>

            <small>
               <label class="label-right l_100">Имя</label>
               <el-input v-model="newWorkflow.lead.legalEntity.person.firstName" :disabled="disablePerson"/>
            </small><br>

            <small>
              <label class="label l_200">Контактный телефон</label>

              <el-form-item prop="lead.legalEntity.person['phone']" style="display: table-cell"
                            :rules="{required: true, message: 'Контактный телефон', trigger: ['blur']}">
                 <el-autocomplete
                     v-model="newWorkflow.lead.legalEntity.person.phone"
                     :disabled="disablePerson"

                     :fetch-suggestions="getAgent"
                     :trigger-on-focus="false"
                     @select="setClient"
                     clearable
                     placeholder="Введите телефон"
                 />
              </el-form-item>

            </small>
            <small>

             <label class="label l_200">Контактная эл.почта</label>
               <el-input placeholder="Email"
                         :disabled="disablePerson"
                         @change="emailValidate(newWorkflow.lead.person.email)"
                         title="Email" v-model="newWorkflow.lead.legalEntity.person.email"/>
              </small><br>
           </div>
 </div>

          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </el-form>
      </div>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
</template>


<script setup>
import AppModal from '@/components/AppModal.vue'
import {useAppealStore} from '@/stores/appealStore'
import {useGlobalStore} from '@/stores/globalStore'
import {useDesktopStore} from "@/stores/desktopStore";
import {LeadType, WorkflowsVariants, Years, BuyCategoryTypes} from '@/utils/globalConstants'
import {markRaw, ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import UsersDirModal_History from '@/pages/admin/dirs/UsersDirModal_History.vue'
import {checkEmptyFields, emailValidate} from '@/utils/globalFunctions'
import AddAppealModal_Comission from "@/pages/appeal/AddAppealModal_Comission.vue";

const desktopStore = useDesktopStore()
const currentButton = ref({title: 'Выкуп', value: 2})
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const isOpen = ref(false)
const treatmentSources = ref([])
const managers = ref([])
const modalHistory = ref(null)
const form = ref(null)
const brands = ref([])
const models = ref([])
const disablePerson = ref(false)
const newLead = {source: 10, leadId: 0, leadType: 10, person: {}, legalEntity: {person: {}}}
const newWorkflow = ref({});
const workflowTypes = ref([])
const comissionFields = ref(null)


globalStore.getBrands().then(res => brands.value = res)

getWorkflowTypeEnum()

// В зависимости от аккаунта, позволяется создать разный подбор типов обращений
function getWorkflowTypeEnum() {
  let userRole = globalStore.account.role
  console.log('userRole', userRole)
  if (userRole === 'BuyerEmployee' || userRole === 'BuyerManager') {
    workflowTypes.value = WorkflowsVariants.Buyers;
    workflowTypes.value = makeArr(WorkflowsVariants.Buyers)
    newWorkflow.value.workflowLeadType = 2;
  } else if (userRole === 'SalesEmployee' || userRole === 'SalesManager' || userRole === 'Agent') {
    workflowTypes.value = WorkflowsVariants.Sell;
    workflowTypes.value = makeArr(WorkflowsVariants.Sell)
    newWorkflow.value.workflowLeadType = 1;
  } else if (userRole === 'SimpleEmployee') {
    workflowTypes.value = WorkflowsVariants.Other;
    workflowTypes.value = makeArr(WorkflowsVariants.Other)
    newWorkflow.value.workflowLeadType = 6;
  } else if (userRole === 'GenManager') {
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


function changeBrand(id) {
  newWorkflow.value.carModelId = null
  id && globalStore.getModels(id).then((res) => models.value = res)
}

let cb

const closeModal = () => {
  isOpen.value = false
}

function open(cbModal) {
  currentButton.value = {title: 'Выкуп', value: 2}
  newWorkflow.value = {managerId: globalStore.account.id, lead: newLead, type: 15, workflowLeadType: 2};
  cb = cbModal
  isOpen.value = true
  disablePerson.value = false
  globalStore.getTreatmentSources().then(res => {
    treatmentSources.value = res.items
  })
  globalStore.getenabledemployeers().then(res => managers.value = res.items)
}

function changeWorkflowType(flow) {
  if (disablePerson.value) return false
  currentButton.value = flow
  newWorkflow.value.workflowLeadType = flow.value
  if (flow.title === 'Комиссия') {
    // newWorkflow.value.client = {person: {}}

    comissionFields.value = markRaw(AddAppealModal_Comission)
  } else comissionFields.value = null

}

const getAgent = value => {
  if (value.length < 3) return []
  let type = newWorkflow.value.lead.leadType
  return appealStore.getContragent(value, type).then(res => {
    res = res.map(el => {
      el.value = el.lastName + ' ' + el.firstName + ' ' + el.middleName + ' ( ' + el.phone + ' ) '
      return el
    })
    return res
  })
}


//При выборе телефона или фамилии
//Отправляя Id получаем правильноогого клиента, физ или юр
function setClient(val) {
  let id = val.id
  appealStore.getLead(id).then(function (data) {
    disablePerson.value = true;

    if (data.leadType === 10 && data.person.phone) {
      data.person.phone = parseInt(data.person.phone);
    }
    if (data.leadType === 20 && data.legalEntity.person.phone) {
      data.legalEntity.person.phone = parseInt(data.legalEntity.person.phone);
    }
    newWorkflow.value.lead = data;
  })
}


function saveInComission() {
  let params = {
    leadType: newWorkflow.value.lead.leadType,
    client: newWorkflow.value.client,
    appeal: {
      carModel: {id: newWorkflow.value.carModelId},
      yearReleased: newWorkflow.value.yearReleased
    },
    locationId: newWorkflow.value.locationId,
    treatmentSourceId: newWorkflow.value.treatmentSourceId
  }

  if (newWorkflow.value.lead.leadType === 10) {
    params.client.treatmentSourceId = 2;
    params.client.person = {
      firstName: newWorkflow.value.firstName,
      lastName: newWorkflow.value.lastName,
      phone: newWorkflow.value.phone
    }
    params.legal = null
  }
  if (newWorkflow.value.lead.leadType === 20) {
    params.client = null

    params.legal = {
      typeCompany: 10,
      treatmentSourceId: 2,
      typeLegal: 10,
      name: newWorkflow.value.name,
      inn: newWorkflow.value.inn,
      person: {
        firstName: newWorkflow.value.firstName,
        lastName: newWorkflow.value.lastName,
        phone: newWorkflow.value.phone
      }
    };
    Object.assign(params.legal, newWorkflow.value.legal);
  }


  if (newWorkflow.value.leadType === 20) {
    $scope.model.legal.typeCompany = 10;
    $scope.model.legal.treatmentSourceId = 2;
    $scope.model.legal.typeLegal = 10;
  }


  desktopStore.getHostessUser().then().then(res => {
    params.locationId = res.location.id

    desktopStore.saveAppealComission(params).then(itog => {
      if (itog.data) {
        ElMessage({message: 'Обращение "Комиссия" успешно добавлено', type: 'success'})
        isOpen.value = false
        cb()
      }
    })
  })


}


function save() {
  checkEmptyFields(form.value).then(res => { // проверка заполненности обязательных полей
    newWorkflow.value.lead.treatmentSourceId = newWorkflow.value.treatmentSourceId;
    if (newWorkflow.value.workflowLeadType === '8') return saveInComission()

    res && appealStore.saveAppeal(newWorkflow.value).then(itog => {
      if (!itog) return false
      ElMessage({message: 'Обращение успешно добавлено', type: 'success'})
      isOpen.value = false
      cb()
    })
  })
}

defineExpose({open})


</script>