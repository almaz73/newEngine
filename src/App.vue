<script setup lang="ts">
import {RouterView} from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import LeftMenu from '@/components/LeftMenu.vue'
import HeadMenu from "@/components/HeadMenu.vue";
import {useGlobalStore} from "@/stores/globalStore";

const globalStore = useGlobalStore()
</script>

<template>
  <div class="root">

    <LeftMenu v-if="globalStore.isAuthorized"/>
    <div class="content">
      <HeadMenu v-if="globalStore.isAuthorized"/>
      <RouterView/>
    </div>
  </div>
</template>
