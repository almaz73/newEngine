<template>
  <div class="root">
    <LeftMenu v-if="globalStore.isAuthorized" />

    <div class="content" :class="globalStore.isNarrowPanel ? 'narrow' : 'wide'">
      <HeadMenu v-if="globalStore.isAuthorized" />
      <RouterView :style="{ padding: globalStore.isMobileView ? '' : '25px' }" />
    </div>

    <img
      class="gototop"
      v-if="globalStore.isNeedTop"
      @click="gotoTop()"
      src="@/assets/img/gtt.svg"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import LeftMenu from '@/components/LeftMenu.vue'
import HeadMenu from '@/components/HeadMenu.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { onMounted } from 'vue'
import router from '@/router'
import '@/stores/_g_axios.ts'
import { widthMobile } from '@/utils/globalConstants'
import {gotoTop} from "@/utils/globalFunctions";
import {useDark} from "@vueuse/core";

const isDark = useDark()

const globalStore = useGlobalStore()

onMounted(() => {
  let account = localStorage.getItem('account')
  if (account && account !== 'undefined') {
    globalStore.account = JSON.parse(account)
  } else {
    globalStore.isAuthorized = false
    router.push('login')
  }

  globalStore.isMobileView = document.body.clientWidth < widthMobile

  window.addEventListener('resize', (e: UIEvent) => {
    const w = e.currentTarget as Window
    globalStore.isMobileView = w.innerWidth < widthMobile
    globalStore.isNarrowPanel = true
  })

  document.addEventListener('scroll', () => {
    if (window.scrollY > 800) globalStore.isShowPanel = false
    globalStore.isNeedTop = window.scrollY > 600
  })
})
</script>