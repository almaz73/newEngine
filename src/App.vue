<script setup lang="ts">
import {RouterView} from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import LeftMenu from '@/components/LeftMenu.vue'
import HeadMenu from "@/components/HeadMenu.vue";
</script>

<template>
  <div class="root">

    <LeftMenu/>
    <div style="width: 100%">
      <HeadMenu/>
      <RouterView/>
    </div>
  </div>
</template>
