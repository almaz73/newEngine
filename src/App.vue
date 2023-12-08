<template>
  <div class="root">

    <LeftMenu v-if="globalStore.isAuthorized"/>
    <div class="content" :class="globalStore.isNarrowPanel ? 'narrow' : 'wide'">
      <HeadMenu v-if="globalStore.isAuthorized"/>
      <RouterView :style="{padding: globalStore.isMobileView?'':'25px'}"/>
    </div>

    <div id="go-to-top" onclick="window.scrollTo({top:0, behavior:'smooth'})">
        <img src="@/assets/img/gtt.svg" alt="">
    </div>
  </div>
</template>


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

  let goToTop = document.querySelector('#go-to-top')

  window.addEventListener('resize', () => globalStore.isNarrowPanel = true)
  document.addEventListener("scroll", () => {
    if (window.scrollY > 50) globalStore.isShowPanel = false

    if (!goToTop) return
    goToTop.style.display = (window.scrollY > 500) ? 'block' : 'none'
  })
})

</script>
