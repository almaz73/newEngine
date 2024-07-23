<template>
    <div class="admin-filter-field">
      <el-input v-model="like"
                :prefix-icon="Search"
                placeholder="Фильтр"
                @clear="like=''"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"
                @input="toSearch()"/>
      <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
      <br><br>
      <el-table v-if="!globalStore.isMobileView"
                :data="tableData"
                style="width: 100%; margin-bottom: 20px"
                :default-sort="{ prop: 'order', order: 'descending'}"
                highlight-current-row>
        <el-table-column prop="damageName" label="Название" sortable/>
        <el-table-column prop="roleTitle" width="73px">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <EditPensilCtrl @click="openModal(scope.row)"/>
              <img @click="deleteInsp(scope.row.id)" alt=""
                   src="@/assets/icons/icon-cross-gray.png"
                   title="Удалить">
            </div>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="vertical-table" v-if="globalStore.isMobileView">
        <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
          <span>{{ row.name }}
            <EditPensilCtrl @click="openModal(row)"/>
          </span>
          <div><small>Категория:</small> {{ row.inspectionItemCategory }}</div>
          <div><small>Порядок:</small> {{ row.order }}</div>
        </div>
      </div>
    </div>
    <InspectionDamageModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import {ElMessage, ElMessageBox, ElTable} from "element-plus";
  import {useGlobalStore} from "@/stores/globalStore";
  import InspectionDamageModal from "@/pages/admin/dirs/inspection/InspectionDamageModal.vue";
  import {Plus, Search} from "@element-plus/icons-vue";
  import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  let tableDataMemory = []
  const isEdit = ref(false)
  const selectedRow = ref(false)
  const InspectionModal = ref(null)
  const like = ref('')
  
  function openModal(row: any | null) {
    InspectionModal.value.open(row, getData)
  }
  
  
  function deleteInsp(id: number) {
    ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then((res) => {
          res && adminStore.deleteDamage(id).then(() => {
            ElMessage({message: 'Осмотр успешно удален', type: 'success'})
            getData()
          })
        })
  }
  
  function toSearch() {
    let word = like.value.toUpperCase()
    tableData.value = tableDataMemory.filter(el => el.damageName.toUpperCase().includes(word))
  }
  
  
  function getData() {
    isEdit.value = false
    selectedRow.value = false
    adminStore.getDomage().then(res => {
      tableData.value = res.items
      tableDataMemory = JSON.parse(JSON.stringify(res.items))
    })
  }
  function open(){
    globalStore.setTitle('Повреждения')
    globalStore.steps = []
    getData()
  }

  defineExpose({open});
  
  </script>