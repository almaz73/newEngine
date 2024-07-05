<template>
    <div class="admin-filter-field">
  
  
  
      <div style="display: flex; align-items: center;">
        <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
      </div>
      <br><br>
      <el-table v-if="!globalStore.isMobileView"
                :data="tableData"
                style="width: 100%; margin-bottom: 20px"
                :default-sort="{ prop: 'order', order: 'descending'}"
                highlight-current-row>
  
        <el-table-column prop="title" label="Название"/>
        <el-table-column prop="description" label="Описание"/>
        <el-table-column prop="typeTitle" label="Тип"/>
        <el-table-column prop="sectionTitle" label="Раздел"/>
        <el-table-column prop="itemTitle" label="Элемент"/>
        <el-table-column prop="roleTitle" width="73px">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <img @click="openModal(scope.row)" alt=""
                   title="Редактировать"
                   src="@/assets/icons/icon-pencil-gray.png">
              <img @click="deleteCategory(scope.row.id)" alt=""
                   src="@/assets/icons/icon-cross-gray.png"
                   title="Удалить">
            </div>
          </template>
        </el-table-column>
      </el-table>
  
        
      <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.title }}
           <el-button @click="openModal(row)">
             <img  alt=""
                  title="Редактировать"
                  src="@/assets/icons/icon-pencil-gray.png">
           </el-button>
        </span>
          <div v-if="row.description"><small>Описание:</small> {{ row.description }}</div>
          <div v-if="row.typeTitle"><small>Тип:</small> {{ row.typeTitle }}</div>
          <div v-if="row.sectionTitle"><small>Раздел:</small> {{ row.sectionTitle }}</div>
          <div v-if="row.itemTitle"><small>Элемент:</small> {{ row.itemTitle }}</div>
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
    <PolicyDirModal ref="policyDirModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {computed, ref} from "vue";
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {useGlobalStore} from "@/stores/globalStore";
  import PolicyDirModal from "@/pages/admin/dirs/PolicyDirModal.vue";
  import {Plus} from "@element-plus/icons-vue";
  import {formatDateDDMMYYYY, gotoTop} from "@/utils/globalFunctions";
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const isEdit = ref(false)
  const selectedRow = ref(false)
  const policyDirModal = ref(null)
  const total = ref(0)
  const rowsPerPage = ref(10)
  const currentPage = ref(1)
  const departments = ref([])
  const search = ref({orgElement:'',department:''})
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
    policyDirModal.value.open(row, getData)
  }
  
  
  function deleteCategory(id: number) {
    ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then((res) => {
          res && adminStore.deleteMarkupCategory(id).then(() => {
            ElMessage({message: 'Политика успешно удалена', type: 'success'})
            getData()
          })
        })
  }
  
  
  
  function getData(noCach: string) {
    isEdit.value = false
    selectedRow.value = false
    adminStore.getPolicy(noCach).then(res => {
      tableData.value = res.items
      total.value = res.totalCount
    })
  }
  
  globalStore.setTitle('Политики')
  globalStore.steps = []
  getData()
  
  
  </script>