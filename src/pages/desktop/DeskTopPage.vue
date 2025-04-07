<template>
  <main>
    <br>
    <el-form ref="form" :model="appeal">
      <div class="main__flex custom">
        <div>
          <div class="desk" style="margin-bottom: -40px;">
            <el-button-group class="group-button" v-if="!globalStore.isMobileView || appeal.lead.leadType===10" />

            <div class="fields yourPlace">
              <div v-if="appeal.lead.leadType===10">Физическое лицо</div>
              <div v-if="appeal.lead.leadType===20">Юридическое лицо</div>
              <span v-if="isShowEditClient && appeal.lead.leadType===10">
                <EditPensilCtrl @click="editClient()" />
                 <img @click="resetForm()" alt=""
                      src="@/assets/icons/icon-cross-gray.png"
                      title="Удалить">
              </span>
              <br><br>
              <el-form-item
                v-if="appeal.lead.leadType===20"
                style="min-width: calc(100% - 35px)"
                prop="lead.legalEntity['name']"
                :rules="{required: true, message: 'Введите название организации', trigger: ['blur', 'change']}">
                <el-input
                  :style="{minWidth:globalStore.isMobileView? '183%':'100%' }"
                  v-model.number="appeal.lead.legalEntity.name" placeholder="* Название организации" />
              </el-form-item>
              <el-autocomplete
                v-if="appeal.lead.leadType===20"
                v-model="appeal.lead.legalEntity.inn"
                :fetch-suggestions="innChanged"
                placeholder="ИНН"
                @select="setLead"
              />
            </div>
          </div>
          <div class="desk">
            <el-button-group v-model="appeal.lead.leadType" class="group-button gray-buttons">
              <div>Клиент</div>
              <br>
              <el-button @click="changeLeadType(10)" :class="{active:appeal.lead.leadType===10}">
                Физ. лицо
              </el-button>
              <el-button @click="changeLeadType(20)"
                         :disabled="appeal.workflow.workflowLeadType===10"
                         :class="{active:appeal.lead.leadType===20}">
                Юр. лицо
              </el-button>
            </el-button-group>

            <div class="fields" v-if="appeal.workflow.workflowLeadType!==10">
              <div class="fields__in">
                <el-form-item prop="lead.person['phone']"
                              v-if="appeal.lead.leadType===20"
                              :rules="{required: true, message: 'Введите номер телефона', trigger: ['blur']}">
                  <el-input placeholder="* Основной телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.lead.person.phone=val)"
                            @input="telChanged(appeal.lead.person.phone)"
                            clearable
                            v-model="appeal.lead.person.phone"/>
                </el-form-item>
                <el-input placeholder="Основной телефон"
                          v-else
                          clearable
                          :disabled="!!appeal.lead.leadId"
                          :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.lead.person.phone=val)"
                          @input="telChanged(appeal.lead.person.phone)"
                          v-model="appeal.lead.person.phone"/>

                <el-input placeholder="Подменный телефон"
                          :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.workflow.swapPhone=val)"
                          v-model="appeal.workflow.swapPhone" />

                <el-input placeholder="Эл.почта"
                          @change="emailValidate(appeal.lead.person.email)"
                          v-model="appeal.lead.person.email" />
              </div>
              <div class="fields__in">
                <el-form-item prop="lead.person['firstName']"
                              :rules="{required: true, message: 'Введите имя', trigger: ['blur', 'change']}">
                  <el-input placeholder="* Имя" v-model="appeal.lead.person.firstName" />
                </el-form-item>
                <el-input placeholder="Отчество" v-model="appeal.lead.person.middleName" />
                <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName" />
              </div>
            </div>


            <div class="fields" v-if="appeal.workflow.workflowLeadType===10">
              <div class="fields__in">
                Продавец<br><br>
                <el-form-item prop="lead.person['phone']"
                              :rules="{required: true, message: 'Введите номер телефона', trigger: ['blur']}">
                  <el-input placeholder="* Телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.workflow.swapPhone=val)"
                            v-model="appeal.lead.person.phone" />
                </el-form-item>

                <el-form-item prop="lead.person['firstName']"
                              :rules="{required: true, message: 'Введите имя', trigger: ['blur', 'change']}">
                  <el-input placeholder="* Имя" v-model="appeal.lead.person.firstName" />
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName" />
                </el-form-item>
              </div>
              <div class="fields__in">
                Покупатель<br><br>
                <el-form-item prop="buyLead.person['phone']"
                              :rules="{required: true, message: 'Введите номер телефона', trigger: ['blur']}">
                  <el-input placeholder="* Телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>appeal.workflow.swapPhone=val)"
                            v-model="appeal.buyLead.person.phone" />
                </el-form-item>

                <el-form-item prop="buyLead.person['firstName']"
                              :rules="{required: true, message: 'Введите имя', trigger: ['blur', 'change']}">
                  <el-input placeholder="* Имя" v-model="appeal.buyLead.person.firstName" />
                </el-form-item>

                <el-form-item>
                  <el-input placeholder="Фамилия" v-model="appeal.buyLead.person.lastName" />
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="desk" style="margin-bottom: -40px;">
            <el-button-group class="group-button " v-if="!globalStore.isMobileView || appeal.communication.type!==15" />

            <div class="fields yourPlace">
              <div>{{ WorkflowType }}</div>
              <br><br>
              <el-form-item
                v-if="appeal.communication.type===15"
                style="min-width: calc(100% - 35px)">
                <el-input
                  style="border-bottom: 3px solid #66b1ff"
                  :style="{minWidth:globalStore.isMobileView? '183%':'100%' }"
                  @input="weblinkTreatment(appeal.communication.weblink)"
                  clearable
                  v-model.number="appeal.communication.weblink" placeholder="Скопируйте сюда ссылку с Авита" />
              </el-form-item>
            </div>
          </div>
          <div class="desk gray-buttons">
            <el-button-group v-model="appeal.lead.leadType" class="group-button">
              <div>Обращение</div>
              <br>
              <el-button v-for="workflow in Workflows"
                         :key="workflow.id"
                         @click="changeWorkflow(workflow)"
                         :class="{active:workflow.value === appeal.workflow.workflowLeadType}">
                {{ workflow.title }}
              </el-button>
              <button @click="moreButtons()"> {{ Workflows.length < 4 ? 'еще..' : 'скрыть..' }}</button>
            </el-button-group>

            <div class="fields">
              <div class="fields__in">


                <el-form-item
                  v-if="[1,2,3].includes(appeal.workflow.workflowLeadType) && appeal.communication.type!==15"
                  prop="workflow.auto['vin']"
                  :rules="[{  min: 17, max: 17, message: 'Не менее 17 знаков', trigger: ['blur']}]">
                  <el-input placeholder="VIN 17 символов" @input="getAutoWithVIN()"
                            maxlength="17"
                            v-model="appeal.workflow.auto.vin" />
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,8,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select
                    v-model="appeal.workflow.brandId"
                    @change="changeBrand(appeal.workflow.brandId)"
                    placeholder="Марка"
                    title="Марка"
                    :clearable="!globalStore.isMobileView"
                    :filterable="!globalStore.isMobileView"
                  >
                    <el-option v-for="item in brands"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,8,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.carModelId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             title="Модель"
                             placeholder="Модель">
                    <el-option v-for="item in models"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,8,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select placeholder="Год выпуска"
                             title="Год выпуска"
                             clearable
                             v-model="appeal.workflow.yearReleased">
                    <el-option v-for="item in Years"
                               :key="item.name"
                               :label="item.name"
                               :value="item.name" />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3].includes(appeal.workflow.workflowLeadType)">
                  <el-input placeholder="Пробег автомобиля"
                            title="Пробег автомобиля"
                            type="number" v-model="appeal.workflow.mileageAuto" />
                </el-form-item>

                <el-form-item v-if="[3].includes(appeal.workflow.workflowLeadType)">
                  <el-input v-model="appeal.workflow.registrationMark"
                            @input="changeRegistartionMark(appeal.workflow.registrationMark)"
                            style="text-transform: uppercase"
                            placeholder="X 000 XX 000"
                            title='Государственный номерной знак'
                            maxlength="12"
                            @key.enter="emits('changed')" />
                </el-form-item>

                <el-form-item v-if="[3].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.engineType"
                             title="Тип двигателя"
                             placeholder="Тип двигателя">
                    <el-option v-for="item in EngineType"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[3].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.gearboxType" placeholder="Тип КПП" title="Тип КПП">
                    <el-option v-for="item in GearboxType"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id" />
                  </el-select>
                </el-form-item>


                <el-form-item v-if="appeal.workflow.workflowLeadType===2">
                  <el-select v-model="appeal.workflow.bodyColorId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             title="Цвет кузова"
                             placeholder="Цвет кузова">
                    <el-option v-for="item in colors"
                               :key="item.id"
                               :label="item.colorName"
                               :value="item.id" />
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
                               :value="item.id" />
                  </el-select>
                </el-form-item>


                <el-form-item v-if="![6].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.locationId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             @change="changeSalon()"
                             placeholder="Салон">
                    <el-option v-for="item in storages"
                               :key="item.id"
                               :label="item.title"
                               :value="item.id" />
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
                               :value="item.id" />
                  </el-select>
                </el-form-item>

                <el-form-item v-if="[1,2,3,4,5,6,7,8,9].includes(appeal.workflow.workflowLeadType)">
                  <el-select v-model="appeal.workflow.managerId"
                             :clearable="!globalStore.isMobileView"
                             :filterable="!globalStore.isMobileView"
                             placeholder="Ответственный">
                    <el-option v-for="item in managers"
                               :key="item.id"
                               :label="item.fullName"
                               :value="item.id" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>

        <div class="field_left gray-buttons" style="background: none">
          <div style="margin: 17px 0">Источник обращения</div>
          <el-form-item>
            <el-select v-model="appeal.communication.type" class="b_green_source">
              <el-option v-for="item in CommunicationTypes" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="appeal.communication.sourceId">
              <el-option v-for="item in sources" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-select v-model="appeal.communication.city" placeholder="Город" :filterable="!globalStore.isMobileView">
              <el-option v-for="(item, ind) in cities" :key="ind" :label="item" :value="item" />
            </el-select>
          </el-form-item>


          <el-input placeholder="Описание" v-model="appeal.communication.description" />

          <br><br><br>
          <el-button @click="save()">+ Сохранить новое обращение</el-button>
          <br><br>
          <el-button @click="resetForm(form)">Сброс</el-button>
        </div>

        <div>
          <button
            @click="openTodaysModal()"
            style="background: #518468; padding: 0; border: none; cursor:pointer; height: 46px; width: 49px">
            <img alt="" title="Список обращений по дате" src="@/assets/icons/eventTestDriveWhite.png">
          </button>
        </div>

      </div>
    </el-form>

    <ModalParams :listAppeals="listAppeals"
                 :isOpen="isOpen"
                 :tel="appeal.lead.person.phone"
                 @setFoundClient="setFoundClient"
                 @closeModal="closeModal" />
    <TodayListModal ref="todayListModal" />
    <ClientsDirModal ref="clientsDirModal" />
  </main>
