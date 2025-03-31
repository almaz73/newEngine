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
            <span class="label l_150">Источник</span>

            <el-form-item prop="treatmentSourceId"
                          style="display: inline-block; width: 420px"
                          :rules="{required: true, message: 'Источник', trigger: ['change']}">
              <el-select v-model="client" placeholder="Выберите источник">
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
          <el-form-item prop="person.lastName"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Фамилия', trigger: ['change']}">
            <el-input placeholder="Фамилия" title="Фамилия" v-model="client.person.lastName"/>
          </el-form-item>


          <el-form-item prop="person.firstName"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Имя', trigger: ['change']}">
            <el-input placeholder="Имя" title="Имя" v-model="client.person.firstName"/>
          </el-form-item>
          <el-input placeholder="Отчество" title="Отчество" v-model="client.person.middleName"/>

          <span><small style="padding: 0 24px">Пол: </small><el-select
              placeholder="Выберите пол"
              v-model="client.person.gender"
              style="width:160px"
          >
                  <el-option v-for="item in [{id:0, name:' '}, {id:10, name:'мужской'}, {id:20, name:'женский'}]" :key="item.id"
                             :label="item.name" :value="item.id"/>
              </el-select>
           </span>

          <el-input placeholder="Email"
                    @change="emailValidate(client.person.email)"
                    title="Email" v-model="client.person.email"/>
          &nbsp;&nbsp;
<!--          <el-input placeholder="Телефон" title="Телефон"-->
<!--                    :formatter="(value) =>value && formattingPhone(value, (val)=>client.person.phone=val)"-->
<!--                    v-model="client.person.phone"/>-->

          <el-form-item prop="person.phone"
                        style="display: inline-block; width: 200px; margin: 0 !important;"
                        :rules="{required: true, message: 'Телефон', trigger: ['change']}">
            <el-input placeholder="Телефон" title="Телефон"
                      :formatter="(value) =>value && formattingPhone(value, (val)=>client.person.phone=val)"
                      v-model="client.person.phone" />
          </el-form-item>


          &nbsp;&nbsp;
          <el-input placeholder="Доп.телефон" title="Доп.телефон"
                    :formatter="(value) =>value && formattingPhone(value, (val)=>client.person.phone2=val)"
                    v-model="client.person.phone2"/>


          <span><small style="padding: 0 24px">Д/р.:</small>
             <el-date-picker
                 style="width: 150px; overflow: hidden"
                 clearable
                 placeholder="День рождения" title="День рождения"
                 v-model="client.person.dateOfBirth"/>
           </span>


          <hr>
          <br>
          <div style="display: flex; flex-wrap: wrap">
            <div style="width: 380px">

              <div class="nowrap">
                <small class="label l_100">Место рождения</small>
                <el-input v-model="client.person.placeOfBirth"/>
              </div>

              <small class="nowrap">
                <small class="label l_100">Ссылка на соц.сети</small>
                <el-input v-model="client.person.socialNetworksAddress"/>
              </small>

              <small class="nowrap">
                <small class="label l_100">ИНН (физ. лица)</small>
                <el-input placeholder="ИНН"
                          maxlength="20"
                          minlength="20"
                          v-model="client.person.inn"/>
              </small>


              <el-checkbox v-model="client.person.personalDataAgree"
                           label="Согласие на обработку персональных данных" />

              <el-checkbox v-model="client.person.smsReceivingAgree" label="Согласие на получение смc" />


              <div class="line" v-if="client.person.registrationAddress">
                <small class="label l_100">Адрес регистрации</small>
                <el-autocomplete
                  :title="client.person.registrationAddress.fias.value"
                  style="width: 200px"
                  v-model="client.person.registrationAddress.fias.value"
                  :fetch-suggestions="getFiasByName"
                  clearable
                  placeholder="Введите адрес"
                  @select="addressSelect"
                />
              </div>

              <small v-if="client.person.homeAddress">
                <small class="label l_100">Фактический адрес</small>
                <el-autocomplete
                  :title="client.person.homeAddress.fias.value"
                  style="width: 200px"
                  v-model="client.person.homeAddress.fias.value"
                  :fetch-suggestions="getFiasByName"
                  clearable
                  placeholder="Введите адрес"
                  @select="addressSelect2"
                />
              </small>

            </div>

            <el-tabs :style="{width:globalStore.isMobileView?'330px': '520px'}"
                     @tabChange="tabChosen()"
                     type="border-card" v-model="activeName">
              <el-tab-pane label="Документы" name="first">
                <el-scrollbar :maxHeight="250" style="width: 100%">
                  <div class="line" style="margin-bottom:10px;flex-direction: column;">
                    <el-button type="info" @click="openClientDocs()">Работа с документами</el-button>
                  </div>

                  <div v-if="clientDocuments && clientDocuments.length">
                    <div v-for="doc in clientDocuments" :key="doc.id"
                         :style="{'fontWeight': !doc.number?'600':''}" style="pointer-events: none">
                      <div v-if="!doc.deleted">
                        <div>
                          <small class="label l_150">Тип документа </small><small>&nbsp;
                          {{ documentTypes.find(el => el.value === doc.type).title }}</small>
                        </div>

                        <div>
                          <small class="label l_150">Серия </small><small>&nbsp; {{ doc.serial }}</small>
                        </div>

                        <div>
                          <small class="label l_150">Номер </small><small>&nbsp; {{ doc.number }}</small>
                        </div>

                        <div>
                          <small class="label l_150">Дата выдачи </small><small>&nbsp; {{ doc.issueDate }}</small>
                        </div>
                        <hr>
                      </div>
                    </div>

                  </div>
                </el-scrollbar>

              </el-tab-pane>
              <el-tab-pane label="Банковский счет" :maxHeight="250">
                <el-scrollbar :maxHeight="250">
                  <div style="text-align: center; margin-bottom: 8px;">
                    <el-button type="info" @click="addBank()" :icon="Plus">Добавить расчетный счет</el-button>
                    <el-button type="info" @click="showBanksHistory()" title="История изменений">⟲</el-button>
                  </div>

                  <div v-if="client.bills && client.bills.length">
                    <div v-for="(bill, index) in client.bills" :key="bill.id">
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
                          <el-input maxlength="20" v-model="bill.personalAccount"/>
                          &nbsp; <el-button  @click="deleteBank(bill)">
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

          <hr>
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
  <ClientsDirDocumentsModal ref="clientsDirDocumentsModal"/>
