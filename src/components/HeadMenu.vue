<template>
  <nav class="head_menu">
    <span>
    333
    </span>
    <span>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </span>
  </nav>
</template>
<script setup lang="ts">
import {RouterLink} from 'vue-router'
</script>
<style>
.head_menu {
  background-color: #ebebeb;
  height: 72px;
  display: flex;
  align-items: center;
}
</style>