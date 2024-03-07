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
        <el-form ref="form" :model="client" @change="isDirty=true">
          <div class="line">
            <label>Источник</label>
            <el-select
                placeholder="Введите источник"
                v-model="client.treatmentSourceId"
                filterable
                clearable>
                <el-option v-for="item in treatments" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <hr>
          <el-input placeholder="Фамилия *" title="Фамилия" v-model="client.person.lastName"/>
          <el-input placeholder="Имя *" title="Имя" v-model="client.person.firstName"/>
          <el-input placeholder="Отчество" title="Отчество" v-model="client.person.middleName"/>

          <span><small style="padding-right: 30px">Пол: </small><el-select
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
                    :formatter="(value) =>formattingPhone(value, (val)=>client.person.phone=val)"
                    v-model="client.person.phone"/>
          <el-input placeholder="Доп.телефон" title="Доп.телефон"
                    :formatter="(value) =>formattingPhone(value, (val)=>client.person.phone2=val)"
                    v-model="client.person.phone2"/>



           <span><small>День/р:</small>
             <el-date-picker
                 style="width: 160px; overflow: hidden"
                 placeholder="День рождения" title="День рождения"
                 v-model="client.person.dateOfBirth"/>
           </span>

          <hr>
          <br>
          <div class="line">
            <label>Место рождения</label>
            <el-input v-model="client.person.placeOfBirth"/>
          </div>

          <div class="line">
            <label> Ссылка на соц.сети</label>
            <el-input v-model="client.person.socialNetworksAddress"/>
          </div>

          <div class="line">
            <label>ИНН (физ. лица)</label>
            <el-input placeholder="ИНН" v-model="client.person.inn"/>
          </div>

          <div class="line">
            <label>Согласие на обработку персональных данных</label>
            <el-checkbox v-model="client.person.personalDataAgree"/>
          </div>

           <div class="line">
            <label>Согласие на получение смc</label>
            <el-checkbox v-model="client.person.smsReceivingAgree"/>
          </div>

          <div class="line" v-if="client.person.registrationAddress">
            <label>Адрес регистрации</label>
            <el-input placeholder="Адрес регистрации" v-model="client.person.registrationAddress.text"/>
          </div>

          <div class="line" v-if="client.person.homeAddress">
            <label>Фактический адрес</label>
            <el-input placeholder="Фактический адрес" v-model="client.person.homeAddress.text"/>
          </div>

          <label class="label">{{ client.bills.length ? 'Счет' : 'Банковский счет не представлен'}}</label>
          <div v-for="bill in client.bills" :key="bill.id">
            <div class="line">
              <label>Банк</label>
              <el-select
                  style="width: 200px; margin: 0 12px;"
                  placeholder="Выберите банк"
                  v-model="bankId"
                  filterable
                  @change="bankChanged()"
                  clearable>
                  <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="line">
              <label>Филиал</label>
              <el-select
                  placeholder="Выберите филиал"
                  style="width: 200px; margin: 0 12px;"
                  v-model="filialId"
                  filterable
                  clearable>
                  <el-option v-for="item in filials" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>
          </div>

        </el-form>
        <div style="text-align: right; margin-top: 12px">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отменить</el-button>
          <el-button type="info"
                     v-if="title === 'Редактирование пользователя'"
                     @click="showHistory()" title="История изменений">⟲</el-button>
        </div>
      </div>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
</template>

<style>


.line {
  display: flex;
}

.line label {
  min-width: 230px;
  text-align: right;
  margin-right: 12px;
  align-self: center;
}
</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {computed, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
import {emailValidate, formattingPhone} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const isOpen = ref(false)
const clientInit = {
  person: {firstName: '', middleName: '', lastName: ''},
  avatar: {url: ''},
  organization: {},
  department: {},
  location: {},
  role: {}
}
const client = ref(clientInit)
const closeModal = () => isOpen.value = false
const title = ref('')
const modalHistory = ref(null)
const adminStore = useAdminStore()
const organizations = ref([])
const treatments = ref([])
const departments = ref([])
const form = ref(null)
const banks = ref([])
const bankId = ref(null)
const filials = ref([])
const filialId = ref(null)
const isDirty = ref(false)
let cb;
const subtitle = computed(() => {
  let fio = ''
  if (client.value.person.firstName) fio += client.value.person.firstName + ' '
  if (client.value.person.middleName) fio += client.value.person.middleName + ' '
  if (client.value.person.lastName) fio += client.value.person.lastName + ' '
  return fio || 'Новый  пользователь'
})




function bankChanged() {
  console.log('bank.value', bankId.value)
  adminStore.getBankFilials(bankId.value).then(res => {
    console.log('res', res)
    filials.value = res.items
  })
}

function open(row, cbModal) {
  console.log('id', row)

  cb = cbModal
  isOpen.value = true
  title.value = 'Создание нового пользователя'
  if (!row) client.value = clientInit
  else adminStore.getClientForModal(row.leadId).then(res => {
    console.log('>>> res', res)

    client.value = res.item
    title.value = 'Редактирование пользователя'

  })

  // adminStore.getUserLocations().then(res => locations.value = res.items)
  globalStore.getOrganizations().then(res => organizations.value = res.items)
  globalStore.getTreatments().then(res => treatments.value = res.items)


  adminStore.getDepartments().then(res => departments.value = res.items)
  adminStore.getBanks().then(res => {
    console.log(' - - - ', res)
    banks.value = res.result
  })
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
  if (!client.value.department.id) {
    return ElMessage({message: 'Поле "Отдел" обязателен для заполнения', type: 'warning'})
  }
  if (!client.value.location.id) {
    return ElMessage({message: 'Поле "Место хранение/выкупа" обязателен для заполнения', type: 'warning'})
  }
  if (!client.value.position) {
    return ElMessage({message: 'Поле "Должность" обязателен для заполнения', type: 'warning'})
  }
}


function save() {
  if (checking()) return false
  adminStore.saveUser(client.value).then(() => {
    ElMessage({message: 'Успешно', type: 'success'})
    isOpen.value = false
    cb()
  })
}

defineExpose({open})


</script>