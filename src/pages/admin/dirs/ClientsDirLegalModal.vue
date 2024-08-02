<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 930"
            :top="40"
            :title="title"
            :subtitle="subtitle"
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'640px'">

      <div class="modal-fields">
        <el-form ref="form" :model="legal" class="error-to-message">
          <small class="line">
            <span class="label l_150">Источник</span>

            <el-form-item prop="treatmentSourceId"
                          style="display: inline-block; width: 420px"
                          :rules="{required: true, message: 'Источник', trigger: ['change']}">
              <el-select v-model="legal.treatmentSourceId" placeholder="Выберите источник">
                <el-option-group
                    v-for="group in treatmentsGroup"
                    :key="group.id"
                    :label="group.name"
                >
                  <el-option
                      v-for="item in group.groups"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
          </small>

          <hr>


          <small class="label-right l_150">Наименование</small>
          <el-form-item prop="name"
                        style="display: inline-block; width: 200px; margin: 0 !important;"
                        :rules="{required: true, message: 'Наименования', trigger: ['change']}">
            <el-input v-model="legal.name" />
          </el-form-item>

          <small class="label-right l_150">Тип организации</small>
          <el-select
            style="width: 220px"
            v-model="legal.typeCompany"
            filterable>
            <el-option v-for="item in typesCompanies" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>
          <br>


          <small class="label-right l_150">
            <span title="по ИНН можно найти организацию из базы" style="color:white; cursor: pointer">⇶</span>
            ИНН </small>
          <el-form-item prop="inn"
                        style="display: inline-block; width: 200px; margin: 0 !important;"
                        :rules="{required: true, message: 'ИНН', trigger: ['change']}">
            <el-input v-model="legal.inn" @input="inpInn()"/>
          </el-form-item>

          <small class="label-right l_150">Тип юр.лица</small>
          <el-select
            style="width: 220px"
            v-model="legal.typeLegal"
            filterable>
            <el-option v-for="item in typesLegal" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>
          <br>

          <div v-if="legal.typeCompany!==5">
            <small class="label-right l_150">КПП</small>
            <el-input v-model="legal.kpp"/>

            <small class="label-right l_150">ОГРН</small>
            <el-input v-model="legal.psrn"/>
          </div>

          <small class="label-right l_150">Адрес регистрации</small>
          <el-autocomplete
              :title="legal.registrationAddress.fias.value"
              style="width: 200px"
              v-model="legal.registrationAddress.fias.value"
              :fetch-suggestions="getFiasByName"
              clearable
              placeholder="Введите адрес"
              @select="addressSelect"
          />
          <small class="label-right l_150">Почтовый адрес</small>
          <el-autocomplete
              :title="legal.postAddress.fias.value"
              style="width: 200px"
              v-model="legal.postAddress.fias.value"
              :fetch-suggestions="getFiasByName"
              clearable
              placeholder="Введите адрес"
              @select="addressSelect2"
          />

          <br>
          <small class="label-right l_150">Телефон</small>
          <el-form-item prop="phone"
                        style="display: inline-block; width: 200px; margin: 0 !important;"
                        :rules="{required: true, message: 'Телефон', trigger: ['change']}">
            <el-input placeholder="Телефон" title="Телефон"
                      :formatter="(value) =>value && formattingPhone(value, (val)=>legal.phone=val)"
                      v-model="legal.phone" />
          </el-form-item>

          <small class="label-right l_150">Email</small>
          <el-input placeholder="Email"
                    clearable
                    @change="emailValidate(legal.email)"
                    title="Email" v-model="legal.email"/>


          <small class="label-right l_100">НДС</small>
          <el-checkbox v-model="legal.nds"/>




          <hr>
          <br>
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 380px">
              <small>&nbsp; &nbsp; Ответственное лицо </small> <br>
              <div class="nowrap">
                <small class="label l_100">Фамилия</small>
                <el-form-item prop="person['lastName']"
                              style="display: inline-block; width: 220px;margin-bottom: 0 !important "
                              :rules="{required: true, message: 'Фамилия', trigger: ['change']}">
                  <el-input placeholder="Фамилия" title="Фамилия" v-model="legal.person.lastName"/>
                </el-form-item>
              </div>

              <div class="nowrap">
                <small class="label l_100">Имя</small>
                <el-form-item prop="person['firstName']"
                              style="display: inline-block; width: 220px; margin-bottom: 0 !important"
                              :rules="{required: true, message: 'Имя', trigger: ['change']}">
                  <el-input placeholder="Имя" title="Имя" v-model="legal.person.firstName"/>
                </el-form-item>
              </div>

              <div class="nowrap">
                <small class="label l_100">Отчество</small>
                <el-input placeholder="Отчество" title="Отчество" v-model="legal.person.middleName"/>
              </div>

              <div class="nowrap">
                <small class="label l_100">Телефон</small>
                <el-form-item prop="person.phone"
                              style="display: inline-block; width: 200px; margin: 0 !important;"
                              :rules="{required: true, message: 'Телефон', trigger: ['change']}">
                  <el-input placeholder="Телефон" title="Телефон"
                            :formatter="(value) =>value && formattingPhone(value, (val)=>legal.person.phone=val)"
                            v-model="legal.person.phone"/>
                </el-form-item>
              </div>

              <div class="nowrap">
                <small class="label l_100">Должность</small>
                <el-select
                    style="width: 200px; margin-right: 12px;"
                    v-model="legal"
                    filterable
                    clearable>
                  <el-option v-for="item in documentTypes" :key="item.value" :label="item.title"
                             :value="item.value"/>
                </el-select>
              </div>

              <div class="line" v-if="legal.person.registrationAddress">
                <label>Адрес регистрации</label>
                <el-input placeholder="Адрес регистрации" v-model="legal.person.registrationAddress.text"/>
              </div>

              <div class="line" v-if="legal.person.homeAddress">
                <label>Фактический адрес</label>
                <el-input placeholder="Фактический адрес" v-model="legal.person.homeAddress.text"/>
              </div>
            </div>

            <el-tabs :style="{width:globalStore.isMobileView?'330px': '520px'}"
                     type="border-card" v-model="activeName">
              <el-tab-pane label="Банковский счет" :maxHeight="250" name="first">
                <el-scrollbar :maxHeight="250">
                  <div class="line" style="margin-bottom:10px;flex-direction: column;">
                    <el-button type="info" @click="addBank()" :icon="Plus">Добавить расчетный счет</el-button>
                  </div>

                  <div v-if="legal.bills && legal.bills.length">
                    <div v-for="(bill, index) in legal.bills" :key="bill.id">
                      <div v-if="!bill.deleted">
                        <div>
                          <small class="label" style="min-width: 150px">Банк</small>
                          <el-select
                              style="width: 300px; margin: 0 12px;"
                              placeholder="Выберите банк"
                              v-model="bill.bankId"
                              filterable
                              @change="changeBank(bill.bankId, index)"
                              clearable>
                            <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id"/>
                          </el-select>
                        </div>

                        <div>
                          <small class="label"  style="min-width: 150px">Филиал</small>
                          <el-select
                              placeholder="Выберите филиал"
                              style="width: 300px; margin: 0 12px;"
                              v-model="bill.bankItemId"
                              filterable
                              clearable>
                            <el-option v-for="item in banksFilials[bill.bankId]" :key="item.id" :label="item.name" :value="item.id"/>
                          </el-select>
                        </div>

                        <div>
                          <small class="label"  style="min-width: 150px; margin-right: 25px">Расчетный счет </small>
                          <el-input maxlength="20" v-model="bill.operatingAccount"/>
                          <el-button  @click="deleteBank(bill)">
                            Удалить
                          </el-button>
                        </div>
                        <hr>
                      </div>
                    </div>

                  </div>
                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>


          </div>
        </el-form>
        <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
          <el-button type="info" @click="showHistory()" title="История изменений">⟲</el-button>
        </span>
      </div>
    </el-scrollbar>
  </AppModal>
  <ClientsDirModal_History ref="сlientsDirModal_History"/>
