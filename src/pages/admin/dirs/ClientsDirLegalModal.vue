<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 930"
            :top="40"
            :title="title"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">

      <div class="modal-fields">
        <el-form ref="form" :model="legal" class="error-to-message">
          <small class="line">
            <label>Источник</label>

            <el-form-item prop="typeLegal"
                          style="display: inline-block; width: 420px"
                          :rules="{required: true, message: 'Источник', trigger: ['change']}">
              <el-select v-model="legal.typeLegal" placeholder="Выберите источник">
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


          <small class="label-right l_150">Наименование организации</small>
          <el-input v-model="legal.name"/>

          <small class="label-right l_150">ИНН</small>
          <el-input v-model="legal.inn" @input="inpInn()"/>
          <br>

          <small class="label-right l_150">Тип юр.лица</small>
          <el-select
              style="width: 220px"
              v-model="legal.typeLegal"
              filterable>
            <el-option v-for="item in typesLegal" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>

          <small class="label-right l_150">Тип организации</small>
          <el-select
              style="width: 220px"
              v-model="legal.typeCompany"
              filterable>
            <el-option v-for="item in typesCompanies" :key="item.value" :label="item.title" :value="item.value"/>
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
              :fetch-suggestions="querySearch"
              clearable
              placeholder="Введите адрес"
              @select="addressSelect"
          />
          <small class="label-right l_150">Почтовый адрес</small>
          <el-autocomplete
              :title="legal.postAddress.fias.value"
              style="width: 200px"
              v-model="legal.postAddress.fias.value"
              :fetch-suggestions="querySearch"
              clearable
              placeholder="Введите адрес"
              @select="addressSelect2"
          />

          <br>
          <small class="label-right l_150">Телефон</small>
          <el-input placeholder="Телефон" title="Телефон"
                    :formatter="(value) =>value && formattingPhone(value, (val)=>legal.phone=val)"
                    v-model="legal.phone"/>

          <small class="label-right l_150">Email</small>
          <el-input placeholder="Email"
                    clearable
                    @change="emailValidate(legal.email)"
                    title="Email" v-model="legal.email"/>


          <small class="label-right l_100">НДС</small>
          <el-checkbox v-model="legal.nds"/>




          <hr>
          <br>
          <div style="display: flex">
            <div style="width: 100%">
              <small>Ответственное лицо </small> <br>
              <div class="nowrap">
                <small class="label l_200">Фамилия</small>
                <el-form-item prop="person['lastName']"
                              style="display: inline-block; width: 220px;margin-bottom: 0 !important "
                              :rules="{required: true, message: 'Фамилия', trigger: ['change']}">
                  <el-input placeholder="Фамилия" title="Фамилия" v-model="legal.person.lastName"/>
                </el-form-item>
              </div>

              <div class="nowrap">
                <small class="label l_200">Имя</small>
                <el-form-item prop="person['firstName']"
                              style="display: inline-block; width: 220px; margin-bottom: 0 !important"
                              :rules="{required: true, message: 'Имя', trigger: ['change']}">
                  <el-input placeholder="Имя" title="Имя" v-model="legal.person.firstName"/>
                </el-form-item>
              </div>

              <div class="nowrap">
                <small class="label l_200">Отчество</small>
                <el-input placeholder="Отчество" title="Отчество" v-model="legal.person.middleName"/>
              </div>

              <div class="nowrap">
                <small class="label l_200">Телефон</small>
                <el-input placeholder="Телефон" title="Телефон"
                          :formatter="(value) =>value && formattingPhone(value, (val)=>legal.person.phone=val)"
                          v-model="legal.person.phone"/>
              </div>

              <div class="nowrap">
                <small class="label l_200">Должность</small>
                <el-select
                    style="width: 200px; margin: 0 12px;"
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

            <el-tabs style="width: 100%" type="border-card" v-model="activeName">
              <el-tab-pane label="Банковский счет" :maxHeight="250" name="first">
                <el-scrollbar :maxHeight="250" style="width: 100%">
                  <div class="line" style="margin-bottom:10px;flex-direction: column;" v-if="!isBankIsAdded">
                    <el-button type="info" @click="addBank()" :icon="Plus">Добавить расчетный счет</el-button>
                  </div>

                  <div v-if="legal.bills && legal.bills.length">
                    <div v-for="bill in legal.bills" :key="bill.id"
                         :style="{'fontWeight': !bill.personalAccount?'600':''}">
                      <div v-if="!bill.deleted">
                        <div class="line">
                          <label style="min-width: 150px">Банк</label>
                          <el-select
                              style="width: 200px; margin: 0 12px;"
                              placeholder=""
                              v-model="bill.bankId"
                              filterable
                              @change="bankChanged(bill.bankId)"
                              clearable>
                            <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id"/>
                          </el-select>
                        </div>

                        <div class="line">
                          <label style="min-width: 150px">Филиал</label>
                          <el-select
                              placeholder=""
                              style="width: 200px; margin: 0 12px;"
                              v-model="bill.bankItemId"
                              filterable
                              clearable>
                            <el-option v-for="item in filials" :key="item.id" :label="item.name" :value="item.id"/>
                          </el-select>
                        </div>

                        <div class="line">
                          <label style="min-width: 150px">Расчетный счет</label>
                          <el-input maxlength="20"
                                    v-model="bill.personalAccount"/>
                          <span style="cursor: pointer" title="Удалить" @click="deleteBank(bill)">✖</span>
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
  <ClientsDirModal_History ref="modalHistory"/>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {computed, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {checkEmptyFields, emailValidate, formattingPhone} from '@/utils/globalFunctions'
import ClientsDirModal_History from "@/pages/admin/dirs/ClientsDirModal_History.vue";

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
const modalHistory = ref(null)
const adminStore = useAdminStore()
const treatmentsGroup = ref([])
const departments = ref([])
const form = ref(null)
const banks = ref([])
const filials = ref([])
const isDirty = ref(false)
const isBankIsAdded = ref(false)
const isDocemtntIsAdded = ref(false)
const clientDocuments = ref([])
const documentTypes = ref([])
const activeName = ref('first')
let cb;
const subtitle = computed(() => {
  let fio = ''
  if (legal.value.person.firstName) fio += legal.value.person.firstName + ' '
  if (legal.value.person.middleName) fio += legal.value.person.middleName + ' '
  if (legal.value.person.lastName) fio += legal.value.person.lastName + ' '
  return fio || 'Новое юр.лицо'
})
const typesCompanies = ref([])
const typesLegal = ref([])


function bankChanged(id) {
  adminStore.getBankFilials(id).then(res => filials.value = res.items)
}

function addDocument() {
  isDocemtntIsAdded.value = true
  clientDocuments.value.unshift({number: '', serial: '', type: 40, issueDate: new Date()})
}

function addBank() {
  isBankIsAdded.value = true
  legal.value.bills.unshift({personalAccount: '', bankItemId: null, bankId: null})
}

function deleteBank(bill) {
  legal.value.bills.map(el => {
    if (el.personalAccount === bill.personalAccount) el.deleted = true
  })
}

function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true
  isBankIsAdded.value = false
  title.value = 'Создание нового юр.лица'
  if (!row) legal.value = clientInit
  else adminStore.getLegal(row.leadId).then(res => {

    console.log('res = ', res)

    legal.value = res.data.item
    title.value = 'Редактирование юридического лица'
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
  adminStore.getBanks().then(res => banks.value = res.result)
  row && adminStore.getClientDocunets(row.person ? row.person.id : row.lead.person.personId)
      .then(res => clientDocuments.value = res.items)
  adminStore.getDocumentTypes().then(res => documentTypes.value = res.items)


  // globalStore.getTreatmentSources().then(res => treatmentSources.value = res.items)
  globalStore.getTypeCompanies().then(res => typesCompanies.value = res.items)
  globalStore.getTypesLegal().then(res => typesLegal.value = res.items)
  // globalStore.getPositions().then(res => positions.value = res.items)
}

function showHistory() {
  modalHistory.value.open(legal.value)
}

function inpInn() {
  if (legal.value.inn.length < 10) return false
  legal.value.inn = legal.value.inn.slice(0, 10)

  clearInterval(timerInn)
  timerInn = setTimeout(() => {
    if (cachINN[legal.value.inn] !== undefined) fill(cachINN[legal.value.inn])
    else globalStore.getByInn(legal.value.inn).then(res => {
      fill(res.data)
      cachINN[legal.value.inn] = res.data
    })
  }, 200)
}


function save() {
  checkEmptyFields(form.value).then(noErr => {

    if (!noErr) return false

    // legal.value.person.phone = simplePhone(legal.value.person.phone)
    // if (legal.value.person.phone2) legal.value.person.phone2 = simplePhone(legal.value.person.phone2)
    //
    // adminStore.saveClient(legal.value).then(res => {
    //   if (res.status === 200) {
    //     ElMessage({message: 'Данные клиента успешно сохранены', type: 'success'})
    //     isOpen.value = false
    //     legal.value = clientInit
    //     cb && cb()
    //   }
    // })
  })
}

defineExpose({open})


</script>