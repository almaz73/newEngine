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
            <img @click="openModal(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
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
           <el-button>
             <img @click="openModal(row)" alt=""
                  title="Редактировать"
                  src="@/assets/icons/icon-pencil-gray.png">
           </el-button>
        </span>
        <div v-if="row.generations.length">
          <span v-for="(a, ind) in row.generations" :key="ind">
            Поколение-{{ ind + 1 }},
          </span></div>
        <div v-if="row.modifications.length">
          <span v-for="(a, ind) in row.modifications" :key="ind">
            Модификация-{{ ind + 1 }}
          </span></div>
        <div v-if="row.description"><span style="font-size: small"> {{ row.description }}</span></div>
      </div>
    </div>
  </div>
  <PossibleDamagesModal ref="possibleDamModal"/>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus} from "@element-plus/icons-vue";
import PossibleDamagesModal from "@/pages/admin/dirs/PossibleDamagesModal.vue";

const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
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
    tableData.value = res
  })
}

globalStore.setTitle('Возможные неисправности')
globalStore.steps = []
getData()


</script>