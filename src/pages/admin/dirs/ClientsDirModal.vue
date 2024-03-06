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

      <span class="modal-fields">
        <el-form ref="form" :model="user" @change="isDirty=true">
          <div class="line">
            <label>Источник</label>
            <el-select
                placeholder="Введите источник"
                v-model="user.treatmentSourceId"
                filterable
                clearable>
                <el-option v-for="item in treatments" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <hr>
          <el-input placeholder="Фамилия *" title="Фамилия" v-model="user.person.lastName"/>
          <el-input placeholder="Имя *" title="Имя" v-model="user.person.firstName"/>
          <el-input placeholder="Отчество" title="Отчество" v-model="user.person.middleName"/>

          <span><small style="padding-right: 30px">Пол: </small><el-select
              placeholder="Пол"
              v-model="user.person.gender"
              style="width:160px"
          >
                  <el-option v-for="item in [{id:10, name:'мужской'}, {id:20, name:'женский'}]" :key="item.id"
                             :label="item.name" :value="item.id"/>
              </el-select>
           </span>

          <el-input placeholder="Email"
                    @change="emailValidate(user.person.email)"
                    title="Email" v-model="user.person.email"/>
          <el-input placeholder="Телефон" title="Телефон"
                    :formatter="(value) =>formattingPhone(value, (val)=>user.person.phone=val)"
                    v-model="user.person.phone"/>
          <el-input placeholder="Доп.телефон" title="Доп.телефон"
                    :formatter="(value) =>formattingPhone(value, (val)=>user.person.phone2=val)"
                    v-model="user.person.phone2"/>



           <span><small>День/р:</small>
             <el-date-picker
                 style="width: 160px; overflow: hidden"
                 placeholder="День рождения" title="День рождения"
                 v-model="user.person.dateOfBirth"/>
           </span>

          <hr>
          <br>
          <div class="line">
            <label>Организация</label>
            <el-select
                placeholder="Введите организацию"
                v-model="user.organization"
                filterable
                clearable>
                <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <div class="line">
            <label>ИНН (физ. лица)</label>
            <el-input placeholder="ИНН" v-model="user.person.inn"/>
          </div>

          <div class="line">
            <label>Согласие на обработку персональных данных</label>
            <el-checkbox v-model="user.person.personalDataAgree"/>
          </div>

           <div class="line">
            <label>Согласие на получение смc</label>
            <el-checkbox v-model="user.person.smsReceivingAgree"/>
          </div>

          <div class="line" v-if="user.person.registrationAddress">
            <label>Адрес регистрации</label>
            <el-input placeholder="Адрес регистрации" v-model="user.person.registrationAddress.text"/>
          </div>

          <div class="line" v-if="user.person.homeAddress">
            <label>Фактический адрес</label>
            <el-input placeholder="Фактический адрес" v-model="user.person.homeAddress.text"/>
          </div>



        </el-form>
      <div style="text-align: right; margin-top: 12px">
        <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
        <el-button type="info" @click="isOpen = false">Отменить</el-button>
        <el-button type="info"
                   v-if="title === 'Редактирование пользователя'"
                   @click="showHistory()" title="История изменений">⟲</el-button>
      </div>
      </span>
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
const userInit = {
  person: {firstName: '', middleName: '', lastName: ''},
  avatar: {url: ''},
  organization: {},
  department: {},
  location: {},
  role: {}
}
const user = ref(userInit)
const closeModal = () => isOpen.value = false
const title = ref('')
const modalHistory = ref(null)
const adminStore = useAdminStore()
const organizations = ref([])
const treatments = ref([])
const departments = ref([])
const departmentsChosen = computed(() => departments.value.filter(el => el.organization.id === user.value.organization.id))
const locations = ref([])
const locationsChosen = computed(() => locations.value.filter(el => el.department.id === user.value.department.id))
const timeZones = ref([])
let userGroupRolesMemory = ref([])
const userRoleGroups = ref({})
const userRoles = ref({})
const form = ref(null)
const isDirty = ref(false)
let cb;
const subtitle = computed(() => {
  let fio = ''
  if (user.value.person.firstName) fio += user.value.person.firstName + ' '
  if (user.value.person.middleName) fio += user.value.person.middleName + ' '
  if (user.value.person.lastName) fio += user.value.person.lastName + ' '
  return fio || 'Новый  пользователь'
})


adminStore.getUserLocations().then(res => locations.value = res.items)
globalStore.getOrganizations().then(res => organizations.value = res.items)
globalStore.getTreatments().then(res => treatments.value = res.items)


adminStore.getDepartments().then(res => departments.value = res.items)
adminStore.getTimeZones().then(res => timeZones.value = res.items)
adminStore.getUserRoles().then(res => {
  userRoleGroups.value = res.items.map(el => el.group)
  userGroupRolesMemory.value = res.items
})


function roleChanged() {
  userRoles.value = userGroupRolesMemory.value.find(el => el.group.value === user.value.roleCategory).roles
}


function open(row, cbModal) {
  console.log('id', row)

  cb = cbModal
  isOpen.value = true
  title.value = 'Создание нового пользователя'
  if (!row) user.value = userInit
  else adminStore.getClientForModal(row.leadId).then(res => {
    console.log('>>> res', res)

    user.value = res.item
    title.value = 'Редактирование пользователя'

  })
}

function showHistory() {
  modalHistory.value.open(user.value)
}


function checking() {
  // if (!user.value.login) {
  //   return ElMessage({message: 'Поле "Логин" обязателен для заполнения', type: 'warning'})
  // }
  if (!user.value.person.lastName) {
    return ElMessage({message: 'Поле "Фамилия" обязателен для заполнения', type: 'warning'})
  }
  if (!user.value.person.firstName) {
    return ElMessage({message: 'Поле "Имя" обязателен для заполнения', type: 'warning'})
  }
  if (!user.value.department.id) {
    return ElMessage({message: 'Поле "Отдел" обязателен для заполнения', type: 'warning'})
  }
  if (!user.value.location.id) {
    return ElMessage({message: 'Поле "Место хранение/выкупа" обязателен для заполнения', type: 'warning'})
  }
  if (!user.value.position) {
    return ElMessage({message: 'Поле "Должность" обязателен для заполнения', type: 'warning'})
  }
}


function save() {
  if (checking()) return false
  adminStore.saveUser(user.value).then(() => {
    ElMessage({message: 'Успешно', type: 'success'})
    isOpen.value = false
    cb()
  })
}

defineExpose({open})


</script>