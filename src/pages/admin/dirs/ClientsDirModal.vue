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
        <el-form ref="form" :model="client" class="error-to-message">
          <small class="line">
            <label>Источник</label>

            <el-form-item prop="treatmentSourceId"
                          style="display: inline-block; width: 420px"
                          :rules="{required: true, message: 'Источник', trigger: ['change']}">
              <el-select v-model="client.treatmentSourceId" placeholder="Выберите источник">
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
          <el-input placeholder="Фамилия" title="Фамилия" v-model="client.person.lastName"/>


          <el-form-item prop="person['firstName']"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Имя', trigger: ['change']}">
            <el-input placeholder="Имя" title="Имя" v-model="client.person.firstName"/>
          </el-form-item>
          <el-input placeholder="Отчество" title="Отчество" v-model="client.person.middleName"/>

          <span><small style="padding: 0 24px">Пол: </small><el-select
              placeholder="Пол"
              v-model="client.person.gender"
              style="width:160px"
          >
                  <el-option v-for="item in [{id:10, name:'мужской'}, {id:20, name:'женский'}]" :key="item.id"
                             :label="item.name" :value="item.id"/>
              </el-select>
           </span>

          <el-input placeholder="Email"
                    @change="emailValidate(client.person.email)"
                    title="Email" v-model="client.person.email"/>
          <el-input placeholder="Телефон" title="Телефон"
                    :formatter="(value) =>value && formattingPhone(value, (val)=>client.person.phone=val)"
                    v-model="client.person.phone"/>
          <el-input placeholder="Доп.телефон" title="Доп.телефон"
                    :formatter="(value) =>value && formattingPhone(value, (val)=>client.person.phone2=val)"
                    v-model="client.person.phone2"/>


          <span><small style="padding: 0 24px">День/р.:</small>
             <el-date-picker
                 style="width: 150px; overflow: hidden"
                 placeholder="День рождения" title="День рождения"
                 v-model="client.person.dateOfBirth"/>
           </span>

          <hr>
          <br>
          <div style="display: flex">
            <div>
              <small class="line">
                <label>Место рождения</label>
                <el-input v-model="client.person.placeOfBirth"/>
              </small>

              <small class="line">
                <label> Ссылка на соц.сети</label>
                <el-input v-model="client.person.socialNetworksAddress"/>
              </small>

              <small class="line">
                <label>ИНН (физ. лица)</label>
                <el-input placeholder="ИНН" v-model="client.person.inn"/>
              </small>

              <small>
                <label>Согласие на обработку персональных данных</label> &nbsp;
                <el-checkbox v-model="client.person.personalDataAgree"/>
              </small><br>

              <small>
                <label>Согласие на получение смc</label> &nbsp;
                <el-checkbox v-model="client.person.smsReceivingAgree"/>
              </small>

              <div class="line" v-if="client.person.registrationAddress">
                <label>Адрес регистрации</label>
                <el-input placeholder="Адрес регистрации" v-model="client.person.registrationAddress.text"/>
              </div>

              <div class="line" v-if="client.person.homeAddress">
                <label>Фактический адрес</label>
                <el-input placeholder="Фактический адрес" v-model="client.person.homeAddress.text"/>
              </div>
            </div>

            <el-tabs style="width: 100%" type="border-card" v-model="activeName">
              <el-tab-pane label="Документы" name="first">
                <el-scrollbar :maxHeight="250" style="width: 100%">
                  <div class="line" style="margin-bottom:10px;flex-direction: column;" v-if="!isDocemtntIsAdded">
                    <el-button type="info" @click="addDocument()" :icon="Plus">Добавить документ</el-button>
                  </div>

                  <div v-if="clientDocuments && clientDocuments.length">
                    <div v-for="doc in clientDocuments" :key="doc.id"
                         :style="{'fontWeight': !doc.number?'600':''}">
                      <div v-if="!doc.deleted">
                        <div class="line">
                          <label style="min-width: 150px">Тип документа</label>
                          <el-select
                              style="width: 200px; margin: 0 12px;"
                              placeholder=""
                              v-model="doc.type"
                              filterable
                              clearable>
                            <el-option v-for="item in documentTypes" :key="item.value" :label="item.title"
                                       :value="item.value"/>
                          </el-select>
                          <span style="cursor: pointer" title="Удалить" @click="deleteDocument(doc)">✖</span>
                        </div>

                        <div class="line">
                          <label style="min-width: 150px">Серия</label>
                          <el-input maxlength="20"
                                    v-model="doc.serial"/>
                        </div>

                        <div class="line">
                          <label style="min-width: 150px">Номер</label>
                          <el-input maxlength="20"
                                    v-model="doc.number"/>

                        </div>

                        <div class="line">
                          <label style="min-width: 150px">Дата выдачи</label>
                          <el-date-picker
                              placeholder="" title="День рождения"
                              v-model="doc.issueDate"/>
                        </div>
                        <hr>
                      </div>
                    </div>

                  </div>
                </el-scrollbar>

              </el-tab-pane>
              <el-tab-pane label="Банковский счет" :maxHeight="250">
                <el-scrollbar :maxHeight="250" style="width: 100%">
                  <div class="line" style="margin-bottom:10px;flex-direction: column;" v-if="!isBankIsAdded">
                    <el-button type="info" @click="addBank()" :icon="Plus">Добавить расчетный счет</el-button>
                  </div>

                  <div v-if="client.bills && client.bills.length">
                    <div v-for="bill in client.bills" :key="bill.id"
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
import {ElMessage} from "element-plus";
import { emailValidate, formattingPhone, checkEmptyFields, simplePhone } from '@/utils/globalFunctions'
import ClientsDirModal_History from "@/pages/admin/dirs/ClientsDirModal_History.vue";

