<template>
  <div>
    <p>Внешний осмотр кузова</p>


  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from '@/stores/dealStore'
import {onMounted} from "vue";

const globalStore = useGlobalStore()
const dealStore = useDealStore()


function open() {
  console.log('open = ')
}


onMounted(() => {
  globalStore.setTitle('Внешний осмотр кузова')
  globalStore.steps = []
})

defineExpose({open})
</script>