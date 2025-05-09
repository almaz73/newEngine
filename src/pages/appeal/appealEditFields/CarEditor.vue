<template>
  <EditCarToDeal ref="editCarToDeal" />
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue'
import EditCarToDeal from '@/components/EditCarToDeal.vue'
import { useAppealStore } from '@/stores/appealStore'

const appealStore = useAppealStore()
const editCarToDeal = ref(null)

onMounted(() => {
  let appealId = +location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
  appealStore.getAppeal(appealId).then(res => editCarToDeal.value.open(res))
})

</script>