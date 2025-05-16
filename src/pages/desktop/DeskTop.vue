<template>
  <div>
    <GenManagerDesktop v-if="globalStore.account.role==='GenManager'"/>
    <HostesPage v-else-if="globalStore.account.role==='Hostess'"/>
    <DeskTopPage v-else/>
  </div>
</template>

<script setup lang="ts">
import GenManagerDesktop from "@/pages/desktop/GenManagerDesktop.vue";
import HostesPage from "@/pages/desktop/HostesPage.vue";
import DeskTopPage from "@/pages/desktop/DeskTopPage.vue";
import {useGlobalStore} from "@/stores/globalStore";

const globalStore = useGlobalStore()

</script>

<style scoped>

</style>