<template>
  <div>
    <span>
     <el-input v-model="search"
               :prefix-icon="Search"
               placeholder="Фильтр"               
               clearable
               @clear="find()"
               @keydown.enter="find()":style="{ marginRight: globalStore.isMobileView ? '80px' : '30px' }"/>
    </span>
    <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>
    <br><br>
    <h4 style="color: #999">
      {{
        (selectedBrand && selectedBrand.name) ?
            'Автомобильный бренд: ' + selectedBrand.name + '.   (моделей: ' + modelsTotal + ' )' :
            'Все бренды ( ' + brandsTotal + ')'
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
          <span v-if="selectedBrand && selectedBrand.name">
            <button @click.stop="showBrands()"> ◄ </button>
            {{ scope.row.name }}
            <el-button @click.stop="showPicture(scope.row.name)" style="float: right">Посмотреть</el-button>
          </span>
          <span v-else>   {{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleTitle" width="73px" v-if="selectedBrand && selectedBrand.name">
        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img @click="openModal(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <img @click="deleteModel(scope.row.id)" alt=""
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
        <span v-if="selectedBrand && selectedBrand.name">
          <button @click.stop="showBrands()"> ◄ </button>
          {{ row.name }}</span>
        <span v-else>{{ row.name }}</span>
      </div>
    </div>

  </div>
  <BrendsDirModal ref="BrendsModal"/>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {ElMessageBox, ElTable } from "element-plus";
import {Plus, Search} from "@element-plus/icons-vue";
import BrendsDirModal from "@/pages/admin/dirs/BrendsDirModal.vue";

const globalStore = useGlobalStore()
const tableData = ref([])
let brandsMemory = []
let modelsMemory = []
const brandsTotal = ref('')
const modelsTotal = ref('')
const search = ref('')
const selectedBrand = ref({name: ''})
const BrendsModal = ref(null)

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

function showModel(val) {
  if (!selectedBrand.value || !selectedBrand.value.name) {
    selectedBrand.value = val
    globalStore.getModels(val.id).then((res) => {
      tableData.value = res
      console.log(res)
      modelsMemory = JSON.parse(JSON.stringify(res))
      modelsTotal.value = res.length
    })
  }
}



function showBrands() {
  search.value = ''
  selectedBrand.value = null
  find()
}
function openModal(row: any | null){
  row.brend = selectedBrand.value.name
  BrendsModal.value.open(row, getData)
}
function deleteModel(){
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
        // .then(() => {
        //   adminStore.deleteBanks(row.id).then(res => {
        //     ElMessage({message: 'Запись удалена.', type: 'success'})
        //     getData()
        //   })
        // })
        // .catch(() => {
        // })
}

function getData() {
  globalStore.getBrands().then(res => {
    tableData.value = res
    brandsMemory = JSON.parse(JSON.stringify(res))
    brandsTotal.value = res.length
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