<template>
  <div>
    <div class="admin-filter-field">
      <el-input v-model="search"
                :prefix-icon="Search"
                placeholder="Поиск"
                @clear="search='';getData()"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"

                @keydown.enter="getData()"/>
      <el-button @click="openModalUserDir()" type="danger" :icon="Plus"> Добавить</el-button>
      <el-input v-model="myKey"
                :style="{opacity:isMyKey?1:0}"
                @click="isMyKey = true"
                @blur="saveHashMyKey(); isMyKey = false"
                class="myKey"/>
    </div>

    <div class="admin-filter-field">
      <el-select
          placeholder="Статус"
          v-model="filterStatus"
          @change="getData()"
          multiple
          clearable>
        <el-option v-for="(item, ind) in statuses"
                   :key="ind" :label="item.name"
                   :value="item.type"/>
      </el-select>


      <el-select
          placeholder="Организация"
          v-model="filter.Organizations"
          @change="getData()"
          multiple
          clearable
          filterable>
        <el-option v-for="(item, ind) in organizations"
                   :key="ind" :label="item.name"
                   :value="item.id"/>
      </el-select>
      <el-select
          placeholder="Роль"
          v-model="filter.role"
          @change="getData()"
          clearable
          filterable>
        <el-option v-for="(item, ind) in roles"
                   :key="ind" :label="item.title"
                   :value="item.value"/>
      </el-select>
    </div>

    <el-table
        v-if="!globalStore.isMobileView"
        :data="tableData"
        ref="singleTableRef"
        @row-dblclick="doubleClickOpenModal"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="ФИО" prop="fullName"/>
      <el-table-column label="Организация" prop="orgTitle"/>
      <el-table-column label="Место выкупа" prop="locationTitle"/>
      <el-table-column label="Логин" prop="login"/>
      <el-table-column label="Роль" prop="roleTitle"/>
      <el-table-column prop="roleTitle" width="120px">

        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img v-if="scope.row.isActive" @click="switchuser(scope.row)" alt=""
                 title="Активный"
                 src="@/assets/icons/icon-unblocked-gray.png">
            <img v-else @click="switchuser(scope.row)" alt=""
                 title="Нeактивный"
                 src="@/assets/icons/icon-blocked-red.png">
            <img @click="openModalUserDir(scope.row, 'copy')" alt=""
                 src="@/assets/icons/copy.gif"
                 title="Создать новый на основе этого"
            >
            <EditPensilCtrl @click="openModalUserDir(scope.row)"/>
            <img @click="deleteUser(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>


    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.login }}
             <EditPensilCtrl @click="openModalUserDir(row)" />
          &nbsp;
           <img v-if="row.isActive" @click="switchuser(row)" alt=""
                title="Активный"
                src="@/assets/icons/icon-unblocked-gray.png">
            <img v-else @click="switchuser(row)" alt=""
                 title="Нeактивный"
                 src="@/assets/icons/icon-blocked-red.png">
        </span>
        <div><small>ФИО:</small> {{ row.fullName }}</div>
        <div><small>Место:</small> {{ row.locationTitle }}</div>
        <div><small>Роль:</small> {{ row.roleTitle }}</div>


      </div>
      <div v-if="!total" style="text-align: center">Нет данных</div>
    </div>
    <template v-if="total>2">
      <el-pagination
          v-model:page-size="rowsPerPage"
          :page-sizes="[5, 10, 20, 50]"
          layout="prev, pager, next, sizes"
          @current-change="changePage"
          @size-change="changePageSize"
          :total="total"
      />
      <div class="page-info">Показаны {{ pageDescription }} из {{ total }}</div>
    </template>
  </div>
  <UsersDirModal ref="UserModal"/>
</template>

<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus, Search} from '@element-plus/icons-vue'
import UsersDirModal from "@/pages/admin/dirs/UsersDirModal.vue";
import {encryptPassword} from "@/utils/globalFunctions";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const UserModal = ref(null)
const tableData = ref([])
const total = ref(0)
const rowsPerPage = ref(5)
const pageDescription = ref('')
const search = ref('')
const myKey = ref(null)
const isMyKey = ref(false)
const filter = {offset: 0, limit: 5, search: '', Organizations: [], role: null}
const organizations = ref([])
const filterStatus = ref([])
const statuses = [
  {name: 'Активные', type: 'IsActive', value: false},
  {name: 'Заблокированные', type: 'Blocked', value: false},
  {name: 'Удаленные', type: 'deleted', value: false}
]
const roles = ref([])


globalStore.getOrganizations().then(res => organizations.value = res.items)
adminStore.getUserRoles().then(res => res.items.forEach(item => roles.value.push(...item.roles)))

function saveHashMyKey() {
  let hash: null | string = myKey.value && encryptPassword(myKey.value)
  hash && localStorage.setItem('myKey', hash)
}


function changePageSize() {
  filter.limit = rowsPerPage.value
  getData()
}

function changePage(val: number) {
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
}

function prepareFilter() {
  if (filterStatus.value.length) {
    ['deleted', "IsActive", "Blocked"].forEach(type => filter[type] = filterStatus.value.includes(type))
  }
  filter.search = search.value
}

function getData() {
  prepareFilter()
  adminStore.getUsers(filter).then(res => {
    tableData.value = res.items
    // tableData.value = tableData.value.sort((a, b) => a.id - b.id)
    total.value = res.count
  })
}

function switchuser(row: any) {
  adminStore.switchUser(row.id).then(getData)
}

function doubleClickOpenModal(row: any) {
  openModalUserDir(row)
}

function openModalUserDir(row: any | null, copy: string | null) {
  UserModal.value.open(row, getData, copy)
}

function deleteUser(id: number) {
  ElMessageBox.confirm('Вы действительно хотите удалить пользователя?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then((res) => {
        res && adminStore.deleteUser(id).then(() => {
          ElMessage({message: 'Пользователь успешно удален', type: 'success'})
          getData()
        })
      })
}



globalStore.setTitle('Админка - Пользователи')
globalStore.steps = []
getData()
</script>