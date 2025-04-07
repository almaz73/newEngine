<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 930"
            :top="40"
            :title="title"
            :subtitle="subtitle"
            draggable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">

      <div class="modal-fields">
        <el-form ref="form" :model="user" class="error-to-message">
          <div class="photo-place">
            <UploadPhoto @setNewPhoto="setNewPhoto" :url="user.avatar.url"/>
          </div>
          <el-form-item prop="login"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Логин', trigger: ['change']}">
            <el-input
                readonly
                onfocus="this.removeAttribute('readonly')"
                placeholder="Логин"
                title="Логин"
                autocomplete="off" v-model="user.login"/>
          </el-form-item>

          <el-form-item prop="password"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Пароль', trigger: ['change']}">
            <el-input placeholder="Пароль" title="Пароль" autocomplete="off" type="password" v-model="user.password"/>
          </el-form-item>
          &nbsp; &nbsp;
          <a @click="signingLikeAnother()" v-if="isMyKey|| title === 'Создание нового пользователя'">Прикинуться</a>
          <hr>

          <el-form-item prop="person['lastName']"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Фамилия', trigger: ['change']}">
            <el-input placeholder="Фамилия" title="Фамилия" v-model="user.person.lastName"/>
          </el-form-item>

          <el-form-item prop="person['firstName']"
                        style="display: inline-block; width: 220px"
                        :rules="{required: true, message: 'Имя', trigger: ['change']}">
            <el-input placeholder="Имя" title="Имя" v-model="user.person.firstName"/>
          </el-form-item>

          <el-input placeholder="Отчество" title="Отчество" v-model="user.person.middleName"/>
          <el-input placeholder="Email"
                    @change="emailValidate(user.person.email)"
                    title="Email" v-model="user.person.email"/>
          &nbsp;&nbsp;
          <el-input placeholder="Телефон" title="Телефон" clearable
                    :formatter="(value) =>value && formattingPhone(value, (val)=>user.person.phone=val)"
                    v-model="user.person.phone"/>
          &nbsp;&nbsp;
          <el-input placeholder="Доп.телефон" title="Доп.телефон" clearable
                    :formatter="(value) =>value && formattingPhone(value, (val)=>user.person.phone2=val)"
                    v-model="user.person.phone2"/>

          <hr>
          <br>
          <div class="line">
            <label>Организация</label>
            <el-select
                placeholder="Введите организацию"
                v-model="user.organization.id"
                filterable
                clearable>
              <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>

          <div class="line">
            <label>Отдел</label>
            <el-form-item prop="department['id']"
                          style="display: inline-block; width: 220px"
                          :rules="{required: true, message: 'Введите отдел', trigger: ['change']}">
              <el-select
                  placeholder="Введите отдел"
                  v-model="user.department.id"
                  filterable
                  clearable>
                <el-option v-for="item in departmentsChosen" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </div>

          <div class="line">
            <label>Место хранения/выкупа</label>
            <el-form-item prop="location['id']"
                          style="display: inline-block; width: 220px"
                          :rules="{required: true, message: 'Введите место хранения/выкупа', trigger: ['change']}">
              <el-select
                  v-if="locationsChosen.length"
                  placeholder="Введите место хранения/выкупа"
                  v-model="user.location.id"
                  filterable
                  clearable>
                <el-option v-for="item in locationsChosen" :key="item.id" :label="item.title" :value="item.id"/>
              </el-select>


            <small v-else style="padding: 6px 0 "><i> Не найдено</i></small>
            </el-form-item>
          </div>

          <div class="line">
            <label>Часовой пояс</label>
            <el-select
                title="Часовой пояс"
                placeholder="Введите часовой пояс"
                v-model="user.timeZone"
                filterable
                clearable>
              <el-option v-for="item in timeZones" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
          </div>

          <div class="line" v-if="permit()">
            <label>Должность</label>
            <el-form-item prop="position"
                          style="display: inline-block; width: 220px"
                          :rules="{required: true, message: 'Введите должность', trigger: ['change']}">
              <el-input style="margin: 0" placeholder="Введите должность" :title="'Должность: '+user.position"
                      v-model="user.position"/>
            </el-form-item>
          </div>
          <hr>

          <div class="line" v-if="permit()">
            <label>Категория</label>
            <el-select
                placeholder="Введите категорию"
                v-model="user.roleCategory"
                @change="roleChanged()"
                filterable
                clearable>
              <el-option v-for="item in userRoleGroups" :key="item.value" :label="item.title" :value="item.value"/>
            </el-select>
          </div>

          <div class="line" v-if="permit()">
            <label>Роль</label>
            <el-select
                placeholder="Введите роль"
                v-model="user.role.value"
                filterable
                clearable>
              <el-option v-for="item in userRoles" :key="item.value" :label="item.title" :value="item.value"/>
            </el-select>
          </div>
        </el-form>
        <span class="modal-buttons-bottom">
          <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
          <el-button type="info"
                     v-if="title === 'Редактирование пользователя' && permit()"
                     @click="showHistory()" title="История изменений">⟲
          </el-button>
        </span>
      </div>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {computed, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
import {decryptPassword, emailValidate, formattingPhone, checkEmptyFields} from "@/utils/globalFunctions";
import {permit} from "@/utils/permit.js";
import UploadPhoto from "@/components/UploadPhoto.vue";

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
  userRoleGroups.value = res.items && res.items.map(el => el.group)
  userGroupRolesMemory.value = res.items
})


function roleChanged() {
  userRoles.value = userGroupRolesMemory.value.find(el => el.group.value === user.value.roleCategory).roles
}


function findGroup() {
  if (!userGroupRolesMemory.value) return false
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

    findGroup()
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

function setNewPhoto(file) {
  if (file && file.fbase64) {
    user.value.avatar.file = file.fbase64.split('base64,')[1]
    user.value.avatar.name = file.name
  } else {
    user.value.avatar.file = null
    user.value.avatar.url = ''
  }
}

function save() {
  globalStore.isWaiting = true
  checkEmptyFields(form.value).then(res => {
    res && adminStore.saveUser(user.value).then(res => {
      res && ElMessage({message: 'Успешно', type: 'success'})
      isOpen.value = false
      cb && cb()
    })
    globalStore.isWaiting = false
  })
}

defineExpose({open})


</script>