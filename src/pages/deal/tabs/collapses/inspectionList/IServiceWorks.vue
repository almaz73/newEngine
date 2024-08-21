<template>
  <div>
    <p>222 Сервисные работы</p>


  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/stores/globalStore";
import {onMounted} from "vue";

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.setTitle('Сервисные работы')
  globalStore.steps = []
})

</script>