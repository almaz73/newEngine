<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 930"
            :top="40"
            :title="'Настройки пользователя'"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">
      <span class="modal-fields">
        <img class="photo-place" v-if="user.avatar  && user.avatar.url" :src="user && user.avatar.url"
             alt="Фото пользователя">
        <img src="@/assets/icons/icon-face.png" alt="" v-else class="photo-place"/>
        <el-input placeholder="Логин" title="Логин" v-model="user.login"/>
        <el-input placeholder="Пароль" title="Пароль" type="password" v-model="user.password"/>
        <hr>
        <el-input placeholder="Фамилия" title="Фамилия" v-model="user.person.lastName"/>
        <el-input placeholder="Имя" title="Имя" v-model="user.person.firstName"/>
        <el-input placeholder="Отчество" title="Отчество" v-model="user.person.middleName"/>
        <el-input placeholder="Email" title="Email" v-model="user.person.email"/>
        <el-input placeholder="Телефон" title="Телефон" v-model="user.person.phone"/>
        <el-input placeholder="Доп.телефон" title="Доп.телефон" v-model="user.person.phone2"/>
        <hr>
        <el-select
            title="Организация"
            placeholder="Введи организацию"
            v-model="user.organization.id"
            filterable
            clearable>
            <el-option v-for="item in organizations" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>

        <el-select
            title="Отдел"
            placeholder="Введи Отдел"
            v-model="user.department.id"
            filterable
            clearable>
            <el-option v-for="item in departmentsChosen" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>

        <el-select
            title="Место хранения/выкупа"
            placeholder="Введи место хранения/выкупа"
            v-model="user.location.id"
            filterable
            clearable>
            <el-option v-for="item in locationsChosen" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>

        <el-select
            title="Часовой пояс"
            placeholder="Введи часовой пояс"
            v-model="user.timeZone"
            filterable
            clearable>
            <el-option v-for="item in timeZones" :key="item.id" :label="item.title" :value="item.id"/>
        </el-select>

        <el-input placeholder="Должность" :title="'Должность: '+user.position" v-model="user.position"/>
        <hr>
        <el-select
            title="Категория"
            placeholder="Введи категорию"
            v-model="user.roleCategory"
            @change="roleChanged()"
            filterable
            clearable>
            <el-option v-for="item in userRoleGroups" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>

        <el-select
            title="Роль"
            placeholder="Введи роль"
            v-model="user.role.value"
            filterable
            clearable>
            <el-option v-for="item in userRoles" :key="item.value" :label="item.title" :value="item.value"/>
        </el-select>

        <div style="text-align: right">
          <el-button type="danger" :icon="Plus">Сохранить</el-button>
          <el-button title="История изменений">Отменить</el-button>
          <el-button>⟲ </el-button>
        </div>
      </span>
    </el-scrollbar>
  </AppModal>
</template>
<style>
.modal-fields img {

}

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
}

</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {computed, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";

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
const subtitle = computed(() => {
  let fio = ''
  if (user.value.person.firstName) fio += user.value.person.firstName + ' '
  if (user.value.person.middleName) fio += user.value.person.middleName + ' '
  if (user.value.person.lastName) fio += user.value.person.lastName + ' '
  return fio || 'Новый  пользователь'
})


adminStore.getUserLocarions().then(res => locations.value = res.items)
globalStore.getOrganizations().then(res => organizations.value = res.items)
adminStore.getDepartments().then(res => departments.value = res.items)
adminStore.getTimeZones().then(res => timeZones.value = res.items)
adminStore.getUserRoles().then(res => {
  userRoleGroups.value = res.items.map(el => el.group)
  userGroupRolesMemory.value = res.items
})


function roleChanged() {
  console.log('user.value.roleCategory', user.value.roleCategory)
  userRoles.value = userGroupRolesMemory.value.find(el => el.group.value === user.value.roleCategory).roles
}

function findGruop() {
  user.value.roleCategory = userGroupRolesMemory.value.find(el => el.roles.find(item => {
    return item.value === user.value.role.value
  })).group.value;
  roleChanged()
}

function open(id) {
  isOpen.value = true
  if (!id) user.value = userInit
  else adminStore.getUserForModal(id).then(res => {
    user.value = res
    findGruop()

  })
}

defineExpose({open})


</script>