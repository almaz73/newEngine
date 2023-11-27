<template>
  <nav class="head_menu">
    <img class="hamburger" src="../assets/img/hamburger.png" @click="showMenu()"/>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
</template>
<script setup lang="ts">
import {RouterLink} from 'vue-router'
import {useGlobalValues} from "@/stores/globalValues";

const globalValues = useGlobalValues()

function showMenu() {
  globalValues.isShowPanel = !globalValues.isShowPanel
}
</script>
