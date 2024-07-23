<template>
    <div>
      <div style="margin-bottom: 30px">
        <el-input v-model="search"
                  :prefix-icon="Search"
                  @clear="find()"
                  clearable
                  :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"
                  @input="find()"/>
        <el-button @click="openModal"
                   type="danger" :icon="Plus">{{ globalStore.isMobileView ? '' : 'Добавить' }}
        </el-button>
      </div>
  
      <el-table
          :data="tableData"
          empty-text="Нет данных"
          highlight-current-row>
        <el-table-column label="Цвет" prop="colorName" sortable>
          <template #default="scope">
            <span>{{ scope.row.colorName }}</span>
          </template>
        </el-table-column>
  
        <el-table-column>
          <template #default="scope">
            <div
              :style="{ 
                backgroundColor: scope.row.colorCode, 
                width: '30px', 
                height: '30px', 
                borderRadius: '4px', 
                border: '1px solid #dcdfe6' 
              }"
            ></div>
          </template>
        </el-table-column>
  
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
    <ColorsPTSDirModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {ElMessage, ElMessageBox, ElTable} from "element-plus";
  import {useGlobalStore} from "@/stores/globalStore";
  import {Search, Plus} from '@element-plus/icons-vue'
  import ColorsPTSDirModal from '@/pages/admin/dirs/ColorsPTSDirModal.vue'
  import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const InspectionModal = ref(null)
  let tableDataMemory = []
  const search = ref('')
  const selectedRow = ref(false)
  
  function openModal(row: any | null) {
  InspectionModal.value.open(row, getData)
}

  
  function find() {
    tableData.value = tableDataMemory.filter(el => el.colorName.toUpperCase().includes(search.value.toUpperCase()))
    if (!search.value) tableData.value = tableDataMemory
  }
  

  function deleteRow(row: any) {
    ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
          adminStore.deleteColor(row.id).then(() => {
            ElMessage({message: 'Цвет удален.', type: 'success'})
            getData()
          })
        })
  }
  
  function getData() {
    selectedRow.value = false
    globalStore.getColors(20).then(res => {
      tableData.value = res.items
      tableDataMemory = JSON.parse(JSON.stringify(res.items))
    })
  }
  
  globalStore.setTitle('Цвета кузова по ПТС')
  globalStore.steps = []
  getData()
  
  
  </script>