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
          <img class="photo-place" v-if="user.avatar  && user.avatar.url" :src="user && user.avatar.url"
               alt="Фото пользователя">
          <img src="@/assets/icons/icon-face.png" alt="" v-else class="photo-place"/>
          <el-input
              readonly
              onfocus="this.removeAttribute('readonly')"
              placeholder="Логин"
              title="Логин"
              autocomplete="off" v-model="user.login"/>
          <el-input placeholder="Пароль" title="Пароль" autocomplete="off" type="password" v-model="user.password"/>
          &nbsp; &nbsp;
          <a @click="signingLikeAnother()" v-if="isMyKey|| title === 'Создание нового пользователя'">Прикинуться</a>
          <hr>
          <el-input placeholder="Фамилия *" title="Фамилия" v-model="user.person.lastName"/>
          <el-input placeholder="Имя *" title="Имя" v-model="user.person.firstName"/>
          <el-input placeholder="Отчество" title="Отчество" v-model="user.person.middleName"/>
          <el-input placeholder="Email" title="Email" v-model="user.person.email"/>
          <el-input placeholder="Телефон" title="Телефон" v-model="user.person.phone"/>
          <el-input placeholder="Доп.телефон" title="Доп.телефон" v-model="user.person.phone2"/>
          <hr>
          <el-select
              title="Организация"
              placeholder="Организация"
              v-model="user.organization.id"
              filterable
              clearable>
              <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>

          <el-select
              title="Отдел"
              placeholder="Отдел *"
              v-model="user.department.id"
              filterable
              clearable>
              <el-option v-for="item in departmentsChosen" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>

          <el-select
              title="Место хранения/выкупа"
              placeholder="Место хранения/выкупа *"
              v-model="user.location.id"
              filterable
              clearable>
              <el-option v-for="item in locationsChosen" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>

          <el-select
              title="Часовой пояс"
              placeholder="Часовой пояс"
              v-model="user.timeZone"
              filterable
              clearable>
              <el-option v-for="item in timeZones" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>

          <el-input placeholder="Должность *" :title="'Должность: '+user.position" v-model="user.position"/>
          <hr>
          <el-select
              title="Категория"
              placeholder="Категория"
              v-model="user.roleCategory"
              @change="roleChanged()"
              filterable
              clearable>
              <el-option v-for="item in userRoleGroups" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>

          <el-select
              title="Роль"
              placeholder="Роль"
              v-model="user.role.value"
              filterable
              clearable>
              <el-option v-for="item in userRoles" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>
        </el-form>
      <div style="text-align: right">
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

.modal-fields .el-input {
  margin: 2px 12px;
}

.modal-fields hr {
  border: 1px solid #ddd;
}

.dark .modal-fields hr {
  border: 1px solid #444;
}

.photo-place {
  max-width: 120px;
  object-fit: cover;
  max-height: 120px;
  height: 120px;
  margin-bottom: -10px;
  margin-left: 20px;
  border-radius: 8px;
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
import {decryptPassword} from "@/utils/globalFunctions";

const isMyKey = ref(null)
const globalStore = useGlobalStore()
const isOpen = ref(false)
const userInit = {
  login: '',
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
adminStore.getDepartments().then(res => departments.value = res.items)
adminStore.getTimeZones().then(res => timeZones.value = res.items)
adminStore.getUserRoles().then(res => {
  userRoleGroups.value = res.items.map(el => el.group)
  userGroupRolesMemory.value = res.items
})


function roleChanged() {
  userRoles.value = userGroupRolesMemory.value.find(el => el.group.value === user.value.roleCategory).roles
}

function findGruop() {
  let elem = userGroupRolesMemory.value.find(el => el.roles.find(item => item.value === user.value.role.value))
  user.value.roleCategory = elem && elem.group.value;
  roleChanged()
}

function open(row, cbModal, copy) {
  cb = cbModal
  isOpen.value = true
  title.value = 'Создание нового пользователя'
  if (!row) user.value = userInit
  else adminStore.getUserForModal(row.id).then(res => {
    user.value = res
    title.value = 'Редактирование пользователя'

    if (copy) {
      user.value.id = 0
      user.value.login = null
      user.value.person.id = 0
      title.value = 'Копирование пользователя'
    }

    findGruop()
    let myKey = localStorage.getItem('myKey')
    isMyKey.value = myKey && myKey !== 'null'
  })
}

function showHistory() {
  modalHistory.value.open(user.value)
}

function signingLikeAnother() {
  let mk = localStorage.getItem('myKey')
  let myKey = mk && decryptPassword(mk)

  globalStore.signOut().then(() => {
    globalStore.signIn(user.value.login, myKey).then(res => {
      localStorage.setItem('account', JSON.stringify(res.data))
      location.reload()
    })
  })
}

function checking() {
  if (!user.value.login || !user.value.password) {
    return ElMessage({message: 'Поля "Логин"/"Пароль" обязательны для заполнения', type: 'warning'})
  }
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