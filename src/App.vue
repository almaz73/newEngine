<script setup lang="ts">
import {RouterView} from 'vue-router'
import LeftMenu from '@/components/LeftMenu.vue'
import HeadMenu from "@/components/HeadMenu.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {onMounted} from "vue";
import router from "@/router";
import '@/stores/_g_axios.ts'

const globalStore = useGlobalStore()

onMounted(() => {
  let account = localStorage.getItem('account')
  if (account !== 'undefined') globalStore.account = JSON.parse(account)
  else {
    globalStore.isAuthorized = false
    router.push('login')
  }
})

</script>

<template>
  <div class="root">

    <LeftMenu v-if="globalStore.isAuthorized"/>
    <div class="content">
      <HeadMenu v-if="globalStore.isAuthorized"/>
      <RouterView style="padding: 25px"/>
    </div>
  </div>
</template>
