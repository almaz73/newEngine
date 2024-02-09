<template>
  <div>
    <div style="margin-bottom: 30px">
      <el-input v-model="search"
                :prefix-icon="Search"
                @clear="find"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"

                @keydown.enter="find()"/>
      <el-button @click="openModalUserDir()" type="danger" :icon="Plus">
        {{ globalStore.isMobileView ? '' : 'Добавить' }}
      </el-button>
    </div>

    <el-table
        v-if="!globalStore.isMobileView"
        :data="tableData"
        ref="singleTableRef"
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
            <img @click="openModalUserDir(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
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
           <el-button><img @click="openModalUserDir(row)" alt=""
                           title="Редактировать"
                           src="@/assets/icons/icon-pencil-gray.png">
             </el-button>
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

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const UserModal = ref(null)
const tableData = ref([])
const total = ref('')
const rowsPerPage = ref(5)
const pageDescription = ref('')
const filter = {offset: 0, limit: 5, search: ''}
const search = ref('')
const currentRow = ref({id: null})


function find() {
  console.log('find')
  filter.search = search.value
  getData()
}

function changePageSize() {
  filter.limit = rowsPerPage.value
  getData()
}

function changePage(val: number) {
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
}

function getData() {
  adminStore.getUsers(filter).then(res => {
    tableData.value = res.items
    tableData.value = tableData.value.sort((a, b) => a.id - b.id)
    total.value = res.count
  })
}

function switchuser(row: any) {
  adminStore.switchuser(row.id).then(getData)
}

function openModalUserDir(row: any | null, copy: string | null) {
  if (row) currentRow.value = row
  UserModal.value.open(row, cbModal, copy)
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

function cbModal() {
  getData()
}


globalStore.setTitle('Пользователи')
globalStore.steps = []
getData()
</script>