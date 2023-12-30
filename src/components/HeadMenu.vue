<template>
  <nav class="head_menu">
    <img src="@/assets/img/loading.gif"
         alt=""
         v-if="globalStore.isWaiting"
         class="waiter"
    />

    <img alt="" class="hamburger" src="@/assets/img/hamburger.png" @click="showMenu()"/>


    <div class="head-text">
      <h1>{{ globalStore.title }}</h1>
      <StepsCtrl/>
    </div>

    <div class="pusher"/>


    <div class="account" v-if="!globalStore.isMobileView">
      <div>{{ globalStore.account.lastName }} {{ globalStore.account.firstName }}</div>
      <div>{{ globalStore.account.roleTitle }}</div>
    </div>


    <img src="@/assets/icons/icon-face.png"
         @click="isAccountShow=true"
         alt="photo"
         class="icon-face"/>

    <LoginPanel @closeLoginPanel="isAccountShow = false" v-if="isAccountShow"/>
  </nav>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import LoginPanel from "@/components/LoginPanel.vue";
import StepsCtrl from "@/components/StepsCtrl.vue";

const globalStore = useGlobalStore()
const isAccountShow = ref(false)

function showMenu() {
  globalStore.isShowPanel = !globalStore.isShowPanel
}


</script>