</template>
<style>


</style>
<script setup>
import { useGlobalStore } from '@/stores/globalStore'
import { useAppealStore } from '@/stores/appealStore'
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useDesktopStore } from '@/stores/desktopStore'
import { BuyCategoryTypes, CommunicationTypes, EngineType, GearboxType, Years } from '@/utils/globalConstants'
import { emailValidate, formattingPhone, vetRegNumber, weblink } from '@/utils/globalFunctions'
import { saveInLocalStorage, saveUnSaved } from '@/utils/unsavedRequests'
import ModalParams from '@/pages/desktop/ModalParams.vue'
import TodayListModal from '@/pages/desktop/TodayListModal.vue'
import { useDealStore } from '@/stores/dealStore'
import router from '@/router'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import ClientsDirModal from '@/pages/admin/dirs/ClientsDirModal.vue'

const appealStore = useAppealStore()
const dealStore = useDealStore()
const desktopStore = useDesktopStore()
const form = ref(null)
const globalStore = useGlobalStore()
const brands = ref([])
const models = ref([])
const colors = ref([])
const cities = ref([])
const storages = ref([])
const managers = ref([])
const treatmentSources = ref([])
const organizations = ref([])
const isOpen = ref(false)
const listAppeals = ref([])
const WorkflowType = ref('Выкуп')
const isShowEditClient = ref(false)
let Workflows_more = ([
  { id: 2, value: 2, title: 'Выкуп' },
  { id: 8, value: 8, title: 'Комиссия' },
  { id: 1, value: 1, title: 'Продажа' },
  { id: 3, value: 3, title: 'Сервис' },
  { id: 4, value: 4, title: 'КСО' },
  { id: 5, value: 5, title: 'Fleet' },
  { id: 6, value: 6, title: 'Франшиза' },
  { id: 7, value: 7, title: 'Доп.оборуд.' },
  { id: 9, value: 9, title: 'Подбор авто' },
  { id: 10, value: 10, title: 'Сделка через салон' }])

