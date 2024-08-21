<template>
  <div>
    <p>Внутренний осмотр кузова</p>


  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/stores/globalStore";
import {onMounted} from "vue";

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.setTitle('Внутренний осмотр кузова')
  globalStore.steps = []
})

</script>