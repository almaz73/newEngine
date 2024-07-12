<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="1200"
            :top="40"
            :title="'История сделок'"
            draggable>
    <el-scrollbar>
      <span class="modal-fields">

        <el-table
          :data="tableData"
          empty-text="Нет данных"
          highlight-current-row>

          <el-table-column label="Дата">
            <template #default="scope">
              {{ formatDMY_hm(scope.row.createDate) }}
            </template>
          </el-table-column>
          <el-table-column label="Город" prop="locationCity" />
          <el-table-column label="Менеджер">
            <template #default="scope">
              <span style="white-space: nowrap"
                    :title="scope.row.managerFullName">{{ scope.row.managerFullName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Пробег" prop="additionalAutoInfo.mileageAuto" />
          <el-table-column label="Категория" prop="auto.categoryAuto">
            <template #default="scope">
              <CircleCateforyAvtoCtrl :categoryNumber="scope.row.auto.categoryAuto" />
            </template>
          </el-table-column>

          <el-table-column label="Цена выкупа" prop="maxPriceBought" />
          <el-table-column label="Цена продажи" prop="priceMarket" />

        </el-table>

      </span>
    </el-scrollbar>
  </AppModal>
</template>


<script setup>
import AppModal from '@/components/AppModal.vue'
import { ref } from 'vue'
import { useDealStore } from '@/stores/dealStore'
import { useGlobalStore } from '@/stores/globalStore'
import { formatDMY_hm } from '@/utils/globalFunctions'
import CircleCateforyAvtoCtrl from '@/controls/CircleCateforyAvtoCtrl.vue'


let cb
const dealStore = useDealStore()
const globalStore = useGlobalStore()
const isOpen = ref(false)
const form = ref(null)
const closeModal = () => isOpen.value = false
const tableData = ref([])

function open(cbModal) {
  cb = cbModal
  isOpen.value = true

  dealStore.getDealsByVin(dealStore.deal.dealId).then(res => {
    tableData.value = res.data.items
  })
}


defineExpose({ open })


</script>