const Workflows = ref(Workflows_more.slice(0, 3))
const todayListModal = ref(null)
const clientsDirModal = ref(null)

function editClient() {
  if (appeal.lead.leadId) clientsDirModal.value.open(appeal.lead.leadId)
}

function moreButtons() {
  if (Workflows.value.length < 4) Workflows.value = Workflows_more
  else Workflows.value = Workflows_more.slice(0, 3)
}

onMounted(() => {
  document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault()  // Стоп! Прерываем действие по умолчанию.
  })
})


let isNeedCheckUnSaved = false
const sources = computed(() => {
  return treatmentSources.value.filter(el => el.parentName && el.communicationType === appeal.communication.type)
})

const appealStart = {
  lead: {
    leadType: 10,
    leadId: 0,
    legalEntity: { name: '' },
    person: { phone: '', email: '', firstName: '', lastName: '', middleName: '' }
  },
  workflow: {
    workflowLeadType: 2,
    auto: { vin: '' },
    swapPhone: '', brandId: null, carModelId: null,
    mileageAuto: null, bodyColorId: '',
    BuyCategory: null,
    yearReleased: null, locationId: null, managerId: null,
    organizationId: null
  },
  communication: {
    type: 10,
    sourceId: null, callType: null, city: 'Казань',
    weblink: '', description: ''
  },
  buyLead: {
    person: { phone: '', firstName: '', lastName: '' }
  }
}

