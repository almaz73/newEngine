<template>
    <div>
      <div class="admin-filter-field">
        <el-input v-model="search" :prefix-icon="Search" @clear="find()" clearable
            placeholder="Фильтр"
                :style="{ marginRight: globalStore.isMobileView ? '80px' : '30px' }" @keydown.enter="find()" />
  
        <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
      </div>
      <br><br>
      <el-table v-if="!globalStore.isMobileView"
                :data="tableData"
                style="width: 100%; margin-bottom: 20px"
                :default-sort="{ prop: 'order', order: 'descending'}"
                highlight-current-row>
  
        <el-table-column prop="userTitle" label="Пользователь"/>
        <el-table-column prop="legalTitle" label="Юр. Лицо"/>
        <el-table-column prop="signDocument" label="Документ подписи"/>
        <el-table-column prop="data" label="Дата"/>
        <el-table-column prop="number" label="Номер"/>
        <el-table-column prop="defaultSignText" label="За кого подписывает"/>
        <el-table-column prop="roleTitle" width="73px">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <EditPensilCtrl @click="openModal(scope.row)"/>
              <DeleteCtrl @click="deleteCategory(scope.row.id)"/>
            </div>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.userTitle }}
           <el-button @click="openModal(row)">
             <EditPensilCtrl/>
           </el-button>
        </span>
        <div v-if="row.legalTitle"><small>Юр. Лицо:</small> {{ row.legalTitle }}</div>
        <div v-if="row.signDocument"><small>Документ подписи:</small> {{ row.signDocument }}</div>
        <div v-if="row.data"><small>Дата:</small> {{ row.data }}</div>
        <div v-if="row.number"><small>Номер:</small> {{ row.number }}</div>
        <div v-if="row.defaultSignText"><small>За кого подписывает:</small> {{ row.defaultSignText }}</div>
      </div>
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
    <SignDocumentDirModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {computed, ref} from "vue";
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {useGlobalStore} from "@/stores/globalStore";
  import SignDocumentDirModal from "@/pages/admin/dirs/SignDocumentDirModal.vue";
  import {Plus, Search} from "@element-plus/icons-vue";
  import {gotoTop} from "@/utils/globalFunctions";
  import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
  import DeleteCtrl from '@/controls/DeleteCtrl.vue'
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const isEdit = ref(false)
  const selectedRow = ref(false)
  const InspectionModal = ref(null)
  const total = ref(0)
  const rowsPerPage = ref(10)
  const currentPage = ref(1)
  const search = ref('')
  const filter = {
    filter: {},
    limit: rowsPerPage.value,
    offset: 0,
    search: ''
  }
  function find() {
      if (!search.value.orgElement && !search.value.department) filter.search = '';
      else filter.search = `OrgId=${search.value.orgElement}&DepartmentId=${search.value.department}`;
      getData()
    }
  
  const pageDescription = computed(() => {
    let start = (currentPage.value - 1) * rowsPerPage.value + 1
    let end = start + rowsPerPage.value - 1
    return start + ' - ' + end
  })
  
  function changePage(val) {
    currentPage.value = val
    filter.offset = (val - 1) * rowsPerPage.value
    getData()
    if (globalStore.isMobileView) gotoTop()
  }
  
  function changePageSize(val) {
    rowsPerPage.value = val
    filter.offset = 0
    filter.limit = rowsPerPage.value
    getData()
  }
  
  function openModal(row: any | null) {
    InspectionModal.value.open(row, getData)
  }
  
  
  function deleteCategory(id: number) {
    ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then((res) => {
          res && adminStore.deleteSignAuthority(id).then(() => {
            ElMessage({message: 'Строка успешно удалена', type: 'success'})
            getData()
          })
        })
  }
  
  
  
  function getData() {
    isEdit.value = false
    selectedRow.value = false
    adminStore.getSignAuthority(filter).then(res => {
      tableData.value = res.items
      total.value = res.totalCount
    })
  }
  
  globalStore.setTitle('Админка - Подпись документов')
  globalStore.steps = []
  getData()
  
  
  </script>