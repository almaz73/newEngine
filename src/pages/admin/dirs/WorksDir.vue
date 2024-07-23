<template>
  <div >
    <span class="admin-filter-field">
    <el-input v-model="like"
              :prefix-icon="Search"
              placeholder="Фильтр"
              @clear="like=''"
              clearable
              :style="{marginRight: globalStore.isMobileView?'80px':'30px'}"
              @input="toSearch()"/>

    <el-button @click="openModal()" type="danger" :icon="Plus"> Добавить</el-button>

    <br><br>
  </span>
    <el-table v-if="!globalStore.isMobileView"
              :data="tableData"
              style="width: 100%; margin-bottom: 20px"
              :default-sort="{ prop: 'name', order: 'ascending'}"
              highlight-current-row>
      <el-table-column prop="name" label="Название" sortable/>
      <el-table-column prop="type" label="Тип" sortable>
        <template #default="scope">
          {{ WorkType.find(el => el.id === scope.row.type).name }}
        </template>
      </el-table-column>
      <el-table-column prop="rateHour" label="Количество норма часов" sortable/>
      <el-table-column prop="roleTitle" width="73px">
        <template #default="scope">
          <div style="" class="admin-table-editors">
            <EditPensilCtrl @click="openModal(scope.row)"/>
            <img @click="deleteInsp(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.name }}
          <EditPensilCtrl @click="openModal(row)"/>
        </span>
        <div><small>Тип:</small> {{ WorkType.find(el => el.id === row.type).name }}</div>
        <div><small>Количество норма часов:</small> {{ row.rateHour }}</div>
      </div>
    </div>
  </div>
  <WorksDirModal ref="WorksModal"/>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus, Search} from "@element-plus/icons-vue";
import {WorkType} from "@/utils/globalConstants";
import WorksDirModal from "@/pages/admin/dirs/WorksDirModal.vue";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
let tableDataMemory = []
const isEdit = ref(false)
const selectedRow = ref(false)
const WorksModal = ref(null)
const like = ref('')

function openModal(row: any | null) {
  WorksModal.value.open(row, getData)
}


function deleteInsp(id: number) {
  ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then((res) => {
        res && adminStore.deleteWork(id).then(() => {
          ElMessage({message: 'Вид работ успешно удален', type: 'success'})
          getData()
        })
      })
}

function toSearch() {
  let word = like.value.toUpperCase()
  tableData.value = tableDataMemory.filter(el => el.name.toUpperCase().includes(word))
}

function getData() {
  isEdit.value = false
  selectedRow.value = false
  adminStore.getWork(null).then(res => {
    tableData.value = res.items
    tableDataMemory = JSON.parse(JSON.stringify(res.items))
  })
}

globalStore.setTitle('Виды работ')
globalStore.steps = []
getData()

</script>