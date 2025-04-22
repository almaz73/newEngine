<template>
  <div>
    <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        :tree-props="{ children: 'nodes', hasChildren: 'hasChildren' }"
        default-expand-all
        highlight-current-row>
      <el-table-column label="Организация">
        <template #default="scope">
          <span :style="{color:scope.row.orgElementType===10?'#d34338':''}">
            {{ scope.row.title }}
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="Город"/>
      <el-table-column prop="roleTitle" width="120px">

        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img v-if="scope.row.isActive" @click="switchuser(scope.row)" alt=""
                 title="Активный"
                 src="@/assets/icons/icon-unblocked-gray.png">
            <img v-else @click="switchuser(scope.row)" alt=""
                 title="Нeактивный"
                 src="@/assets/icons/icon-blocked-red.png">

            <img @click="switchuser(scope.row)" alt=""
                 title="Нeактивный"
                 src="@/assets/icons/icon-plus-gray-row.png">

            <EditPensilCtrl  @click="openUrgsModal(scope.row)"/>
            <DeleteCtrl v-if="scope.row.id!==1" @click="deleteUser(scope.row.id)"/>
            <!-- <img v-if="scope.row.id!==1"
                 @click="deleteUser(scope.row.id)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить"> -->
          </div>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <OrgsDirModal ref="orgsModal"/>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import OrgsDirModal from "@/pages/admin/dirs/OrgsDirModal.vue";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import DeleteCtrl from '@/controls/DeleteCtrl.vue'
const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const isEdit = ref(false)
const selectedRow = ref(false)
const orgsModal = ref(null)

function openUrgsModal(row) {
  orgsModal.value.open(row, getData)
}


function getData() {
  isEdit.value = false
  selectedRow.value = false

  adminStore.getAllOrganizations().then(res => {
    tableData.value = res.items
  })
}

globalStore.setTitle('Админка - Организационная структура')
globalStore.steps = []
getData()


</script>