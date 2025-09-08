<template>
  <main>
    <div style="font-size: 28px">🚷 Нет такой страницы</div>
  </main>
</template>
<script setup>
import {useGlobalStore} from "@/stores/globalStore";
import router from "@/router";

const globalStore = useGlobalStore()
globalStore.setTitle('')
setTimeout(() => {
  globalStore.isAuthorized = false
  router.push('/login')
}, 2000)
</script>