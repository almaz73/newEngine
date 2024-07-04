<template>
  <div  v-if="mod">
    <h3>
      {{ mod.auto.carBrand }} {{ mod.auto.carModel }}, {{mod.auto.yearReleased}} г.в, ( {{mod.auto.vin}} )
    </h3>
  </div>
</template>
<script setup lang="ts">

const {mod} = defineProps(['mod'])
</script>
