<template>
  <div>
    <BuyManager v-if="globalStore.account.role==='BuyerManager'"/>
    <GenManagerDesktop v-else-if="globalStore.account.role==='GenManager'"/>
    <GenManagerDesktop v-else-if="globalStore.account.role==='GenManager'"/>
    <HostesPage v-else-if="globalStore.account.role==='Hostess'"/>
    <DeskTopPage v-else/>
  </div>
</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import GenManagerDesktop from "@/pages/desktop/GenManagerDesktop.vue";
import HostesPage from "@/pages/desktop/HostesPage.vue";
import DeskTopPage from "@/pages/desktop/DeskTopPage.vue";
import BuyManager from "@/pages/desktop/BuyManager.vue";

const globalStore = useGlobalStore()

</script>

<style scoped>

</style>