<script setup lang="ts">
import {RouterView} from 'vue-router'
import LeftMenu from '@/components/LeftMenu.vue'
import HeadMenu from "@/components/HeadMenu.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {computed, onMounted} from "vue";
import router from "@/router";
import '@/stores/_g_axios.ts'

const globalStore = useGlobalStore()
let widthCalss = computed(() => globalStore.isNarrowPanel ? 'narrow' : 'wide')

onMounted(() => {
  let account = localStorage.getItem('account')
  if (account && account !== 'undefined') globalStore.account = JSON.parse(account)
  else {
    globalStore.isAuthorized = false
    router.push('login')
  }
})

</script>

<template>
  <div class="root">

    <LeftMenu v-if="globalStore.isAuthorized"/>
    <div class="content" :class="widthCalss">
      <HeadMenu v-if="globalStore.isAuthorized"/>
      <RouterView style="padding: 25px"/>
    </div>
  </div>
</template>
