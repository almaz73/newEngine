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
      <el-button v-if="isEdit" @click="selectedRow = isEdit = false">Сброс</el-button>
    </div>

    <el-table
        :data="tableData"
        empty-text="Нет данных"
        highlight-current-row>
      <el-table-column label="Цвет" prop="colorName">
        <template #default="scope">
          <el-input placeholder="Цвет" autofocus v-if="isEdit && selectedRow.id===scope.row.id"
                    v-model="scope.row.colorName"></el-input>
          <span v-else>{{ scope.row.colorName }}</span>
        </template>
      </el-table-column>


      <el-table-column>
        <template #default="scope">
          <div :style="{pointerEvents:(isEdit && selectedRow.id===scope.row.id)? '':'none'}">
            <el-color-picker v-model="scope.row.colorCode"/>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="73">
        <template #default="scope">
          <div style="" class="admin-table-editors">
            <EditPensilCtrl @click="edit(scope.row)" />
            <img @click="deleteRow(scope.row)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
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
import {Search, Plus} from '@element-plus/icons-vue'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'

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
        adminStore.deleteColor(row.id).then(() => {
          ElMessage({message: 'Цвет удален.', type: 'success'})
          getData()
        })
      })
      .catch(() => {
      })
}

function getData() {
  isEdit.value = false
  selectedRow.value = false
  globalStore.getColors().then(res => {
    tableData.value = res.items
    tableDataMemory = JSON.parse(JSON.stringify(res.items))
  })
}

globalStore.setTitle('Админка - Цвета кузова')
globalStore.steps = []
getData()


</script>