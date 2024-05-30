<template>
  <div>
    <span>
     <el-input v-model="search"
               :prefix-icon="Search"
               clearable
               @clear="find()"
               @keydown.enter="find()"/>
    </span>
    <h4 style="color: #999">
      {{
        (selectedBrand && selectedBrand.name) ?
            'Автомобильный бренд: ' + selectedBrand.name + '.   (моделей: ' + modelsTotal + ' )' :
            'Все бренды ( ' + brandsTotal + ')'
      }}
    </h4>
    <br>
    --{{selectedBrand}}-
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
          <span v-if="selectedBrand && selectedBrand.name "> - - {{ scope.row.model }}  </span>
          <span v-else>   {{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="roleTitle" width="73px" v-if="selectedBrand && selectedBrand.name ">
        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img @click="openModal(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <img @click="deleteInsp(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData"
           @click="showModel(row)"
           :key="ind" style="border-top:5px double #ddd">
        <span v-if="selectedBrand && selectedBrand.name"> - - {{ row.name }}</span>
        <span v-else>{{ row.name }}</span>
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
import {Search} from "@element-plus/icons-vue";
import TiresDirModal from "@/pages/admin/dirs/TiresDirModal.vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
let brandsMemory = []
let modelsMemory = []
const brandsTotal = ref('')
const modelsTotal = ref('')
const search = ref('')
const selectedBrand = ref({name: ''})
const TiresModal = ref(null)

function find() {
  let word = search.value.toUpperCase()
  if (!word) {
    tableData.value = brandsMemory
    return
  }

  if (!selectedBrand.value) {
    tableData.value = brandsMemory.filter(el => el.name.toUpperCase().includes(word))
  } else {
    tableData.value = modelsMemory.filter(el => el.name.toUpperCase().includes(word))
  }
}

function openModal(row: any | null) {
  TiresModal.value.open(row, getData)
}


function deleteInsp(id: number) {
  ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then((res) => {
        res && adminStore.deleteInspection(id).then(() => {
          ElMessage({message: 'Осмотре успешно удален', type: 'success'})
          getData()
        })
      })
}

function showModel(brand) {


  if (!selectedBrand.value || !selectedBrand.value.name) {
    selectedBrand.value = brand
    adminStore.getTires(brand.name).then(res => {
      console.log('res', res)
      tableData.value = res.items
      modelsMemory = JSON.parse(JSON.stringify(res))


    })
  } else {
    search.value = ''
    selectedBrand.value = null
    find()
  }
}


function getData() {
  adminStore.getTireBrands().then(res => {
    console.log('res', res)
    tableData.value = res.items.map(el=>({name:el}))
    brandsMemory = JSON.parse(JSON.stringify(res))
    brandsTotal.value = res.count
    console.log('tableData.value', tableData.value)
  })
}

function showPicture(model: string) {
  let url = `https://www.google.com/search?q=${selectedBrand.value.name}+${model}+foto`
  window.open(url)
}

getData()
globalStore.setTitle('Автомобильные бренды')
globalStore.steps = []
</script>