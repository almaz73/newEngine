<template>
  <div style="margin: 0 30px">
    <div v-for="el in tableData">
      {{ el.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'
import {ref} from "vue";

const dealStore = useDealStore()
const tableData = ref([])


function open() {
  dealStore.getInspectionComplectation(dealStore.deal.inspectionId).then(res => tableData.value = res.items)
}

defineExpose({open})

</script>