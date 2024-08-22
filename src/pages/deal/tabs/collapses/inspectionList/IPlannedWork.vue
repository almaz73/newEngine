<template>
  <div>
    <p>Запланированные работы</p>

  </div>
</template>

<script setup lang="ts">

import { useGlobalStore } from '@/stores/globalStore'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const globalStore = useGlobalStore()
let autoId, dealId, inspectionId

onMounted(() => {
  globalStore.setTitle('Запланированные работы')
  globalStore.steps = []

  autoId = route.params.autoId
  dealId = route.params.dealId
  inspectionId = route.params.inspectionId

  document.documentElement.scrollTop = 0
})


</script>