const appeal = reactive(JSON.parse(JSON.stringify(appealStart)))

if (['CallManager', 'LocalCallEmployee'].includes(globalStore.account.role)) {
  Workflows_more = Workflows_more.filter(el => el.title !== 'Франшиза')
  appeal.communication.type = 15
}

globalStore.getBrands().then(res => brands.value = res)
globalStore.getColors().then(res => colors.value = res.items)
globalStore.getOrganizations().then(res => organizations.value = res.items)
globalStore.getPlaces().then(res => {
  cities.value = res.citys
  // places.value = res.items
})


dealStore.getLocations(2).then(res => storages.value = res.data.items)
globalStore.getTreatmentSources().then(res => {
  treatmentSources.value = res.items
})

function changeSalon() {
  desktopStore.getResponsible(appeal.workflow.locationId, appeal.workflow.workflowLeadType).then(res => {
    appeal.workflow.managerId = null
    managers.value = res.items
  })
}

let telRequestList = {}
const telChanged = (value) => {
  value = value.replace(/\D/g, '')
  let t = value.length > 11 ? value.slice(0, -1) : value
  if (t.length < 10) telRequestList = {}
  if (t.length === 11 && !telRequestList[t]) {
    globalStore.isWaiting = true
    telRequestList[t] = true
    if (t[0] === '7') t = '8' + t.slice(1)
    desktopStore.getLeadsByPhone(t).then(res => {
      if (!res.items.length) ElMessage.info('По данному номеру клиента нет')
      globalStore.isWaiting = false
      openPhoneModal(res.items)
    })
  }
}

const setLead = (value) => {
  appeal.lead.legalEntity.id = value.id
  appeal.lead.legalEntity.inn = value.inn
  appeal.lead.legalEntity.name = value.value
  appeal.lead.person = value.person
}

let innTimer = false
const innChanged = (value, cb) => {
  value = value.replace(/\D/g, '')
  if (value.length > 12) value = value.slice(0, 12)
  appeal.lead.legalEntity.inn = value

  clearTimeout(innTimer)
  innTimer = setTimeout(() => {
    appealStore.getInn(value, 20).then(res => {
      if (res && res.models && !res.models.length) {
        ElMessage.info('Не найдено организации с данным ИНН')
        cb(null)
      }
      cb(res.models)
    })
  }, 1000)
}

// показ вариантов кто с телефоном
function openPhoneModal(appeals) {
  listAppeals.value = appeals
  if (appeals.length) isOpen.value = true
}

function openTodaysModal() {
  todayListModal.value.open()
}

const closeModal = () => isOpen.value = false

function setFoundClient(val, appeals) {
  closeModal()
  let findAppeal = appeals.find(el => el.leadId === val.leadId)
  appeal.lead.person.firstName = findAppeal.lead.person.firstName
  appeal.lead.person.middleName = findAppeal.lead.person.middleName
  appeal.lead.person.lastName = findAppeal.lead.person.lastName
  appeal.lead.person.email = findAppeal.lead.person.email
  appeal.lead.leadId = findAppeal.lead.leadId
  isShowEditClient.value = true
}


const changeBrand = id => {
  appeal.workflow.carModelId = null
  id && globalStore.getModels(id).then((res) => models.value = res)
}

