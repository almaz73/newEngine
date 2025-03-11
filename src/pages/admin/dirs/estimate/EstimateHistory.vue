<template>
    <div >
      <div class="admin-filter-field">
        <span style="margin-right:15px;">Организация</span>

          <el-select
          :style="{marginRight: globalStore.isMobileView?'80px':'50px'}"
            style="width: 190px"
            :prefix-icon="Search"
            placeholder="Организация"
            @change="changeOrg"
            v-model="search.orgElement"
            filterable
            clearable>
          <el-option v-for="item in organizations" :key="item.id" :label="item.name"
                    :value="item.id"/>
          </el-select>
          <br>
          <span v-if="search.orgElement">
          <span style="margin-right:15px;">Отдел</span>          
          <el-select
          :style="{marginRight: globalStore.isMobileView?'80px':'50px'}"
          :prefix-icon="Search"
            style="width: 190px"
            title="Отдел"
            placeholder="Отдел"
            @change="changeDep"
            v-model="search.department"
            filterable
            clearable>
          <el-option v-for="item in departments" :key="item.id" :label="item.name"
                    :value="item.id"/>
          </el-select>
        </span>
      <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
    </div>
      <el-table v-if="!globalStore.isMobileView"
              :data="tableData"
                style="width: 100%; margin-bottom: 20px"
                :default-sort="{ prop: 'order', order: 'descending'}"
                :row-class-name="getRowClass"
                >
        <el-table-column label="Организация" prop="orgElement.name" width="185" sortable/>
        <el-table-column prop="department.name" label="Отдел"/>
        <el-table-column prop="typeTitle" label="Название">
        </el-table-column>
        <el-table-column prop="rate" label="Процент, %"/>
        <el-table-column label="Период действия, с" sortable>
          <template #default="scope">
            <span v-if="isEdit && selectedRow.id===scope.row.id">
              <el-date-picker
                  v-model="scope.row.validFrom"
                  format="DD.MM.YYYY"
              /></span>
            <span v-else> {{ formatDateDDMMYYYY(scope.row.validFrom) }}</span>
          </template>
        </el-table-column>
  
        <el-table-column label="Период действия, до" sortable>
          <template #default="scope">
            <span v-if="isEdit && selectedRow.id===scope.row.id"><el-date-picker
                v-model="scope.row.validTo"
                format="DD.MM.YYYY"
            /></span>
  
            <span v-else> {{ formatDateDDMMYYYY(scope.row.validTo) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleTitle" width="120px">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <img v-if="scope.row.isActive" @click="toggleActive(scope.row.id)" alt=""
                 title="Разблокировать"
                 src="@/assets/icons/icon-unblocked-gray.png">
              <img v-if="!scope.row.isActive" @click="toggleActive(scope.row.id)" alt=""
                 title="Заблокировать"
                 src="@/assets/icons/icon-blocked-red.png">
              <img @click="openModal(scope.row, 'copy')" alt=""
                 src="@/assets/icons/copy.gif"
                 title="Создать новый на основе этого" >
              <EditPensilCtrl @click="openModal(scope.row)"/>
              <img @click="deleteCategory(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">          
            </div>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="vertical-table" v-if="globalStore.isMobileView">
        <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
          <span>{{ row.orgElement.name }}
            <EditPensilCtrl @click="openModal(row)"/>
          </span>
            <div v-if="row.department && row.department.name"><small>Отдел:</small> {{ row.department?.name }}</div>
            <div v-if="row.typeTitle"><small>Название:</small> {{ row.typeTitle }}</div>
            <div ><small>Процент, %:</small> {{ row.rate }}</div>
            <div v-if="row.validFrom"><small>Период действия, с:</small> {{ formatDateDDMMYYYY(row.validFrom) }}</div>
            <div v-if="row.validTo"><small>Период действия, до:</small> {{ formatDateDDMMYYYY(row.validTo) }}</div>
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
    <EstimateHistoryModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {computed, ref} from "vue";
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {useGlobalStore} from "@/stores/globalStore";
  import EstimateHistoryModal from "@/pages/admin/dirs/estimate/EstimateHistoryModal.vue";
  import {Plus, Search} from '@element-plus/icons-vue'
  import {formatDateDDMMYYYY, gotoTop} from "@/utils/globalFunctions";
  import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const isEdit = ref(false)
  const selectedRow = ref(false)
  const InspectionModal = ref(null)
  const total = ref(0)
  const rowsPerPage = ref(10)
  const currentPage = ref(1)
  const departments = ref([])
  const organizations = ref([])
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
  function changeOrg(id) {
    if(id) adminStore.getDepartmentsWithBuyLocations(id).then(res => departments.value = res)
    else{
      search.value.orgElement = ''
      search.value.department = ''
    }
    find()
  }

  function changeDep(id){
    if(!id)  search.value.department = ''
    find()
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
  
  function openModal(row: any | null,copy: string | null) {
    InspectionModal.value.open(row, getData,copy)
  }

  function toggleActive(id:number) {
    adminStore.switchActiveMarkupHistory(id).then(() => {
            getData()
    })
  }
  
  function deleteCategory(id: number) {
    ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then((res) => {
          res && adminStore.deleteMarkupHistory(id).then(answer => {
            console.log('answer', answer)
            ElMessage({message: 'Запись успешно удалена', type: 'success'})
            getData()
          })
        })
  }
  function getRowClass(obj:any) {
        switch (obj.row.typeTitle) {
          case 'Зеленая':
            return 'row-green';
          case 'Желтая':
            return 'row-yellow';
          case 'Красная':
            return 'row-red';
          default:
            return '';
        }
    }
  
  function getData() {
    isEdit.value = false
    selectedRow.value = false
  
    adminStore.getMarkupHistory(filter).then(res => {
      tableData.value = res.models
      total.value = res.totalCount
    })
    globalStore.getOrganizations().then(res => organizations.value = res.items)
  }
  
  function open(){
    globalStore.setTitle('Админка - История повреждений')
    globalStore.steps = []
    getData()
  }
  defineExpose({open});
  
  
  </script>

<style>

.row-green,.row-yellow,.row-red{
  transition: background-color .25s ease;
}
.row-green {
  background-color: rgb(221, 255, 221) !important;
}
.row-yellow {
  background-color: rgb(255, 255, 221) !important;
}
.row-red {
  background-color: rgb(255, 221, 221) !important;
}
.row-green:hover {
  background-color: rgb(200, 235, 200) !important;
}
.row-yellow:hover {
  background-color: rgb(235, 235, 200) !important;
}
.row-red:hover {
  background-color: rgb(235, 200, 200) !important;
}
.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
  background-color: inherit !important;
}
</style>