</template>

<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {computed, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {checkEmptyFields, emailValidate, formattingPhone, simplePhone, getFiasByName} from '@/utils/globalFunctions'
import ClientsDirModal_History from "@/pages/admin/dirs/ClientsDirModal_History.vue";
import {ElMessage} from "element-plus";

const globalStore = useGlobalStore()
const isOpen = ref(false)
const clientInit = {
  bills: [],
  person: {},
  postAddress: { fias: {} },
  registrationAddress: { fias: {} },
  treatmentSource: {}
}
const legal = ref(JSON.parse(JSON.stringify(clientInit)))
const closeModal = () => isOpen.value = false
const title = ref('')
const сlientsDirModal_History = ref(null)
const adminStore = useAdminStore()
const treatmentsGroup = ref([])
const departments = ref([])
const form = ref(null)
const banks = ref([])
const isDocemtntIsAdded = ref(false)
const clientDocuments = ref([])
const documentTypes = ref([])
const activeName = ref('first')
let cb;
let cachINN = {}
let timerInn = null
const subtitle = computed(() => {
  return 'Организация : ' + (legal.value.typeOfCompanyTitle||'') + ' ' + (legal.value.name||'')
})
const typesCompanies = ref([])
const typesLegal = ref([])
const banksFilials = ref({})

function addressSelect(adr: { value: string, fias_id: number }) {
  legal.value.registrationAddress.fias = {
    value: adr.value,
    fiasId: adr.fias_id
  }
}

function addressSelect2(adr: { value: string, fias_id: number }) {
  legal.value.postAddress.fias = {
    value: adr.value,
    fiasId: adr.fias_id
  }
}

function changeBank(id, index) {
  if (index !== undefined) {
    legal.value.bills[index].bankItemId = null
  }

  adminStore.getBankFilials(id).then(res => banksFilials.value[id] = res.items)
}

function addDocument() {
  isDocemtntIsAdded.value = true
  clientDocuments.value.unshift({number: '', serial: '', type: 40, issueDate: new Date()})
}

function addBank() {
  legal.value.bills.unshift({bankItemId: null, bankId: null})
}

function deleteBank(bank: any) {
  legal.value.bills = legal.value.bills.filter(el => !(el.bankId === bank.bankId && el.bankItemId === bank.bankItemId))
  if (legal.value.bills.length === 0) addBank()
}

function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true
  title.value = 'Создание нового юр.лица'
  if (!row) legal.value = clientInit
  else adminStore.getLegal(row.leadId).then(res => {
    legal.value = res.data.item
    title.value = 'Редактирование юридического лица'

    if (legal.value.bills) legal.value.bills.forEach(bank => changeBank(bank.bankId))
  })


  globalStore.getTreatments().then(res => {
    treatmentsGroup.value = res.items.filter(el => !el.parentName)
    treatmentsGroup.value.map(el => {
      el.groups = []
      res.items.forEach(item => {
        if (item.parentName === el.name) el.groups.push(item)
      })
    })
  })


  adminStore.getDepartments().then(res => departments.value = res.items)
  adminStore.getBanks().then(res => banks.value = res.items)
  row && adminStore.getClientDocunets(row.person ? row.person.id : row.lead.person.personId)
      .then(res => clientDocuments.value = res.items)
  adminStore.getDocumentTypes().then(res => documentTypes.value = res.items)


  // globalStore.getTreatmentSources().then(res => treatmentSources.value = res.items)
  globalStore.getTypeCompanies().then(res => typesCompanies.value = res.items)
  globalStore.getTypesLegal().then(res => typesLegal.value = res.items)
  // globalStore.getPositions().then(res => positions.value = res.items)
}

