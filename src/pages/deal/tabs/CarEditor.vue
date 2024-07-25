<template>
  <EditCarToDeal ref="editCarToDeal" />
</template>

<style>
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import EditCarToDeal from '@/components/EditCarToDeal.vue'
import { useDealStore } from '@/stores/dealStore'

const dealStore = useDealStore()
const editCarToDeal = ref(null)

onMounted(() => {
  let appealId = +location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
  dealStore.getDeal(appealId).then(res => {
    editCarToDeal.value.open(res, 'Редактируем')
  })
})

</script>