<template>
  <main>
    DeskTopPage.vue
  </main>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";

useGlobalStore().setTitle('Рабочий стол')
</script>