<template>
  <div>
    <div style="margin-bottom: 30px">
      <el-button @click="openModal(null)"
                 type="danger" :icon="Plus">Добавить
      </el-button>
    </div>

    <el-table
        v-if="!globalStore.isMobileView"
        :data="tableData"
        empty-text="Нет данных"
        highlight-current-row>
      <el-table-column label="Организация" prop="orgName" />
      <el-table-column label="Максимальный порог, руб." prop="maxPrice" />
      <el-table-column label="Максимальный порог, процент." prop="maxPercentage" />
      <el-table-column label="Период действия, с">
        <template #default="scope">
          <span> {{ formatDateDDMMYYYY(scope.row.validFrom) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Период действия, до">
        <template #default="scope">
          <span> {{ formatDateDDMMYYYY(scope.row.validTo) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="73">
        <template #default="scope">
          <div style="" class="admin-table-editors">
            <img @click="openModal(scope.row)" alt=""
                 title="Редактировать"
                 src="@/assets/icons/icon-pencil-gray.png">
            <img @click="deleteRow(scope.row)" alt=""
                 src="@/assets/icons/icon-cross-gray.png"
                 title="Удалить">
          </div>
        </template>
      </el-table-column>

    </el-table>
    <div class="vertical-table" v-if="globalStore.isMobileView">
      <div v-for="(row, ind) in tableData" :key="ind" style="border-top:8px solid #ddd">
        <span>{{ row.title }}
           <el-button @click="openModal(row)">
             <img  alt=""
                  title="Редактировать"
                  src="@/assets/icons/icon-pencil-gray.png">
           </el-button>
        </span>
        
        <div><small>Организация:</small> {{ row.orgName }}</div>
        <div><small>Максимальный порог, руб.:</small> {{ row.maxPrice }}</div>
        <div><small>Максимальный порог, процент.:</small> {{ row.maxPercentage }}</div>
        <div><small>Период действия, с:</small> {{ formatDateDDMMYYYY(row.validFrom) }}</div>
        <div><small>Период действия, до:</small> {{ formatDateDDMMYYYY(row.validTo) }}</div>
      </div>
    </div>
    <template v-if="total>2">
      <el-pagination
          v-model:page-size="rowsPerPage"
          :page-sizes="[5, 10, 20, 50]"
          layout="prev, pager, next, sizes"
          @current-change="changePage"
          @size-change="changePageSize"
          :total="total"
      />
      <div class="page-info">Показаны {{ pageDescription }} из {{ total }}</div>
    </template>
  </div>
  <ThresholdDirModal ref="modal"/>
</template>
<script setup lang="ts">
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {ElMessage, ElMessageBox, ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {Plus} from '@element-plus/icons-vue'
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import ThresholdDirModal from "@/pages/admin/dirs/ThresholdDirModal.vue"
const globalStore = useGlobalStore()
const adminStore = useAdminStore()
const tableData = ref([])
const isEdit = ref(false)
const selectedRow = ref({id: null})
let selectedIndex = 0
const modal = ref(null)
const total = ref(0)
const rowsPerPage = ref(10)
const pageDescription = ref('')
const filter = {offset: 0, limit: 10}
const organizations = ref([])


function changeOrg(id: number) {
  let el = organizations.value.find((el: any) => el.id === id)
  if (tableData.value[selectedIndex]) tableData.value[selectedIndex].orgName = el.name
}

globalStore.getOrganizations().then(res => organizations.value = res.items)

function changePageSize() {
  filter.limit = rowsPerPage.value
  getData()
}

function changePage(val: number) {
  filter.offset = (val - 1) * rowsPerPage.value
  getData()
}


function openModal(row: any) {
  modal.value && modal.value.open(row, getData)
}


function deleteRow(row: any) {
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  }).then(() => {
    adminStore.deleteMaxPrice(row.id).then(() => {
      ElMessage({message: 'Пороговое значение удалено.', type: 'success'})
      getData()
    })
  })
}

function getData() {
  isEdit.value = false
  selectedRow.value = false
  adminStore.getMaxPrices(filter).then((res: any) => {
    console.log(res)
    tableData.value = res.models
    total.value = res.totalCount
  })

}

globalStore.setTitle('Пороговые значения')
globalStore.steps = []
getData()


</script>