const globalStore = useGlobalStore()
const isOpen = ref(false)
const clientInit = {
  person: {firstName: '', middleName: '', lastName: ''},
}
const client = ref(clientInit)
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
  if (client.value.person.firstName) fio += client.value.person.firstName + ' '
  if (client.value.person.middleName) fio += client.value.person.middleName + ' '
  if (client.value.person.lastName) fio += client.value.person.lastName + ' '
  return fio || 'Новый  пользователь'
})


function bankChanged(id) {
  adminStore.getBankFilials(id).then(res => filials.value = res.items)
}

function addDocument() {
  isDocemtntIsAdded.value = true
  clientDocuments.value.unshift({number: '', serial: '', type: 40, issueDate: new Date()})
}

function addBank() {
  isBankIsAdded.value = true
  client.value.bills.unshift({personalAccount: '', bankItemId: null, bankId: null})
}

function deleteBank(bill) {
  client.value.bills.map(el => {
    if (el.personalAccount === bill.personalAccount) el.deleted = true
  })
}

function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true
  isBankIsAdded.value = false
  title.value = 'Создание нового пользователя'
  if (!row) client.value = clientInit
  else adminStore.getClientForModal(row.leadId).then(res => {

    client.value = res.item
    title.value = 'Редактирование клиента'
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
}

function showHistory() {
  modalHistory.value.open(client.value)
}


function checking() {
  if (!client.value.person.lastName) {
    return ElMessage({message: 'Поле "Фамилия" обязателен для заполнения', type: 'warning'})
  }
  if (!client.value.person.firstName) {
    return ElMessage({message: 'Поле "Имя" обязателен для заполнения', type: 'warning'})
  }
}


function save() {
  checkEmptyFields(form.value).then(noErr => {

    if (!noErr) return false

    client.value.person.phone = simplePhone(client.value.person.phone)

    adminStore.saveClient(client.value).then((res) => {
      if (res.code === "ERR_BAD_REQUEST") {
        ElMessage({ message: res.response.data.errorText, type: 'error', duration: 7000 })
        return false
      }

      ElMessage({ message: 'Успешно', type: 'success' })
      isOpen.value = false
      client.value = clientInit
      cb()
    })
  })
}

defineExpose({open})


</script>