</template>

<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {computed, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {checkEmptyFields, emailValidate, formattingPhone, simplePhone, getFiasByName} from '@/utils/globalFunctions'
import ClientsDirModal_History from "@/pages/admin/dirs/ClientsDirModal_History.vue";
import ClientsDirDocumentsModal from "@/pages/admin/dirs/ClientsDirDocumentsModal.vue";

const globalStore = useGlobalStore()
const isOpen = ref(false)
const clientInit = {
  bills: [],
  person: {
    firstName: '',
    middleName: '',
    lastName: '',
    registrationAddress: { fias: {} },
    homeAddress: { fias: {} }
  }
}

const client = ref(clientInit)
const closeModal = () => isOpen.value = false
const title = ref('')
const сlientsDirModal_History = ref(null)
const clientsDirDocumentsModal = ref(null)
const adminStore = useAdminStore()
const treatmentsGroup = ref([])
const departments = ref([])
const form = ref(null)
const banks = ref([])
const banksFilials = ref({})
const isBankIsAdded = ref(false)
const clientDocuments = ref([])
const documentTypes = ref([])
const activeName = ref('first')
let cb;
const subtitle = computed(() => {
  let fio = ''
  if (client.value.person.firstName) fio += client.value.person.firstName + ' '
  if (client.value.person.middleName) fio += client.value.person.middleName + ' '
  if (client.value.person.lastName) fio += client.value.person.lastName + ' '
  return fio || 'Новый клиент'
})

function addressSelect(adr: { value: string, fias_id: number }) {
  client.value.person.registrationAddress.fiasAddress = {
    value: adr.value,
    fiasId: adr.fias_id
  }
}

function addressSelect2(adr: { value: string, fias_id: number }) {
  client.value.person.homeAddress.fiasAddress = {
    value: adr.value,
    fiasId: adr.fias_id
  }
}

function changeBank(id, index) {
  if (index !== undefined) client.value.bills[index].bankItemId = null
  id && adminStore.getBankFilials(id).then(res => banksFilials.value[id] = res.items)
}


function addBank() {
  isBankIsAdded.value = true
  client.value.bills.unshift({bankItemId: null, bankId: null})
}

function deleteBank(bank: any) {
  client.value.bills = client.value.bills.filter(el => !(el.bankId === bank.bankId && el.bankItemId === bank.bankItemId))
  if (client.value.bills.length === 0) addBank()
}


function open(leadId, cbModal) {
  cb = cbModal
  isOpen.value = true
  isBankIsAdded.value = false
  title.value = 'Создание нового клиента'
  if (!leadId) client.value = clientInit
  else adminStore.getClientForModal(leadId).then(res => {
    client.value = res.item
    client.value.person.homeAddress.fias = client.value.person.homeAddress.fias || {}
    client.value.person.registrationAddress.fias = client.value.person.registrationAddress.fias || {}

    title.value = 'Редактирование клиента'
    if (client.value.bills) client.value.bills.forEach(bank => changeBank(bank.bankId))
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
}

function getDocs(id) {
  adminStore.getClientDocunets(id).then(res => clientDocuments.value = res.items)
  adminStore.getDocumentTypes().then(res => documentTypes.value = res.items)
}

function openClientDocs() {
  clientsDirDocumentsModal.value.open(client.value, clientDocuments.value, getDocs)
}

function tabChosen() {
  adminStore.getBanks().then(res => banks.value = res.items)
}

function showHistory() {
  let name = client.value.person.firstName + ' ' + client.value.person.middleName + ' ' + client.value.person.lastName
  сlientsDirModal_History.value.open('клиента', client.value.leadId, name, 'getClientHistory')
}

function showBanksHistory() {
  let name = client.value.person.firstName + ' ' + client.value.person.middleName + ' ' + client.value.person.lastName
  сlientsDirModal_History.value.open('клиента по счетам', client.value.leadId, name, 'getBanksHistory')
}


function save() {
  checkEmptyFields(form.value).then(noErr => {

    if (!noErr) return false

    client.value.person.phone = simplePhone(client.value.person.phone)
    if (client.value.person.phone2) client.value.person.phone2 = simplePhone(client.value.person.phone2)

    adminStore.saveClient(client.value).then(res => {
      if (res.status === 200) {
        ElMessage({message: 'Данные клиента успешно сохранены', type: 'success'})
        isOpen.value = false
        client.value = clientInit
        cb && cb()
      }
    })
  })
}

defineExpose({open})


</script>