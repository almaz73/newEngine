<template>
  <main>
    <div style="font-size: 28px">🚷 Нет такой страницы</div>
  </main>
</template>
<script setup>
import {useGlobalStore} from "@/stores/globalStore";

useGlobalStore().setTitle('')
</script>