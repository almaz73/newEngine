<template>
  <nav class="head_menu">
    <img class="hamburger" src="../assets/img/hamburger.png" @click="showMenu()"/>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <div class="pusher" style="flex-grow: 1"></div>

    <div class="account">
      <div>Нахаев Артём</div>
      <div>Управляющий</div>
    </div>

    <img src="../assets/icons/icon-face.png"
         @click="isAccountShow=true"
         class="icon-face"/>

    <div class="account_window" v-if="isAccountShow">
      <div class="account_window__content">
        <img class="account_window__photo" src="../assets/icons/icon-face.png"/>
        <div class="account_window__text">
          <div>Нахаев Артём</div>
          <div>Управляющий</div>
          <div>Останкинский</div>
          <div>Останкино свободный</div>
        </div>
      </div>
      <div class="account_window__buttons">
        <el-button> Редактировать</el-button>
        <el-button @click="signOut()"> Выйти</el-button>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import {RouterLink} from 'vue-router'
import {useGlobalValues} from "@/stores/globalValues";
import {ref} from "vue";
import axios from "axios";

const globalValues = useGlobalValues()
const isAccountShow = ref(false)

function showMenu() {
  globalValues.isShowPanel = !globalValues.isShowPanel
}

function signOut() {
  isAccountShow.value = false

  globalValues.signout()

  // axios.post('/api/account/signout').then(res => {
  //   console.log('res', res)
  // }, err => {
  //   console.error(err)
  // })
}


</script>