const submitForm = formEl => formEl && formEl.validate(valid => !valid)
const resetForm = formEl => {
  formEl && formEl.resetFields()
  Object.assign(appeal, JSON.parse(JSON.stringify(appealStart)))
  isNeedCheckUnSaved && saveUnSaved(cbForEdit)
  isShowEditClient.value = false
}

const changeLeadType = leadType => {
  if (appeal.lead.leadType !== leadType) resetForm()
  appeal.lead.leadType = leadType
}

function changeWorkflow(val) {
  appeal.workflow.workflowLeadType = val.value
  WorkflowType.value = val.title
  if (val.value === 10) appeal.lead.leadType = 10
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
    if (res.brandId) {
      ElMessage.success('Данные авто заполнены')
    }
  }, (err) => {
    link && ElMessage.error('Нет получилось распарсить ссылку', err)
  })
  setTimeout(() => {
    globalStore.isWaiting = false
  }, 400)
}

function checkAndWarning() {
  if (appeal.lead.leadType === 20 && !appeal.lead.legalEntity.name)
    return ElMessage({ message: 'Поле "Название организации" не заполнено', type: 'error' })
  if (!appeal.lead.person.phone && appeal.lead.leadType === 20) return ElMessage({
    message: 'Поле "Основной телефон" не заполнен',
    type: 'error'
  })
  if (!appeal.lead.person.firstName) return ElMessage({ message: 'Поле "Имя" не заполнено', type: 'error' })
  if (appeal.workflow.workflowLeadType === 2 && !appeal.workflow.BuyCategory)
    return ElMessage({ message: 'Поле "Вид выкупа" не заполнено', type: 'error' })
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
        Person: appeal.lead.person
      },
      Appeal: { ResponsibleId: appeal.workflow.managerId },
      LeadType: appeal.lead.leadType
    }

    if (!navigator.onLine) {
      saveInLocalStorage('desktopStore.saveAppealComission', commission).then(() => resetForm(form.value))
      return false
    }

    desktopStore.saveAppealComission(commission).then(res => {
      if (res.status === 200) {
        router.push({ path: '/appeal/commission' + res.data.id }) // открываем после сохранения
      } else {
        ElMessage({
          duration: 0,
          message: 'Ошибка. Данные не сохранились. Не доработано. ' + res.message,
          type: 'error'
        })
      }
      isNeedCheckUnSaved && saveUnSaved(cbForEdit)
    })
  } else if (appeal.workflow.workflowLeadType === 10) { // сделка через салон
    let deal = {
      buyLead: {
        leadId: appeal.buyLead.leadId,
        person: appeal.buyLead.person,
        treatmentSourceId: 2
      },
      locationId: appeal.workflow.locationId,
      sellLead: {
        leadId: appeal.lead.leadId,
        person: appeal.lead.person,
        treatmentSourceId: 2
      },
      treatmentSourceId: appeal.communication.sourceId
    }
    if (!navigator.onLine) {
      saveInLocalStorage('desktopStore.saveAppealSalon', deal).then(() => resetForm(form.value))
      return false
    }

    desktopStore.saveAppealSalon(deal).then(res => {
      if (res.status === 200) {
        router.push({ path: '/appeal/salon-deal/' + res.data.id })
      } else {
        ElMessage({
          duration: 0,
          message: 'Ошибка. Данные не сохранились. Не доработано. ' + res.message,
          type: 'error'
        })
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
        router.push({ path: '/appeal/' + res.data.id })
      } else {
        ElMessage({ message: 'Ошибка сохранения. ' + res.message, type: 'error' })
      }
      isNeedCheckUnSaved && saveUnSaved(cbForEdit)
    })
  }
}

function getAutoWithVIN() {
  if (appeal.workflow.auto.vin.length !== 17) return false
  globalStore.isWaiting = true
  desktopStore.getAutoVIN(appeal.workflow.auto.vin).then(el => {
    if (el.vin) ElMessage({ message: 'Автомобиль с таким Vin найден в системе.', type: 'success' })
    else if (appeal.workflow.auto.vin.length === 17) ElMessage({ message: 'Новый Vin', type: 'info' })
    globalStore.isWaiting = false
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (howMuchIsLeft) globalStore.setTitle('Несохраненных: ' + howMuchIsLeft)
  else globalStore.setTitle('Новое обращение')
  isNeedCheckUnSaved = !!howMuchIsLeft
  if (fromLocalStorage) Object.assign(appeal, JSON.parse(JSON.stringify(fromLocalStorage)))
}

saveUnSaved(cbForEdit)

</script>