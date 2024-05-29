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
          <span v-if="selectedBrand && selectedBrand.name"> - - {{ scope.row.name }}
            <el-button @click.stop="showPicture(scope.row.name)" style="float: right">Посмотреть</el-button>
          </span>
          <span v-else>   {{ scope.row.name }}</span>
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
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import {Search} from "@element-plus/icons-vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
let brandsMemory = []
let modelsMemory = []
const brandsTotal = ref('')
const modelsTotal = ref('')
const search = ref('')
const selectedBrand = ref({name: ''})

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
      modelsMemory = JSON.parse(JSON.stringify(res))
      modelsTotal.value = res.length
    })
  } else {
    search.value = ''
    selectedBrand.value = null
    find()
  }
}


function getData() {
  adminStore.getTires().then(res => {
    console.log('res', res)
    tableData.value = res.items
    brandsMemory = JSON.parse(JSON.stringify(res))
    brandsTotal.value = res.count
  })
}

function showPicture(model:string) {
  let url = `https://www.google.com/search?q=${selectedBrand.value.name}+${model}+foto`
  window.open(url)
}

getData()
globalStore.setTitle('Автомобильные бренды')
globalStore.steps = []
</script>