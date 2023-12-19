<template>
  <nav class="head_menu">
    <img src="@/assets/img/loading.gif"
         alt=""
         v-if="globalStore.isWaiting"
         class="waiter"
    />

    <img alt="" class="hamburger" src="@/assets/img/hamburger.png" @click="showMenu()"/>
    <div class="pusher"/>



    <div class="account" v-if="!globalStore.isMobileView">
      <div>{{ globalStore.account.lastName }} {{ globalStore.account.firstName }}</div>
      <div>{{ globalStore.account.roleTitle }}</div>
    </div>


    <img src="@/assets/icons/icon-face.png"
         @click="isAccountShow=true"
         alt="photo"
         class="icon-face"/>

    <div class="account_window" v-if="isAccountShow">
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
      <div class="under_window" @click="isAccountShow=false"></div>
      <div  class="account_window__buttons">
        <a href="https://g66.ru/almaz73/" title="Оставить замечания, предложения, идеи">Task Board </a>
        <RouterLink to="/bayerhelp">Инструкция. Байер</RouterLink>

      </div>
<!--      <div  class="account_window__buttons">-->
<!--        <a href="https://g66.ru/almaz73/">Инструкция. Сall-центра</a>-->
<!--      </div>-->

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
    localStorage.removeItem('account')
    globalStore.isAuthorized = false
    router.push('login')

  })
}


</script>
