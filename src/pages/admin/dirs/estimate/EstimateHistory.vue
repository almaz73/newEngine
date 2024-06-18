<template>
    <div class="admin-filter-field">
      <div style="display: flex; align-items: center;">
      <span style="margin-right:15px;">Организация</span>
      <el-input v-model="search.orgElement"
                :prefix-icon="Search"
                placeholder="Поиск"
                @clear="search.orgElement=''"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'50px'}"

                @keydown.enter="getData()"/>
                <br>
      <span style="margin-right:15px;">Отдел</span>          
      <el-input v-model="search.department"
                :prefix-icon="Search"
                placeholder="Поиск"
                @clear="search.department=''"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'50px'}"

                @keydown.enter="getData()"/>
      <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
    </div>
      <br><br>
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
    <EstimateHistoryModal ref="InspectionModal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {computed, ref} from "vue";
  import {ElMessageBox, ElTable} from "element-plus";
  import {useGlobalStore} from "@/stores/globalStore";
  import EstimateHistoryModal from "@/pages/admin/dirs/estimate/EstimateHistoryModal.vue";
  import {Plus, Search} from '@element-plus/icons-vue'
  import {formatDateDDMMYYYY, gotoTop} from "@/utils/globalFunctions";
  import {colorTypeList} from "@/utils/globalConstants";
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const isEdit = ref(false)
  const selectedRow = ref(false)
  const InspectionModal = ref(null)
  const total = ref(0)
  const rowsPerPage = ref(5)
  const currentPage = ref(1)
  const search = ref({orgElement:'',department:''})
  const filter = {
    filter: {},
    limit: rowsPerPage.value,
    offset: 0,
    search: ''
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
          res && adminStore.deleteMarkupHistory(id).then(() => {
            ElMessageBox({message: 'Запись успешно удалена', type: 'success'})
            getData()
          })
        })
  }
  function getColor(nameColor:string){
    const type = colorTypeList.find(item => item.name === nameColor);
    return type ? type.color : 'white';
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
      console.log(res)
      tableData.value = res.models
      total.value = res.totalCount
    })
  }
  
  globalStore.setTitle('Категория наценки')
  globalStore.steps = []
  getData()
  
  
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