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
      <el-table-column label="Название" prop="name"/>
    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:5px double #ddd">
        <span>{{ row.name }} </span>
      </div>
      <div v-if="!total" style="text-align: center">Нет данных</div>
    </div>

  </div>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {ElTable} from "element-plus";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const tableDataMemory = []
const total = ref('')
const filter = {offset: 0, limit: 5}
const search = ref('')

function find() {
  console.log('22222222222, search.value', search.value)
  console.log('tableDataMemory', tableDataMemory)

  filter.search = search.value
  let word = search.value.toUpperCase()
  tableData.value = tableDataMemory.filter(el=>el.name.includes(word))
  getData()
}

function getData() {
  useGlobalStore().getBrands().then(res => {
    tableData.value = res
    tableDataMemory = JSON.parse(JSON.stringify(res)).map(el=>el.name.toUpperCase())
    total.value = res.count
  })
}

getData()
</script>