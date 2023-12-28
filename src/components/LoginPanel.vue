<template>
  <div class="account_window">
    <div class="account_window__content">
      <img alt="photo" class="account_window__photo" src="@/assets/icons/icon-face.png"/>
      <div class="account_window__text">
        <div>{{ globalStore.account.lastName }} {{ globalStore.account.firstName }}</div>
        <div>{{ globalStore.account.roleTitle }}</div>
        <div>{{ globalStore.account.orgElementName }}</div>
        <div>{{ globalStore.account.storage }}</div>
      </div>
    </div>
    <div class="account_window__buttons">
      <el-button class="edit">Редактировать</el-button>
      <el-button class="exit" @click="signOut()">Выйти</el-button>
    </div>
    <div class="under_window" @click="emits('closeLoginPanel')"></div>
    <div class="account_window__buttons">
      <a href="https://g66.ru/almaz73/" title="Оставить замечания, предложения, идеи">Task Board </a>
      <RouterLink to="/bayerhelp" @click="emits('closeLoginPanel')">Инструкция. Байер</RouterLink>
    </div>
    <div class="account_window__buttons">
      <RouterLink to="/ideas" @click="emits('closeLoginPanel')">Идеи по редизайну</RouterLink>
    </div>
    <div class="account_window__buttons">
      <el-button v-if="globalStore.isMobileView" @click="clearCash()">Очистить кэш</el-button>
    </div>

  </div>
</template>
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