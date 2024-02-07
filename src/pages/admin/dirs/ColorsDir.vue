<template>
  <div>
    <div style="margin-bottom: 30px">
      <el-input v-model="search"
                :prefix-icon="Search"
                @clear="find()"
                clearable
                :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"
                @keydown.enter="find()"/>
      <el-button @click="add()"
                 :disabled="isEdit"
                 type="danger" :icon="Plus">{{ globalStore.isMobileView ? '' : 'Добавить' }}
      </el-button>
      <span v-if="globalStore.isMobileView && isEdit"><br><br></span>
      <el-button v-if="isEdit" @click="save()">Сохранить</el-button>
    </div>

    <el-table
        :data="tableData"
        ref="singleTableRef"
        empty-text="Нет данных"
        highlight-current-row>
      <el-table-column label="Цвет" prop="colorName">
        <template #default="scope">
          <el-input autofocus v-if="isEdit && selectedRow.id===scope.row.id"
                    v-model="scope.row.colorName"></el-input>
          <span v-else>{{ scope.row.colorName }}</span>
        </template>
      </el-table-column>


      <el-table-column>
        <template #default="scope">
          <div style="width: 20px; height: 20px; border: 1px solid #ddd; display: inline-block"
               :style="{background:scope.row.colorCode}"></div>
          <el-input v-if="isEdit  && selectedRow.id===scope.row.id" v-model="scope.row.colorCode"></el-input>
        </template>
      </el-table-column>

      <el-table-column width="73">
        <template #default="scope">
          <el-icon @click="edit(scope.row)" style="cursor: pointer">
            <EditPen/>
          </el-icon>
          &nbsp;
          <el-icon style="cursor: pointer" @click="deleteRow(scope.row)">
            <CloseBold/>
          </el-icon>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {EditPen, CloseBold, Search, Plus} from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
let tableDataMemory = []
const search = ref('')
const isEdit = ref(false)
const selectedRow = ref(false)


function add() {
  tableData.value.unshift({colorName: '', colorCode: '#ddd'})
  isEdit.value = true
}

function find() {
  tableData.value = tableDataMemory.filter(el => el.colorName.toUpperCase().includes(search.value.toUpperCase()))
  if (!search.value) tableData.value = tableDataMemory
}

function edit(row) {
  selectedRow.value = row
  isEdit.value = true
}

function save() {
  let row = tableData.value.find(el => !el.id)
  adminStore.addColor(row).then(() => {
    ElMessage({message: 'Новый цвет сохранен.', type: 'success'})
    getData()
  })
}

function deleteRow(row: any) {
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then(() => {
        adminStore.deleteColor(row.id).then(res => {
          ElMessage({message: 'Цвет удален.', type: 'success'})
          getData()
          isEdit.value = false
          selectedRow.value = false
        })
      })
      .catch(() => {
      })
}

function getData() {
  isEdit.value = false
  selectedRow.value = false
  adminStore.getColors().then(res => {
    tableData.value = res.items
    tableDataMemory = JSON.parse(JSON.stringify(res.items))
  })
}

globalStore.setTitle('Цвета кузова')
getData()


</script>