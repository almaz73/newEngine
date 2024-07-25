<template>
  <main>
    <el-form ref="form" :model="appeal" @change="isDirty=true">
      <div class="main__flex custom">
        <div>
          <div class="desk" style="margin-bottom: -40px;">
            <el-button-group class="group-button" v-if="!globalStore.isMobileView || appeal.lead.leadType===10"/>

            <div class="fields yourPlace">
              <div v-if="appeal.lead.leadType===10">Физическое лицо</div>
              <div v-if="appeal.lead.leadType===20">Юридическое лицо</div>
              <br><br>
              <el-form-item
                  v-if="appeal.lead.leadType===20"
                  style="min-width: calc(100% - 35px)"
                  prop="lead.legalEntity['name']"
                  :rules="{required: true, message: 'Введите название организации', trigger: ['blur', 'change']}">
                <el-input
                    :style="{minWidth:globalStore.isMobileView? '183%':'100%' }"
                    v-model.number="appeal.lead.legalEntity.name" placeholder="* Название организации"/>
              </el-form-item>
            </div>
          </div>
          <div class="desk">
            <el-button-group v-model="appeal.lead.leadType" class="group-button gray-buttons">
              <div>Клиент</div>
              <br>
              <el-button @click="appeal.lead.leadType=10" :class="{active:appeal.lead.leadType===10}">
                Физ. лицо
              </el-button>
              <el-button @click="appeal.lead.leadType=20"
                         :disabled="appeal.workflow.workflowLeadType===10"
                         :class="{active:appeal.lead.leadType===20}">
                Юр. лицо
              </el-button>
            </el-button-group>

            <div class="fields" v-if="appeal.workflow.workflowLeadType!==10">
              <div class="fields__in">
                <el-form-item prop="lead.person['phone']"
                              :rules="{required: true, message: 'Введите номер телефона', trigger: ['blur']}">
                  <el-input placeholder="* Основной телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.lead.person.phone=val)"
                            @input="telChanged(appeal.lead.person.phone)"
                            v-model="appeal.lead.person.phone"/>
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Подменный телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.workflow.swapPhone=val)"
                            v-model="appeal.workflow.swapPhone"/>
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Эл.почта"
                            @change="emailValidate(appeal.lead.person.email)"
                            v-model="appeal.lead.person.email"/>
                </el-form-item>
              </div>
              <div class="fields__in">
                <el-form-item prop="lead.person['firstName']"
                              :rules="{required: true, message: 'Введите имя', trigger: ['blur', 'change']}">
                  <el-input placeholder="* Имя" v-model="appeal.lead.person.firstName"/>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="Отчество" v-model="appeal.lead.person.middleName"/>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName"/>
                </el-form-item>
              </div>
            </div>


            <div class="fields" v-if="appeal.workflow.workflowLeadType===10">
              <div class="fields__in">
                Продавец<br><br>
                <el-form-item prop="lead.person['phone']"
                              :rules="{required: true, message: 'Введите номер телефона', trigger: ['blur']}">
                  <el-input placeholder="* Телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.workflow.swapPhone=val)"
                            v-model="appeal.lead.person.phone"/>
                </el-form-item>

                <el-form-item prop="lead.person['firstName']"
                              :rules="{required: true, message: 'Введите имя', trigger: ['blur', 'change']}">
                  <el-input placeholder="* Имя" v-model="appeal.lead.person.firstName"/>
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName"/>
                </el-form-item>
              </div>
              <div class="fields__in">
                Покупатель<br><br>
                <el-form-item prop="buyLead.person['phone']"
                              :rules="{required: true, message: 'Введите номер телефона', trigger: ['blur']}">
                  <el-input placeholder="* Телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.workflow.swapPhone=val)"
                            v-model="appeal.buyLead.person.phone"/>
                </el-form-item>

                <el-form-item prop="buyLead.person['firstName']"
                              :rules="{required: true, message: 'Введите имя', trigger: ['blur', 'change']}">
                  <el-input placeholder="* Имя" v-model="appeal.buyLead.person.firstName"/>
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Фамилия" v-model="appeal.buyLead.person.lastName"/>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="desk" style="margin-bottom: -40px;">
            <el-button-group class="group-button " v-if="!globalStore.isMobileView || appeal.communication.type!==15"/>

            <div class="fields yourPlace">
              <div>{{ Workflows.find(el => el.value === appeal.workflow.workflowLeadType).title }}</div>
              <br><br>
              <el-form-item
                  v-if="appeal.communication.type===15"
                  style="min-width: calc(100% - 35px)">
                <el-input
                    :style="{minWidth:globalStore.isMobileView? '183%':'100%' }"
                    @input="weblinkTreatment(appeal.communication.weblink)"
                    clearable
                    v-model.number="appeal.communication.weblink" placeholder="Веб-ссылка"/>
              </el-form-item>
            </div>
          </div>
          <div class="desk gray-buttons">
            <el-button-group v-model="appeal.lead.leadType" class="group-button">
              <div>Обращение</div>
              <br>
              <el-button v-for="workflow in Workflows"
                         :key="workflow.id"
                         @click="changeWorkflow(workflow.value)"
                         :class="{active:workflow.value === appeal.workflow.workflowLeadType}">
                {{ workflow.title }}
              </el-button>
            </el-button-group>

            <div class="fields">
              <div class="fields__in">


                <el-form-item
                    v-if="[1,2,3].includes(appeal.workflow.workflowLeadType)"
                    prop="workflow.auto['vin']"
                    :rules="[{  min: 17, max: 17, message: 'Не менее 17 знаков', trigger: ['blur']}]">
                  <el-input placeholder="VIN 17 символов" @change="getAutoWithVIN()"
                            maxlength="17"
                            v-model="appeal.workflow.auto.vin"/>
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,8,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select
                      v-model="appeal.workflow.brandId"
                      @change="changeBrand(appeal.workflow.brandId)"
                      placeholder="Марка"
                      :clearable="!globalStore.isMobileView"
                      :filterable="!globalStore.isMobileView"
                  >
                    <el-option v-for="item in brands"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,8,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.carModelId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             placeholder="Модель">
                    <el-option v-for="item in models"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select placeholder="Год выпуска"
                             clearable
                             v-model="appeal.workflow.yearReleased">
                    <el-option v-for="item in Years"
                               :key="item.name"
                               :label="item.name"
                               :value="item.name"/>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3].includes(appeal.workflow.workflowLeadType)">
                  <el-input placeholder="Пробег автомобиля" type="number" v-model="appeal.workflow.mileageAuto"/>
                </el-form-item>

                <el-form-item v-if="[3].includes(appeal.workflow.workflowLeadType)">
                  <el-input v-model="appeal.workflow.registrationMark"
                            @input="changeRegistartionMark(appeal.workflow.registrationMark)"
                            style="text-transform: uppercase"
                            placeholder="X 000 XX 000"
                            maxlength="12"
                            @key.enter="emits('changed')"/>
                </el-form-item>

                <el-form-item v-if="[3].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.engineType" placeholder="Тип двигателя">
                    <el-option v-for="item in EngineType"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[3].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.gearboxType" placeholder="Тип КПП">
                    <el-option v-for="item in GearboxType"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>


                <el-form-item v-if="appeal.workflow.workflowLeadType===2">
                  <el-select v-model="appeal.workflow.bodyColorId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             placeholder="Цвет кузова">
                    <el-option v-for="item in colors"
                               :key="item.id"
                               :label="item.colorName"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

              </div>
              <div class="fields__in">
                <el-form-item prop="workflow.BuyCategory"
                              :rules="{required: true, message: '', trigger: ['blur']}"
                              v-if="appeal.workflow.workflowLeadType===2">
                  <el-select v-model="appeal.workflow.BuyCategory" placeholder="* Вид выкупа">
                    <el-option v-for="item in BuyCategoryTypes"
                               :key="item.id"
                               :label="item.title"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>


                <el-form-item v-if="![6].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.locationId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             placeholder="Салон">
                    <el-option v-for="item in places"
                               :key="item.id"
                               :label="item.title"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[6].includes(appeal.workflow.workflowLeadType)"
                              :rules="{required: true, message: 'Введите франшизу', trigger: ['blur']}"
                              prop="workflow.organizationId">
                  <el-select v-model="appeal.workflow.organizationId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             placeholder="* Франчази">
                    <el-option v-for="item in organizations"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,5,6,7,8,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.managerId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             placeholder="Ответственный">
                    <el-option v-for="item in managers"
                               :key="item.id"
                               :label="item.title"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <div class="field_left gray-buttons" style="background: none">
          <div style="margin: 17px 0">Источник обращения</div>
          <el-form-item>
            <el-select v-model="appeal.communication.type">
              <el-option v-for="item in CommunicationTypes" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="appeal.communication.sourceId">
              <el-option v-for="item in sources" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="appeal.communication.city" placeholder="Город" :filterable="!globalStore.isMobileView">
              <el-option v-for="(item, ind) in cities" :key="ind" :label="item" :value="item"/>
            </el-select>
          </el-form-item>


          <el-input placeholder="Описание" v-model="appeal.communication.description"/>

          <br><br><br>
          <el-button @click="save()">+ Сохранить новое обращение</el-button>
          <br><br>
          <el-button @click="resetForm(form)" :disabled="!isDirty">Сброс</el-button>
        </div>

      </div>
    </el-form>

    <ModalParams :listAppeals="listAppeals"
                 :isOpen="isOpen"
                 :clients="clientsPhone"
                 :tel="appeal.lead.person.phone"
                 @setFoundClient="setFoundClient"
                 @closeModal="closeModal"/>
  </main>
