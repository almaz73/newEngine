<template>
  <div style="max-width: 1400px; margin: auto">
    <AppealEditFields ref="appealFields"/>
  </div>
</template>
<script setup>

import AppealEditFields from "@/pages/appeal/appealEditFields/AppealEditFields.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {onMounted, ref} from "vue";

const globalStore = useGlobalStore()
const appealFields = ref(null)
const {id} = defineProps(['id'])

onMounted(() => {
  appealFields.value.open({id: id, smallPhoto: []})
})


</script>