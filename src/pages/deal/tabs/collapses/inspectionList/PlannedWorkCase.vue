<template>
  <el-table
    :data="tableData"
    empty-text="Нет данных"
    highlight-current-row
  >
    <el-table-column prop="elementName" label="Элемент" />
    <el-table-column prop="damageText" label="Повреждение" />
    <el-table-column prop="workName" label="Работа" />
    <el-table-column prop="price" label="Стоимость" />
    <el-table-column prop="comment" label="Комментарий" />


  </el-table>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { ref } from 'vue'

const globalStore = useGlobalStore()
const tableData = ref([])

function open(data: any) {
  tableData.value = data
}

defineExpose({ open })

</script>