<template>
  <div v-if="props.showDamagesArr.includes(props.categoryId)" style="width: 100%">
    <el-table
      v-if="!globalStore.isMobileView"
      :data="tableData"
      size="small"
      stripe
      highlight-current-row
    >
      <el-table-column label="Элемент" prop="name" />
      <el-table-column label="Повреждение" prop="damageText" />
      <el-table-column label="Работа" prop="workName" />
    </el-table>

    <br>
  </div>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'

const props = defineProps(['showDamagesArr', 'categoryId', 'groupItems'])
const dealStore = useDealStore()
const globalStore = useGlobalStore()
const tableData = ref([])

tableData.value = props.groupItems.filter((el: any) => {
  return (el.recordStatus === 30 || el.recordStatus === 10) && !el.isNorm
})
</script>