</template>
<style>


</style>
<script setup>
import {useGlobalStore} from "@/stores/globalStore";
import {computed, reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import {useDesktopStore} from "@/stores/desktopStore";
import {BuyCategoryTypes, CommunicationTypes, EngineType, GearboxType, Years} from '@/utils/globalConstants'
import {emailValidate, formattingPhone, vetRegNumber, weblink} from "@/utils/globalFunctions";
import {saveInLocalStorage, saveUnSaved} from "@/utils/unsavedRequests";
import ModalParams from "@/pages/desktop/ModalParams.vue";

let Workflows = [{id: 2, value: 2, title: 'Выкуп'},
  {id: 1, value: 1, title: 'Продажа'},
  {id: 3, value: 3, title: 'Сервис'},
  {id: 4, value: 4, title: 'КСО'},
  {id: 5, value: 5, title: 'Fleet'},
  {id: 6, value: 6, title: 'Франшиза'},
  {id: 7, value: 7, title: 'Доп.оборуд.'},
  {id: 8, value: 8, title: 'Комиссия'},
  {id: 9, value: 9, title: 'Подбор авто'},
  {id: 10, value: 10, title: 'Сделка через салон'}]

const desktopStore = useDesktopStore()
const form = ref(null)
const globalStore = useGlobalStore()
const brands = ref([])
const models = ref([])
const colors = ref([])
const cities = ref([])
const places = ref([])
const managers = ref([])
const treatmentSources = ref([])
const organizations = ref([])
const isOpen = ref(false)
const listAppeals = ref([])
let clientsPhone = ref([])
const isDirty = ref(false)

let isNeedCheckUnSaved = false
const sources = computed(() => {
  return treatmentSources.value.filter(el => el.communicationType === appeal.communication.type)
})

const appealStart = {
  lead: {
    leadType: 10,
    leadId: 0,
    legalEntity: {name: ''},
    person: {phone: '', email: '', firstName: '', lastName: '', middleName: ''}
  },
  workflow: {
    workflowLeadType: 2,
    auto: {vin: ''},
    swapPhone: '', brandId: null, carModelId: null,
    mileageAuto: null, bodyColorId: '',
    BuyCategory: null,
    yearReleased: null, locationId: null, managerId: null,
    organizationId: null
  },
  communication: {
    type: 10, sourceId: 15, callType: null, city: 'Казань',
    weblink: '', description: ''
  },
  buyLead: {
    person: {phone: '', firstName: '', lastName: ''}
  }
}

const appeal = reactive(JSON.parse(JSON.stringify(appealStart)))

if (['CallManager', 'LocalCallEmployee'].includes(globalStore.account.role)) {
  Workflows = Workflows.filter(el => el.title !== "Франшиза")
}

globalStore.getBrands().then(res => brands.value = res)
globalStore.getColors().then(res => colors.value = res.items)
globalStore.getOrganizations().then(res => organizations.value = res.items)
globalStore.getPlaces().then(res => {
  cities.value = res.citys
  places.value = res.items
})
globalStore.getUsers().then(res => {
  managers.value = res.items
})
globalStore.getTreatmentSources().then(res => {
  treatmentSources.value = res.items
})

let telRequestList = {}
const telChanged = (value) => {
  setTimeout(() => {
    value = value.replace(/\D/g, '')
    let t = value.length > 11 ? value.slice(0, -1) : value
    if (t.length < 10) telRequestList = {}
    if (t.length === 11 && !telRequestList[t]) {
      telRequestList[t] = true
      if (t[0] === '7') t = '8' + t.slice(1)
      desktopStore.getLeadsByPhone(t).then(res => openPhoneModal(res.items))
    }
  })
}

// показ вариантов кто с телефоном
function openPhoneModal(appeals) {
  clientsPhone.value = []
  appeals.forEach(el => {
    if (!clientsPhone.value.find(item => item.name === el.leadName)) {
      clientsPhone.value.push({name: el.leadName, leadId: el.leadId})
    }
  })
  listAppeals.value = appeals
  if (appeals.length) isOpen.value = true
}

const closeModal = () => isOpen.value = false

function setFoundClient(val, appeals) {
  closeModal()
  let findAppeal = appeals.find(el => el.leadId === val.leadId)
  appeal.lead.person.firstName = findAppeal.lead.person.firstName
  appeal.lead.person.middleNAme = findAppeal.lead.person.middleNAme
  appeal.lead.person.lastName = findAppeal.lead.person.lastName
}


const changeBrand = id => id && globalStore.getModels(id).then((res) => models.value = res)
const submitForm = formEl => formEl && formEl.validate(valid => !valid)
const resetForm = formEl => {
  formEl && formEl.resetFields()
  Object.assign(appeal, JSON.parse(JSON.stringify(appealStart)));
  isNeedCheckUnSaved && saveUnSaved(cbForEdit)
}

function changeWorkflow(val) {
  appeal.workflow.workflowLeadType = val
  if (val === 10) appeal.lead.leadType = 10
}

function changeRegistartionMark(value) {
  appeal.workflow.registrationMark = vetRegNumber(value)
}

function weblinkTreatment(link) {
  weblink(link).then(res => {
    appeal.workflow.brandId = res.brandId
    changeBrand(res.brandId)
    appeal.workflow.carModelId = res.modelId
    appeal.workflow.mileageAuto = res.line
    appeal.workflow.yearReleased = res.year
    appeal.workflow.gearboxType = res.kpp
  })
}

function checkAndWarning() {
  if (appeal.lead.leadType === 20 && !appeal.lead.legalEntity.name)
    return ElMessage({message: 'Поле "Название организации" не заполнено', type: 'error'})
  if (!appeal.lead.person.phone) return ElMessage({message: 'Поле "Основной телефон" не заполнен', type: 'error'})
  if (!appeal.lead.person.firstName) return ElMessage({message: 'Поле "Имя" не заполнено', type: 'error'})
  if (appeal.workflow.workflowLeadType === 2 && !appeal.workflow.BuyCategory)
    return ElMessage({message: 'Поле "Вид выкупа" не заполнено', type: 'error'})
}

function save() {
  checkAndWarning()
  if (appeal.lead.leadType === 10) appeal.lead.legalEntity = null
  submitForm(form.value).then(res => { // проверка заполненности обязательных полей
    if (res) prepareAndSave()
    else console.error('ОШИБКА ЗАПОЛНЕНИЯ ФОРМЫ')
  })
}


function prepareAndSave() {
  if (!appeal.workflow.bodyColorId) delete appeal.workflow.bodyColorId
  if (!appeal.workflow.locationId) delete appeal.workflow.locationId

  if (appeal.workflow.workflowLeadType === 8) {// комиссия
    var commission = {
      TreatmentSourceId: appeal.communication.sourceId,
      LocationId: appeal.workflow.locationId,
      Client: {
        leadId: appeal.lead.leadId,
        TreatmentSourceId: appeal.communication.sourceId,
        Person: appeal.lead.person,
      },
      Appeal: {ResponsibleId: appeal.workflow.managerId},
      LeadType: appeal.lead.leadType,
    };

    if (!navigator.onLine) {
      saveInLocalStorage('desktopStore.saveAppealComission', commission).then(() => resetForm(form.value))
      return false
    }

    desktopStore.saveAppealComission(commission).then(res => {
      if (res.status === 200) {
        ElMessage({message: 'Обращение успешно сохранено', type: 'success'})
        resetForm(form.value)
      } else {
        ElMessage({duration: 0, message: 'Ошибка. Данные не сохранились. Не доработано. ' + res.message, type: 'error'})
      }
      isNeedCheckUnSaved && saveUnSaved(cbForEdit)
    })
  } else if (appeal.workflow.workflowLeadType === 10) { // сделка через салон
    var deal = {
      buyLead: {
        leadId: appeal.buyLead.leadId,
        person: appeal.buyLead.person,
        treatmentSourceId: 2,
      },
      locationId: appeal.workflow.locationId,
      sellLead: {
        leadId: appeal.lead.leadId,
        person: appeal.lead.person,
        treatmentSourceId: 2,
      },
      treatmentSourceId: appeal.communication.sourceId,
    };
    if (!navigator.onLine) {
      saveInLocalStorage('desktopStore.saveAppealSalon', deal).then(() => resetForm(form.value))
      return false
    }

    desktopStore.saveAppealSalon(deal).then(res => {
      if (res.status === 200) {
        ElMessage({message: 'Обращение успешно сохранено', type: 'success'})
        resetForm(form.value)
      } else {
        ElMessage({duration: 0, message: 'Ошибка. Данные не сохранились. Не доработано. ' + res.message, type: 'error'})
      }
      isNeedCheckUnSaved && saveUnSaved(cbForEdit)
    })
  } else {
    if (!navigator.onLine) {
      saveInLocalStorage('desktopStore.saveAppeal', appeal).then(() => resetForm(form.value))
      return false
    }

    desktopStore.saveAppeal(appeal).then(res => {
      if (res.status === 200) {
        ElMessage({message: 'Обращение успешно сохранено', type: 'success'})
        resetForm(form.value)
      } else {
        ElMessage({duration: 0, message: 'Ошибка сохранения. ' + res.message, type: 'error'})
      }
      isNeedCheckUnSaved && saveUnSaved(cbForEdit)
    })
  }
}

function getAutoWithVIN() {
  desktopStore.getAutoVIN(appeal.workflow.auto.vin).then(el => {
    if (el.carBrandId) {
      appeal.workflow.brandId = el.carBrandId
      changeBrand(el.carBrandId)
    }
    if (el.carModelId) appeal.workflow.carModelId = el.carModelId
    if (el.bodyColorId) appeal.workflow.bodyColorId = el.bodyColorId
    if (el.yearReleased) appeal.workflow.yearReleased = el.yearReleased
  })
}

globalStore.setTitle('Новое обращение')
globalStore.steps = []

function cbForEdit(howMuchIsLeft, fromLocalStorage) {
  window.scrollTo({top: 0, behavior: 'smooth'});
  if (howMuchIsLeft) globalStore.setTitle('Несохраненных: ' + howMuchIsLeft)
  else globalStore.setTitle('Новое обращение')
  isNeedCheckUnSaved = !!howMuchIsLeft
  if (fromLocalStorage) Object.assign(appeal, JSON.parse(JSON.stringify(fromLocalStorage)));
}

saveUnSaved(cbForEdit)

</script>