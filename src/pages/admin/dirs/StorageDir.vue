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
      <br><br>
      <el-table v-if="!globalStore.isMobileView"
              :data="tableData"
                style="width: 100%; margin-bottom: 20px"
                :default-sort="{ prop: 'order', order: 'descending'}"
                >
        <el-table-column  prop="title" label="Название" width="185" sortable/>
        <el-table-column prop="region" label="Регион" sortable/>
        <el-table-column prop="city" label="Город" sortable/>
        <el-table-column prop="places" label="Место" />
        <el-table-column prop="avitoShop" label="АВИТО" sortable/>
        <el-table-column prop="orgElementName" label="Организация" sortable/>
        <el-table-column prop="typeName" label="Тип склада" sortable/>
        <el-table-column prop="phone" label="Телефон" sortable/>
        <el-table-column prop="latitude" label="Широта" sortable/>
        <el-table-column prop="longitude" label="Долгота" sortable/>
        <el-table-column prop="address" label="Адрес" sortable/>
        <el-table-column prop="roleTitle" width="73px">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <img v-if="scope.row.isActive" @click="toggleActive(scope.row.id)" alt=""
                 title="Разблокировать"
                 src="@/assets/icons/icon-unblocked-gray.png">
              <img v-if="!scope.row.isActive" @click="toggleActive(scope.row.id)" alt=""
                 title="Заблокировать"
                 src="@/assets/icons/icon-blocked-red.png">
            <img @click="openModal(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <img @click="deleteRow(scope.row.id)" alt=""
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
    </div>
    <StorageDirModal  ref="modal"/>
  </template>
  <script setup lang="ts">
  import {useAdminStore} from "@/stores/adminStore";
  import {computed, ref} from "vue";
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {useGlobalStore} from "@/stores/globalStore";
  import StorageDirModal from "@/pages/admin/dirs/StorageDirModal.vue";
  import {Plus, Search} from '@element-plus/icons-vue'
  import {formatDateDDMMYYYY, gotoTop} from "@/utils/globalFunctions";
  import {locationType} from "@/utils/globalConstants";
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  const isEdit = ref(false)
  const selectedRow = ref(false)
  const modal = ref(null)
  const total = ref(0)
  const rowsPerPage = ref(10)
  const search = ref({orgElement:'',department:''})
  const departments = ref([])
  const organizations = ref([])
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


  function openModal(row: any | null) {
    modal.value.open(row, getData)
  }

  function toggleActive(id:number) {
    adminStore.switchLocation(id).then(() => {
            getData()
    })
  }

  function deleteRow(id: number) {
    ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then((res) => {
          res && adminStore.deleteLocation(id).then(() => {
            ElMessage({message: 'Запись успешно удалена', type: 'success'})
            getData()
          })
        })
  }
  function getLocationType(code:number){
    return locationType.find(el => el.code === code)?.name
  }

  function getData() {
    isEdit.value = false
    selectedRow.value = false

    adminStore.getLocation(false,true).then(res => {
      tableData.value = res.items
      total.value = res.total
      tableData.value = tableData.value.map(item => ({...item,"typeName": getLocationType(item.type)}));
    })
    globalStore.getOrganizations().then(res => organizations.value = res.items)
  }

globalStore.setTitle('Место хранения')
globalStore.steps = []
getData()


  </script>
