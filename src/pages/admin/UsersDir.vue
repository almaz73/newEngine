<template>
  <div>
    <span>
      <el-input v-model="search"/>
      <el-button @click="find()">Искать</el-button>
    </span>

    <el-table
        v-if="!globalStore.isMobileView"
        :data="tableData"
        ref="singleTableRef"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="ФИО" prop="fullName"/>
      <el-table-column label="Организация" prop="locationTitle"/>
      <el-table-column label="Место выкупа" prop="locationTitle"/>
      <el-table-column label="Логин" prop="login"/>
      <el-table-column label="Роль" prop="roleTitle"/>
    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:5px double #ddd">
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

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const total = ref('')
const rowsPerPage = ref(null)
const pageDescription = ref('')
const params = {offset: 0, limit: 5}
const search = ref('')

function changePageSize() {
  console.log('changePageSize')
}

function changePage() {
  console.log('changePage')
}

function getData() {
  adminStore.getUsers(params).then(res => {
    tableData.value = res.items
    total.value = res.count
  })
}

getData()

function find() {
  console.log('search.value', search.value)
  params.offset = 0
  params.search = search.value
  getData()
}


</script>