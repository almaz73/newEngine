<template>
  <main>
    <h1>Новое обращение</h1>
  </main>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";

const globalStore=useGlobalStore()

globalStore.setTitle('Новое обращение')
globalStore.steps = []
</script>