<template>
  <div>
    <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        :default-sort="{ prop: 'name', order: 'ascending' }"
        highlight-current-row>
      <el-table-column prop="name" label="Название" sortable/>
      <el-table-column prop="inspectionUiType" label="Категория осмотра" sortable/>
      <el-table-column prop="order" label="Порядок" sortable/>
      <el-table-column prop="roleTitle" width="73px">

        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img @click="openModal(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <img @click="deleteUser(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <InspectionDirModal ref="InspectionModal"/>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import { ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import InspectionDirModal from "@/pages/admin/dirs/InspectionDirModal.vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
let tableDataMemory = []
const isEdit = ref(false)
const selectedRow = ref(false)
const InspectionModal = ref(null)

function openModal(row){
  InspectionModal.value.open(row, getData)
}





function getData() {
  isEdit.value = false
  selectedRow.value = false

  adminStore.getInspection().then(res => {
    console.log(' :::res', res)
    tableData.value = res.items
    tableDataMemory = JSON.parse(JSON.stringify(res.items))
  })
}

globalStore.setTitle('Организационная структура')
globalStore.steps = []
getData()


</script>