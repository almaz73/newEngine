<template>
  <div style="max-width: 1200px; margin: auto">
    <AppealEditFields ref="appealEditFields"/>
  </div>
</template>
<script setup>

import AppealEditFields from "@/pages/appeal/appealEditFields/AppealEditFields.vue";
import {onMounted, ref} from "vue";

const appealEditFields = ref(null)
const {id} = defineProps(['id'])

onMounted(() => {
  appealEditFields.value?.open({id: id, fullphotos: []})
})


</script>