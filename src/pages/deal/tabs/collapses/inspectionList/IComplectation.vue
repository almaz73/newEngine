<template>
  <div>
    <p>Комплектация</p>

  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/stores/globalStore";
import {onMounted} from "vue";

const globalStore = useGlobalStore()

onMounted(() => {
  globalStore.setTitle('Комплектация')
  globalStore.steps = []
})

</script>