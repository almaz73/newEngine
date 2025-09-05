<template>
  <div class="root">
    <LeftMenu v-if="globalStore.isAuthorized"/>

    <div class="content" :class="globalStore.isNarrowPanel ? 'narrow' : 'wide'">
      <HeadMenu v-if="globalStore.isAuthorized"/>
      <RouterView :style="{ padding: globalStore.isMobileView ? '' : '8px 25px',
                            overflowY:heightPage>920?'':'auto' }"
                  class="router-window"/>
    </div>
    <img
        class="gototop"
        v-if="globalStore.isNeedTop"
        @click="gotoTop()"
        src="@/assets/img/gtt.svg"
        alt=""
    />
    <RegularlyQueryingEvents/>
  </div>
</template>
 
<script setup lang="ts">
import {RouterView} from 'vue-router'
import LeftMenu from '@/components/LeftMenu.vue'
import HeadMenu from '@/components/HeadMenu.vue'
import {useGlobalStore} from '@/stores/globalStore'
import {onMounted, ref} from 'vue'
import router from '@/router'
import '@/stores/_g_axios.ts'
import {widthMobile} from '@/utils/globalConstants'
import {gotoTop} from "@/utils/globalFunctions";
import {useDark} from "@vueuse/core";
import RegularlyQueryingEvents from "@/components/RegularlyQueryingEvents.vue";



useDark()

const globalStore = useGlobalStore()
const heightPage = ref(0)

onMounted(() => {
  let account = localStorage.getItem('account')
  if (account && account !== 'undefined') {
    globalStore.account = JSON.parse(account)
    globalStore.isAuthorized = true
    // @ts-ignore
    if (new Date() - new Date(+globalStore.account.dateTime) > 32400000) { // 9 часов
      // вышел срок авторизации
      console.log('%cвышел срок авторизации','background:red')
      navigator.onLine && router.push('login')
    }
  } else {
    globalStore.isAuthorized = false
    
    navigator.onLine && router.push('login')
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

  setTimeout(() => heightPage.value = document.body.scrollHeight)

  console.log('%c ' + globalStore.account.role, 'color: blue')
})
</script>