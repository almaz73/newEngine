<template>
  <div>
    <span class="admin-filter-field">
     <el-input v-model="search"
               :prefix-icon="Search"
               placeholder="Фильтр"
               clearable
               @clear="find()"
               @input="find()"
               :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"
               @keydown.enter="find()"/>
    <el-button v-if="selectedBrand" @click="openModal(selectedBrand)" type="danger" :icon="Plus"> Добавить</el-button>
    <br><br>

    </span>

    <h4 style="color: #999">
      {{
        (selectedBrand && selectedBrand.name) ?
            'Марка шины: ' + selectedBrand.name + '.   (моделей шин: ' + modelsTotal + ' )' :
            'Все шины ( ' + brandsTotal + ')'
      }}
    </h4>
    <br>
    <el-table
        v-if="!globalStore.isMobileView"
        :data="tableData"
        ref="singleTableRef"
        @rowClick="showModel"
        :show-header="false"
        empty-text="Нет данных"
        highlight-current-row
        style="cursor: pointer"
    >
      <el-table-column label="Название">
        <template #default="scope">
          <span v-if="!selectedBrand || !selectedBrand.name">{{ scope.row.name }} </span>
          <span v-if="selectedBrand && selectedBrand.name " style="font-size: 9px">{{ selectedBrand.name }} </span>

          <span v-if="selectedBrand && selectedBrand.name ">  &nbsp; ↶ &nbsp;  {{ scope.row.model }}  </span>
        </template>
      </el-table-column>

      <el-table-column prop="roleTitle" width="73px" v-if="selectedBrand && selectedBrand.name ">
        <template #default="scope">
          <div style="" class="admin-table-editors">
            <EditPensilCtrl @click="openModal(scope.row, $event)"/>
            <DeleteCtrl @click="deleteTire(scope.row.id, $event)"/>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:5px double #ddd">
        <span v-if="selectedBrand && selectedBrand.name"> 
          <span @click="showModel(row)">&nbsp; ↶ &nbsp;</span>
          {{ row.model }} <el-button @click="openModal(row)">
          <EditPensilCtrl />
           </el-button></span>
        <span  @click="showModel(row)" v-else> {{ row.name }}             </span>
      </div>
      
    </div>

  </div>
  <TiresDirModal ref="TiresModal"/>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {Plus, Search} from "@element-plus/icons-vue";
import TiresDirModal from "@/pages/admin/dirs/TiresDirModal.vue";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import DeleteCtrl from '@/controls/DeleteCtrl.vue'
const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
let brandsMemory = []
const brandsTotal = ref('')
const modelsTotal = ref('')
const search = ref('')
const selectedBrand = ref({name: ''})
const TiresModal = ref(null)

function find() {
  let word = search.value.toUpperCase()
  brandsTotal.value = brandsMemory.count
  if (word) tableData.value = tableData.value.filter(el => el.name.toUpperCase().includes(word))
  else tableData.value = brandsMemory.items.map(el => ({name: el}))
}

function openModal(row, event) {
  event && event.stopPropagation()
  TiresModal.value.open(row, getData)
}


function deleteTire(id: number, event) {
  event.stopPropagation()
  ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then((res) => {
        res && adminStore.deleteTire(id).then(() => {
          ElMessage({message: 'Модель шины успешно удалена', type: 'success'})
          getData()
        })
      })
}

function showModel(brand) {
  if (!selectedBrand.value || !selectedBrand.value.name) {
    selectedBrand.value = brand
    adminStore.getTires(brand.name).then(res => {
      tableData.value = res.items.reverse()
      modelsTotal.value = res.count
    })
  } else {
    search.value = ''
    selectedBrand.value = null
    modelsTotal.value = null
    find()
  }
}

function getData() {
  selectedBrand.value = null
  adminStore.getTireBrands().then(res => {
    tableData.value = res.items.map(el => ({name: el}))
    brandsMemory = JSON.parse(JSON.stringify(res))
    brandsTotal.value = res.count
  })
}

getData()
globalStore.setTitle('Админка - Шины')
globalStore.steps = []
</script>