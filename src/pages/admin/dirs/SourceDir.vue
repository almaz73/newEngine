<template>
    <div>
      <div class="admin-filter-field">
        <el-input v-model="search"
                  :prefix-icon="Search"
                  @clear="find()"
                  clearable
                  :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"
                  @input="find()"/>
        <el-button @click="openModal"
                   type="danger" :icon="Plus">Добавить
        </el-button>
      </div>

      <el-table
          :data="tableData"
          empty-text="Нет данных"
          highlight-current-row>
        <el-table-column label="Категория" prop="name" sortable />
        <el-table-column label="Категория" prop="parentName" sortable />

        <el-table-column width="73">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <EditPensilCtrl @click="openModal(scope.row)"/>
              <DeleteCtrl @click="deleteRow(scope.row)"/>
                 </div>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <SourceDirModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {ElMessage, ElMessageBox, ElTable} from "element-plus";
  import {useGlobalStore} from "@/stores/globalStore";
  import {Search, Plus} from '@element-plus/icons-vue'
  import SourceDirModal from '@/pages/admin/dirs/SourceDirModal.vue'
  import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
  import DeleteCtrl from '@/controls/DeleteCtrl.vue'
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const InspectionModal = ref(null)
  let tableDataMemory = []
  const search = ref('')

  function openModal(row: any | null) {
  InspectionModal.value.open(row, getData)
}


  function find() {
    tableData.value = tableDataMemory.filter(el => el.name.toUpperCase().includes(search.value.toUpperCase()))
    if (!search.value) tableData.value = tableDataMemory
  }


  function deleteRow(row: any) {
    ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
          adminStore.deleteTreatment(row.id).then(() => {
            ElMessage({message: 'Строка удалена', type: 'success'})
            getData()
          })
        })
  }

  function getData() {
    globalStore.getTreatments().then(res => {
      tableData.value = res.items
      tableDataMemory = JSON.parse(JSON.stringify(res.items))
    })
  }

  globalStore.setTitle('Админка - Источник')
  globalStore.steps = []
  getData()


  </script>