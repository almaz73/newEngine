<template>
  <nav class="head_menu" :style="{'background':isOnline?'':'gold'}">
    <div v-if="!isOnline" style="position: fixed; top:0; text-align: center; width: 100%; z-index: 1000">
      <b>НЕТ ИНТЕРНЕТА</b>
    </div>
    <img src="@/assets/img/loading.gif"
         alt=""
         v-if="globalStore.isWaiting"
         class="waiter"
    />
    <img alt="" class="hamburger" src="@/assets/img/hamburger.png" @click="showMenu()" />


    <div class="head-text">
      <h1 style="white-space: nowrap">{{ isOnline ? '' : '⌛' }}{{ globalStore.title }}</h1>
      <StepsCtrl v-if="globalStore.steps && globalStore.steps.length" />
    </div>

    <div class="pusher" />

    <div class="account" v-if="!globalStore.isMobileView">
      <div>{{ globalStore.account.lastName }} {{ globalStore.account.firstName }}</div>
      <div>{{ globalStore.account.roleTitle }}</div>
    </div>

    <img :src="loginPhotoSrc"
         @click="isAccountShow=true"
         alt=""
         class="icon-face" />

    <LoginPanel @closeLoginPanel="isAccountShow = false" v-if="isAccountShow" />
  </nav>
</template>
<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore'
import { computed, ref } from 'vue'
import LoginPanel from '@/components/LoginPanel.vue'
import StepsCtrl from '@/components/StepsCtrl.vue'

const isOnline = ref(navigator.onLine)
const globalStore = useGlobalStore()
const isAccountShow = ref(false)

const loginPhotoSrc = computed(() => {
  if (globalStore.account.avatarUrl === '/images/icon-face.png') globalStore.account.avatarUrl = '/v2/src/assets/icons/icon-face.png'
  return globalStore.account.avatarUrl
})


function showMenu() {
  globalStore.isShowPanel = !globalStore.isShowPanel
}

window.addEventListener('online', () => isOnline.value = true)
window.addEventListener('offline', () => isOnline.value = false)

</script>
