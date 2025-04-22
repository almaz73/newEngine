<template>
    <div>
      <span class="admin-filter-field">
       <el-input v-model="search"
                 :prefix-icon="Search"
                 placeholder="Фильтр"
                 clearable
                 @clear="find()"
                 @input="find()"
                 :style="{ marginRight: globalStore.isMobileView ? '80px' : '30px' }"/>

      <el-button v-if="selectedBrand" @click="openModal(selectedBrand)" type="danger" :icon="Plus"> Добавить</el-button>
      <br><br>
    </span>
      <h4 style="color: #999">
        {{
          (selectedBrand && selectedBrand.model) ?
              'Автомобильный бренд: ' + selectedBrand.model + '.   (моделей: ' + modelsTotal + ' )' :
              'Все бренды ( ' + brandsTotal + ')'
        }}

      <el-button  v-if="selectedBrand && selectedBrand.model && !globalStore.isMobileView" @click="showBrands()"  :icon="ArrowLeft">{{ globalStore.isMobileView ? '' :
                  'Вернуться к брендам' }}
              </el-button>
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
        <el-table-column props="model" label="Название" sortable>
          <template #default="scope">
            <span>   {{ scope.row.model }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="selectedBrand && selectedBrand.model"  prop="roleTitle" width="73px">
          <template #default="scope">
            <div style="" class="admin-table-editors">
              <EditPensilCtrl @click="openModal(scope.row)" />
              <DeleteCtrl @click="deleteRow(scope.row)" />
              <!-- <img @click="deleteRow(scope.row)" alt=""
                   src="@/assets/icons/icon-cross-gray.png"
                   title="Удалить"> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="vertical-table" v-if="globalStore.isMobileView">
        <div v-for="(row, ind) in tableData" :key="ind" style="border-top:5px double #ddd">
          <span v-if="selectedBrand && selectedBrand.model"> 
            <span @click="showBrands(row)">&nbsp; ↶ &nbsp;</span>
            {{ row.model }} <el-button @click="openModal(row)">

            <EditPensilCtrl />
            </el-button></span>
          <span  @click="showModel(row)" v-else> {{ row.model }}             </span>
        </div>
      
      </div>
    </div>
    <BrendsPTSDirModal ref="modal" />
  </template>
  <script setup lang="ts">
  import {useGlobalStore} from "@/stores/globalStore";
  import {useAdminStore} from "@/stores/adminStore";
  import {ref} from "vue";
  import { ElMessage, ElMessageBox, ElTable } from "element-plus";
  import {Search,ArrowLeft,Plus} from "@element-plus/icons-vue";
  import BrendsPTSDirModal from "@/pages/admin/dirs/BrendsPTSDirModal.vue"
  import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
  import DeleteCtrl from '@/controls/DeleteCtrl.vue'
  const globalStore = useGlobalStore()
  const adminStore = useAdminStore()
  const tableData = ref([])
  let brandsMemory:any = []
  let modelsMemory:any = []
  const brandsTotal = ref('')
  const modelsTotal = ref('')
  const search = ref('')
  const modal = ref(null)
  const selectedBrand = ref({model: ''})

  function find() {
    let word = search.value.toUpperCase()
    if (!selectedBrand.value || !selectedBrand.value.model) {
      tableData.value = brandsMemory.filter(el => el.model.toUpperCase().includes(word))
    } else {
      tableData.value = modelsMemory.filter(el => el.model.toUpperCase().includes(word))
    }
  }
  function showModel(val:string) {
    if (!selectedBrand.value || !selectedBrand.value.model) {
      selectedBrand.value = val

      adminStore.getMarks(val.model).then((res) => {
        tableData.value = res.items
        modelsMemory = JSON.parse(JSON.stringify(res.items))
        modelsTotal.value = res.count
      })
    }
  }
  
function openModal(row: any | null) {
  if(row) row.brand = selectedBrand.value.model
  modal.value.open(row, () => {getData(); showBrands() })
}

function deleteRow(row){
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        .then(() => {
          adminStore.deleteBrands(row.id).then(() => {
            ElMessage({message: 'Строка удалена.', type: 'success'})
            getData()
            showBrands()
          })
        })
        .catch(() => {
        })
  }
  
  function showBrands() {
    search.value = ''
    selectedBrand.value = {model:''}
    find()
  }
  
  function getData() {
    adminStore.getBrands().then(res => {
      tableData.value = res.items.map((item) => ({model: item }))
      brandsMemory = JSON.parse(JSON.stringify(tableData.value))
      brandsTotal.value = res.count
    })
  }
  
  
  getData()
  globalStore.setTitle('Админка - Марки по ПТС')
  globalStore.steps = []
  </script>