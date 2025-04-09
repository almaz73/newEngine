<template>
  <div class="admin-filter-field">
    <el-button @click="openModal(null)" type="danger" :icon="Plus"> Добавить</el-button>
  </div>
  <div>
    <el-table v-if="!globalStore.isMobileView"
              :data="tableData"
              style="width: 100%; margin-bottom: 20px"
              :default-sort="{ prop: 'order', order: 'descending'}"
              highlight-current-row>
      <el-table-column prop="autoType.name" label="Тип ТС" sortable width="250"/>
      <el-table-column prop="brand.name" label="Марка" sortable width="120"/>
      <el-table-column prop="model.name" label="Модель" sortable width="120"/>
      <el-table-column label="Поколение" width="120">
        <template #default="scope">
          <div v-for="(generation, ind) in scope.row.generations"
               style="cursor:pointer"
               :key="ind" :title="generation.name">Поколение-{{ ind + 1 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Модификации" width="150">
        <template #default="scope">
          <div v-for="(modification, ind) in scope.row.modifications"
               style="cursor:pointer"
               :key="ind" :title="modification.name">Модификация-{{ ind + 1 }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="Возможные неисправности"/>
      <el-table-column prop="roleTitle" width="73px">
        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img v-if="!scope.row.isBlocked" @click="switchuser(scope.row)" alt=""
                 title="Активный"
                 src="@/assets/icons/icon-unblocked-gray.png">
            <img v-else @click="switchuser(scope.row)" alt=""
                 title="Нeактивный"
                 src="@/assets/icons/icon-blocked-red.png">
            <EditPensilCtrl @click="openModal(scope.row)" />
            <img @click="deleteIRow(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.brand.name }} {{ row.model.name }}
           <el-button @click="openModal(row)">
             <EditPensilCtrl/>
           </el-button>

        </span>
        
        <div v-if="row.generations && row.generations.length !== 0"><small>Поколение:</small>          
          <div v-for="(generation, ind) in row.generations"
               style="cursor:pointer"
               :key="ind" :title="generation.name">Поколение-{{ ind + 1 }}
          </div></div>
        <div v-if="row.modifications && row.modifications.length !== 0"><small>Модификации:</small>
          <div v-for="(modification, ind) in row.modifications"
               style="cursor:pointer"
               :key="ind" :title="modification.name">Модификация-{{ ind + 1 }}
          </div></div>
        <div v-if="row.description"><small>Возможные неисправности:</small> {{ row.description }}</div>
      </div>
    </div>
  </div>
  <PossibleDamagesModal ref="possibleDamModal"/>
</template>
<style scoped>
.vertical-table small{
  width:110px;
  text-align: left;
}
.vertical-table div{
  padding: 0;
}
</style>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus} from "@element-plus/icons-vue";
import PossibleDamagesModal from "@/pages/admin/dirs/PossibleDamagesModal.vue";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref<any>()
const isEdit = ref(false)
const selectedRow = ref(false)
const possibleDamModal = ref(null)

function openModal(row: any | null) {
  possibleDamModal.value.open(row, getData)
}

function switchuser(row: any) {
  adminStore.switchMalfunction(row.id).then(getData)
}

function deleteIRow(id: number) {
  ElMessageBox.confirm('Вы действительно хотите удалить запись?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then((res) => {
        res && adminStore.deleteModification(id).then(() => {
          ElMessage({message: 'Возможная неисправность  успешно удалена', type: 'success'})
          getData()
        })
      })
}


function getData() {
  isEdit.value = false
  selectedRow.value = false

  adminStore.getMalfunctions().then((res: any) => {
    console.log(res)
    tableData.value = res
  })
}

globalStore.setTitle('Админка - Возможные неисправности')
globalStore.steps = []
getData()


</script>