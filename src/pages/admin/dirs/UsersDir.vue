<template>
  <div>
    <div  style="margin-bottom: 30px">
      <el-input v-model="search"
                :prefix-icon="Search"
                @clear="find"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"

                @keydown.enter="find()"/>
      <el-button @click="find()" n type="danger" :icon="Plus">{{globalStore.isMobileView?'':'Добавить'}}</el-button>
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
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import { Plus, Search } from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const total = ref('')
const rowsPerPage = ref(5)
const pageDescription = ref('')
const filter = {offset: 0, limit: 5, search: ''}
const search = ref('')

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
    total.value = res.count
  })
}

globalStore.setTitle('Пользователи')
getData()
</script>