<template>
  <div style="margin: 0 30px">
    <div v-for="(el, ind) in tableData" :key="ind">
      {{ el.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'
import {ref} from "vue";
import { ElMessage } from 'element-plus'

const dealStore = useDealStore()
const tableData = ref([])


function open() {
  dealStore.getInspectionComplectation(dealStore.deal.inspectionId).then(res => {
    if(!res.items || !res.items.length) ElMessage.warning('Нет данных')
    tableData.value = res.items
  })
}

defineExpose({open})

</script>