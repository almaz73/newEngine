<template>
    <div class="admin-filter-field">
      <div style="display: flex; align-items: center;">
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
      <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
    </div>
      <br><br>
      <el-table v-if="!globalStore.isMobileView"
                :data="tableData"
                style="width: 100%; margin-bottom: 20px"
                :default-sort="{ prop: 'order', order: 'descending'}"
                highlight-current-row>
        <el-table-column label="Организация" prop="orgElement.name" width="185" sortable/>
        <el-table-column prop="department.name" label="Отдел"/>
        <el-table-column prop="priceLow" label="Цена продажи, от"/>
        <el-table-column prop="priceHigh" label="Цена продажи, до"/>
        <el-table-column prop="categoryA" label="Срочно выкуп (A, %)"/>
        <el-table-column prop="categoryB" label="Рекомендуемый выкуп (B, %)"/>
        <el-table-column prop="categoryC" label="Выкуп (C, %)"/>
        <el-table-column prop="categoryD" label="Ограничено (D, %)"/>
        <el-table-column prop="categoryS" label="Запрет выкупа (S, %)"/>
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
          <span>{{ row.orgElement.name }}
            {{ formatDateDDMMYYYY(row.validFrom) }}
             <el-button>
               <img @click="openModal(row)" alt=""
                    title="Редактировать"
                    src="@/assets/icons/icon-pencil-gray.png">
             </el-button>
          </span>
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
    <EstimateMatrixModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {computed, ref} from "vue";
  import {ElMessageBox, ElTable} from "element-plus";
  import {useGlobalStore} from "@/stores/globalStore";
  import EstimateMatrixModal from "@/pages/admin/dirs/estimate/EstimateMatrixModal.vue";
  import {EditPen, CloseBold,Plus, Search} from '@element-plus/icons-vue'
  import {formatDateDDMMYYYY, gotoTop} from "@/utils/globalFunctions";
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
  
  function openModal(row: any | null) {
    InspectionModal.value.open(row, getData)
  }

  
  function deleteCategory(id: number) {
    ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then((res) => {
          res && adminStore.deleteMarkupMatrix(id).then(() => {
            ElMessageBox({message: 'Запись успешно удалена', type: 'success'})
            getData()
          })
        })
  }
  
  function getData() {
    isEdit.value = false
    selectedRow.value = false
    adminStore.getMarkupMatrix(filter).then(res => {
      tableData.value = res.models
      total.value = res.totalCount
    })
    globalStore.getOrganizations().then(res => organizations.value = res.items)
  }

  function open(){
    globalStore.setTitle('Матрица наценки')
    globalStore.steps = []
    getData()
  }

  defineExpose({open});
  
  </script>