function showHistory() {
  сlientsDirModal_History.value.open('юр.лица', legal.value.id, 'Организация : ' +
    legal.value.typeOfCompanyTitle + ' ' + legal.value.name, 'getLegalHistory')
}

function inpInn() {
  if (legal.value.inn.length < 10) return false
  legal.value.inn = legal.value.inn.slice(0, 10)

  clearInterval(timerInn)
  timerInn = setTimeout(() => {
    if (cachINN[legal.value.inn] !== undefined) fill(cachINN[legal.value.inn])
    else globalStore.getLegalByInn(legal.value.inn).then(res => {
      fill(res.data)
      cachINN[legal.value.inn] = res.data
    })
  }, 200)
}

function fill(data) {
  if (data) {
    legal.value.inn = data.inn
    legal.value.kpp = data.kpp
    legal.value.psrn = data.psrn
    legal.value.name = data.name
    legal.value.typeCompany = data.typeCompany
    legal.value.leadId = data.leadId

    if (legal.value.registrationAddress.fias == null) legal.value.registrationAddress.fias = {}
    legal.value.registrationAddress.fias.value = data.registrationAddress.fias.value
    legal.value.registrationAddress.fias.fiasId = data.registrationAddress.fias.fiasId

    if (legal.value.postAddress.fias == null) legal.value.postAddress.fias = {}
    legal.value.postAddress.fias.value = data.postAddress.fias.value
    legal.value.postAddress.fias.fiasId = data.postAddress.fias.fiasId

    legal.value.person.lastName = data.person.lastName
    legal.value.person.firstName = data.person.firstName
    legal.value.person.middleName = data.person.middleName
    legal.value.person.phone = data.person.phone
    legal.value.positionType = data.positionType
    legal.value.nds = data.nds
    legal.value.phone = data.phone
    legal.value.typeLegal = data.typeLegal
    legal.value.treatmentSourceId = data.treatmentSourceId
    legal.value.email = data.email
  } else {
    legal.value = JSON.parse(JSON.stringify(clientInit))
  }
}


function save() {
  checkEmptyFields(form.value).then(noErr => {

    if (!noErr) return false

    if (legal.value.email == '') legal.value.email = null
    if (legal.value.phone == '') legal.value.phone = null
    if (legal.value.kpp == '') legal.value.kpp = null
    if (legal.value.ogrnip == '') legal.value.ogrnip = null
    legal.value.phone = simplePhone(legal.value.phone)
    legal.value.person.phone = simplePhone(legal.value.person.phone)
    legal.value.bills = legal.value.bills.filter(bank => bank.operatingAccount)

    globalStore.saveLegal(legal.value).then(res => {
      if (res.status === 200) {
        ElMessage({ message: 'Данные юр.лица успешно сохранены', type: 'success' })
        isOpen.value = false
        legal.value = clientInit
        cb && cb()
      }
    })
  })
}

defineExpose({open})


</script>