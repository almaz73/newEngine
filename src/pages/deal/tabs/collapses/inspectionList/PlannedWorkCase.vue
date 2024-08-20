<template>
  <div v-if="props.showWorks">
    <el-table
      :data="tableData"
      highlight-current-row
    >
      <el-table-column prop="elementName" label="Элемент" />
      <el-table-column prop="damageText" label="Повреждение" />
      <el-table-column prop="workName" label="Работа" />
      <el-table-column prop="price" label="Стоимость" />
      <el-table-column prop="comment" label="Комментарий" />

    </el-table>
    <br><br><br>
  </div>
  <el-table
    v-if="props.showHistory"
    :data="tableDataHistory"
    highlight-current-row
  >
    <el-table-column label="Фио">
      <template #default="scope">
        {{ scope.row.lastName || '' }} {{ scope.row.firstName || '' }} {{ scope.row.middleName || '' }}
      </template>
    </el-table-column>
    <el-table-column label="Дата">
      <template #default="scope">
        {{ formatDMY_hm(scope.row.createDate) }}
      </template>
    </el-table-column>
    <el-table-column prop="elementName" label="Элемент" />
    <el-table-column prop="damageText" label="Повреждение" />
  </el-table>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import { ref, watchEffect } from 'vue'
import { formatDMY_hm } from '@/utils/globalFunctions'

const props = defineProps(['showWorks', 'showHistory'])

watchEffect(() => {
  if (props.showHistory) getHistory()
})


const dealStore = useDealStore()
const globalStore = useGlobalStore()
const tableData = ref([])
const tableDataHistory = ref([])

function open(data: any) {
  tableData.value = data
}

function getHistory() {
  if (tableDataHistory.value.length) return false
  dealStore.getDWorkСhanged(dealStore.deal.inspectionId).then(res => {
    console.log('res', res)
    if (res.data) tableDataHistory.value = res.data.items
    console.log('tableDataHistory = ', tableDataHistory.value)
  })
}

defineExpose({ open })

</script>