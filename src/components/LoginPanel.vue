<template>
  <div class="account_window">
    <div class="account_window__content">
      <img alt="photo" class="account_window__photo" src="@/assets/icons/icon-face.png"/>
      <div class="account_window__text">
        <img class="settings"
             alt=""
             @click="router.push('/'); emits('closeLoginPanel')"
             src="@/assets/icons/icon-management-active.png">
        <div style="margin-right: 25px">
          {{ globalStore.account.lastName }} {{ globalStore.account.firstName }}
        </div>

        <div>{{ globalStore.account.roleTitle }}</div>
        <div>{{ globalStore.account.orgElementName }}</div>
        <div>{{ globalStore.account.storage }}</div>
      </div>
    </div>
    <div class="account_window__buttons">
      <el-button class="edit">Редактировать</el-button>
      <el-button class="exit" @click="signOut()">Выйти</el-button>
    </div>
    <div class="account_window__buttons">
      <el-button v-if="globalStore.isMobileView" @click="clearCash()">Очистить кэш</el-button>
    </div>
    <div class="under_window" @click="emits('closeLoginPanel')"></div>
  </div>
</template>
<style>
.settings {
  position: absolute;
  right: 16px;
  cursor: pointer;
}
</style>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import router from "@/router";

const emits = defineEmits(['closeLoginPanel'])
const globalStore = useGlobalStore()

function clearCash() {
  localStorage.clear()
}

function signOut() {
  globalStore.signOut().then(() => {
    localStorage.removeItem('account')
    globalStore.isAuthorized = false
    router.push('login')
  })
}
</script>