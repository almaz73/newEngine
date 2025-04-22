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
  
      <el-table v-if="!globalStore.isMobileView"
          :data="tableData"
          empty-text="Нет данных"
          highlight-current-row>   
        <el-table-column label="Название" prop="typeTitle" sortable />
        <el-table-column label="Подтип" prop="subTypeTitle" sortable />
        <el-table-column label="Текст" prop="title" sortable />
        <el-table-column width="73">
          <template #default="scope">
            <div style="" class="admin-table-editors">
            <img @click="openModal(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <DeleteCtrl @click="deleteRow(scope.row)"/>
            <!-- <img @click="deleteRow(scope.row)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить"> -->
                 </div>
          </template>
        </el-table-column>
  
      </el-table>
      <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.typeTitle }}
           <el-button @click="openModal(row)">
             <img  alt=""
                  title="Редактировать"
                  src="@/assets/icons/icon-pencil-gray.png">
           </el-button>
        </span>
        
        <div v-if="row.subTypeTitle"><small>Подтип:</small> {{ row.subTypeTitle }}</div>
        <div v-if="row.title"><small>Текст:</small> {{ row.title }}</div>
      </div>
    </div>
    </div>
    <ReasonTemplatesDirModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {ElMessage, ElMessageBox, ElTable} from "element-plus";
  import {useGlobalStore} from "@/stores/globalStore";
  import {Search, Plus} from '@element-plus/icons-vue'
  import ReasonTemplatesDirModal from '@/pages/admin/dirs/ReasonTemplatesDirModal.vue'
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
    tableData.value = tableDataMemory.filter(el => el.title.toUpperCase().includes(search.value.toUpperCase()))
    if (!search.value) tableData.value = tableDataMemory
  }
  
  
  function deleteRow(row: any) {
    ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
          adminStore.deleteReasonTemplates(row.id).then(() => {
            ElMessage({message: 'Строка удалена', type: 'success'})
            getData()
          })
        })
  }
  
  function getData() {
    adminStore.getReasonTemplates().then(res => {
      tableData.value = res.items
      tableDataMemory = JSON.parse(JSON.stringify(res.items))
    })
  }
  
  globalStore.setTitle('Админка - Шаблоны причин')
  globalStore.steps = []
  getData()
  
  
  </script>