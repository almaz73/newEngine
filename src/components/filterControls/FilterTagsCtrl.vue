<template>
  <div class="tags">
    <span v-for="(el,ind) in globalRef.tags" :key="ind">
      {{ el.name }}
      <b @click="isDirty=true; removeElement(el)">✖</b>
    </span>
    <span
        v-if="globalRef.tags.length"
        class="clear"
        @click="isDirty=true; removeElement(el)">Очистить все</span>
    <span
        class="find "
        :class="{active:true}"
        v-if="isDirty"
        @click="isDirty=false; emits('getData')">Искать и запомнить</span>
  </div>
</template>

<script setup>
import {globalRef, removeElement} from './FilterGlobalRef'
import {ref, watch} from "vue";

watch(globalRef, () => isDirty.value = true)

const emits = defineEmits(['getData'])
const isDirty = ref(false)
</script>