<script setup lang="ts">
import {RouterView} from 'vue-router'
import LeftMenu from '@/components/LeftMenu.vue'
import HeadMenu from "@/components/HeadMenu.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {onMounted} from "vue";
import router from "@/router";
import '@/stores/_g_axios.ts'
import {widthMobile} from '@/utils/globalConstants'

const globalStore = useGlobalStore()

window.addEventListener('resize', (e) => globalStore.isMobileView = e.currentTarget.innerWidth < widthMobile)
globalStore.isMobileView = document.body.clientWidth < widthMobile


onMounted(() => {
  let account = localStorage.getItem('account')
  if (account && account !== 'undefined') {
    globalStore.account = JSON.parse(account)
    router.push('/')
  }  else {
    globalStore.isAuthorized = false
    router.push('login')
  }
})

</script>

<template>
  <div class="root">

    <LeftMenu v-if="globalStore.isAuthorized"/>
    <div class="content" :class="globalStore.isNarrowPanel ? 'narrow' : 'wide'">
      <HeadMenu v-if="globalStore.isAuthorized"/>
      <RouterView :style="{padding: globalStore.isMobileView?'':'25px'}"/>
    </div>
  </div>
</template>
