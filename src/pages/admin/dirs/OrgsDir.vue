<template>
  <div>
    <div class="admin-filter-field">
      <el-select
        placeholder="Статус"
        v-model="filterStatus"
        multiple
        clearable
        @change="changeFilter()"
        filterable>
        <el-option v-for="(item, ind) in statuses"
                   :key="ind" :label="item.name"
                   :value="item.type" />
      </el-select>
      <el-button v-if="isDirty" type="success" @click="getData()">Искать</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :tree-props="{ children: 'nodes', hasChildren: 'hasChildren' }"
      default-expand-all
      highlight-current-row>
      <el-table-column label="Организация">
        <template #default="scope">
          <span :style="{ color: scope.row.orgElementType === 10 ? '#d34338' : '' }">
            {{ scope.row.title }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Тип" width="150px">
        <template #default="scope">
          {{ getTypeName(scope.row.orgElementType) }}
        </template>
      </el-table-column>

      <el-table-column label="Статус" width="150px">
        <template #default="scope">
          {{ getStatusName(scope.row.partnerStatus) }}
        </template>
      </el-table-column>

      <el-table-column prop="city" label="Город" />
      <el-table-column prop="phoneByAvito" label="Телефон для авито" width="120px" />

      <el-table-column prop="roleTitle" width="120px">
        <template #default="scope">
          <div class="admin-table-editors">
            <img v-if="scope.row.isActive" @click="switchuser(scope.row)" alt=""
                 title="Активный"
                 src="@/assets/icons/icon-unblocked-gray.png">
            <img v-else @click="switchuser(scope.row)" alt=""
                 title="Нeактивный"
                 src="@/assets/icons/icon-blocked-red.png">

            <img @click="switchuser(scope.row)" alt=""
                 title="Добавить"
                 src="@/assets/icons/icon-plus-gray-row.png">

            <EditPensilCtrl @click="openUrgsModal(scope.row)" />
            <DeleteCtrl v-if="scope.row.id !== 1" @click="deleteUser(scope.row.id)" />
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <OrgsDirModal ref="orgsModal" />
</template>

<script setup lang="ts">
import { useAdminStore } from '@/stores/adminStore'
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import { useGlobalStore } from '@/stores/globalStore'
import OrgsDirModal from '@/pages/admin/dirs/OrgsDirModal.vue'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import DeleteCtrl from '@/controls/DeleteCtrl.vue'

const globalStore = useGlobalStore()
const adminStore = useAdminStore()

const tableData = ref([])
const filterStatus = ref<number[]>([])
const isEdit = ref(false)
const selectedRow = ref(false)
const orgsModal = ref(null)
const isDirty = ref(false)

const types = [
  { id: 10, name: 'Организация' },
  { id: 20, name: 'Отдел' }
]

const statuses = [
  { id: 0, name: 'Активные', type: 'active' },
  { id: 1, name: 'Заблокированные ', type: 'blocked' },
  { id: 2, name: 'Удаленные', type: 'deleted' }
]

filterStatus.value = ['active']
let filterParams = '?IsDeleted=false&IsActive=true'

function changeFilter() {
  isDirty.value = true
  filterParams = '?IsDeleted=false'

  if (filterStatus.value.includes('deleted')) filterParams = '?IsDeleted=true'
  if (!(filterStatus.value.includes('active') && filterStatus.value.includes('blocked'))) {
    if (filterStatus.value.includes('active')) filterParams += '&IsActive=true'
    if (filterStatus.value.includes('blocked')) filterParams += '&IsActive=false'
  }
}

function getTypeName(typeId: number): string {
  const type = types.find(t => t.id === typeId)
  return type ? type.name : ''
}

function getStatusName(statusId: number): string {
  const status = statuses.find(s => s.id === statusId)
  return status ? status.name : ''
}

function openUrgsModal(row: any) {
  orgsModal.value.open(row, getData)
}


function getData() {
  isEdit.value = false
  isDirty.value = false
  selectedRow.value = false

  adminStore.getAllOrganizations(filterParams).then(res => {
    tableData.value = res.items
  })
}

globalStore.setTitle('Админка - Организационная структура')
globalStore.steps = []
getData()


</script>