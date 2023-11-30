<template>
  <nav class="head_menu">
    <img class="hamburger" src="../assets/img/hamburger.png" @click="showMenu()"/>
    <div class="pusher" style="flex-grow: 1"></div>

    <div class="account">
      <div>{{ globalStore.account.lastName }} {{ globalStore.account.firstName }}</div>
      <div>{{ globalStore.account.roleTitle }}</div>
    </div>

    <img src="../assets/icons/icon-face.png"
         @click="isAccountShow=true"
         class="icon-face"/>

    <div class="account_window" v-if="isAccountShow">
      <div class="account_window__content">
        <img class="account_window__photo" src="../assets/icons/icon-face.png"/>
        <div class="account_window__text">
          <div>{{ globalStore.account.lastName }} {{ globalStore.account.firstName }}</div>
          <div>{{ globalStore.account.roleTitle }}</div>
          <div>{{ globalStore.account.orgElementName }}</div>
          <div>{{ globalStore.account.storage }}</div>
        </div>
      </div>
      <div class="account_window__buttons">
        <el-button class="edit"> Редактировать</el-button>
        <el-button class="exit" @click="signOut()"> Выйти</el-button>
      </div>
      <div class="under_window" @click="isAccountShow=false"></div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import router from "@/router";

const globalStore = useGlobalStore()
const isAccountShow = ref(false)

function showMenu() {
  globalStore.isShowPanel = !globalStore.isShowPanel
}

function signOut() {
  globalStore.signOut().then(() => {
    globalStore.isAuthorized = false
    router.push('login')
  })
}


</script>
