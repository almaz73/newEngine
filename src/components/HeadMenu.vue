<template>
  <nav class="head_menu">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<style>
  .head_menu{
    background-color: #ebebeb;
    height: 72px;
  }
</style>