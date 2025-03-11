<template>
    <div>
      <div style="margin-bottom: 30px">
        <el-button @click="openModal"
                   type="danger" :icon="Plus">{{ globalStore.isMobileView ? '' : 'Добавить' }}
        </el-button>
      </div>
  
      <el-table
          :data="tableData"
          empty-text="Нет данных"
          highlight-current-row>
          
        <el-table-column label="Название" prop="title" sortable />
        <el-table-column width="73">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <EditPensilCtrl @click="openModal(scope.row)" />
            <img @click="deleteRow(scope.row)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
                 </div>
          </template>
        </el-table-column>
  
      </el-table>
    </div>
    <CertificationDirModal ref="modal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {ElMessage, ElMessageBox, ElTable} from "element-plus";
  import {useGlobalStore} from "@/stores/globalStore";
  import {Plus} from '@element-plus/icons-vue'
  import CertificationDirModal from '@/pages/admin/dirs/CertificationDirModal.vue'
  import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const modal = ref(null)
  
  function openModal(row: any | null) {
    modal.value.open(row, getData)
  }
  
  
  
  function deleteRow(row: any) {
    ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
          adminStore.deleteCertification(row.id).then(() => {
            ElMessage({message: 'Строка удалена', type: 'success'})
            getData()
          })
        })
  }
  
  function getData() {
    adminStore.getCertification().then(res => {
      tableData.value = res
    })
  }
  
  globalStore.setTitle('Админка - Программы сертификации')
  globalStore.steps = []
  getData()
  
  
  </script>