<template>
  <div>
    <div style="margin-bottom: 30px">
      <el-input v-model="search"
                :prefix-icon="Search"
                @clear="find"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"

                @keydown.enter="find()"/>
      <el-button @click="find()" n type="danger" :icon="Plus">{{ globalStore.isMobileView ? '' : 'Добавить' }}
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
      <el-table-column prop="roleTitle" width="100px">

        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img v-if="scope.row.isActive" @click="switchuser(scope.row)"
                 title="Активный"
                 src="@/assets/icons/icon-unblocked-gray.png">
            <img v-else @click="switchuser(scope.row)"
                 title="Нeактивный"
                 src="@/assets/icons/icon-blocked-red.png">
            <img src="@/assets/icons/copy.gif"
                 title="Создать новый на основе этого"
            >
            <img @click="openUserModal(scope.row)"
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <img src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>


    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.login }} </span>
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
  <UsersDirModal
      :isOpen="isOpenUsersDirModal"
      :userId="currentRow.id"
      @closeModal="closeModal"/>
  />
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus, Search} from '@element-plus/icons-vue'
import UsersDirModal from "@/pages/admin/dirs/UsersDirModal.vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const total = ref('')
const rowsPerPage = ref(5)
const pageDescription = ref('')
const filter = {offset: 0, limit: 5, search: ''}
const search = ref('')
const currentRow = ref(null)
const isOpenUsersDirModal = ref(false)



openUserModal({"id":152,"login":"timur","password":null,"role":21,"roleTitle":"Выкупщик менеджер","position":"Руководитель закамского региона","isActive":true,"createDate":"2017-06-09T19:03:13.015","firstName":"Тимур","middleName":"Мавлетдинович","lastName":"Абдулнасыров","fullName":"Абдулнасыров Тимур","phone":"09593553121","email":"t2901513@mail.ru","orgElementId":44,"orgTitle":"Выкуп (Нижнекамск)","orgelementTitle":null,"storageId":27,"timeZone":10,"typeDocumentSignature":null,"numberDocumentSignature":null,"dateDocumentSignature":"0001-01-01T00:00:00","signAuthority":null,"avatarId":null,"sendEmail":false,"lastEditUser":null,"lastEditDate":null,"locationTitle":"KIA на Спортивной (НК)","groups":[],"changePassDate":null,"needChangePass":false,"avatarUrl":null})


function find() {
  console.log('find')
  filter.search = search.value
  getData()
}

function changePageSize() {
  filter.limit = rowsPerPage.value
  getData()
}

function changePage(val) {
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

function switchuser(row) {
  adminStore.switchuser(row.id).then(getData)
}

function openUserModal(row:any) {
  currentRow.value = row
  isOpenUsersDirModal.value = true
}

const closeModal = () => isOpenUsersDirModal.value = false

globalStore.setTitle('Пользователи')
globalStore.steps = []
getData()
</script>