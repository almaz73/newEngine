<template>
  <button class="color-buttons" :style="colorBox(statusTitle)"
  > {{ statusTitle }}
  </button>
</template>

<style>
.color-buttons {
  padding: 4px 12px;
  border-radius: 3px;
  border: none
}
</style>

<script setup lang="ts">
import {colorBox} from "@/utils/globalFunctions";

const {statusTitle} = defineProps(['statusTitle'])


</script>