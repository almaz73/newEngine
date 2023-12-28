<template>
  <div class="tags">
    <span v-for="(el,ind) in globalRef.tags" :key="ind">
      {{ el.name }}
      <b @click="removeElement(el)">✖</b>
    </span>
    <span
        v-if="globalRef.tags.length"
        class="clear"
        @click="removeElement(); getData()">Очистить все</span>
    <span
        class="find"
        :class="{active:true}"
        v-if="isDirty"
        @click="getData()">Искать и запомнить</span>
  </div>
</template>

<script setup>
import {globalRef, removeElement} from './FilterGlobalRef'
import {ref, watch} from "vue";

watch(globalRef, () => isDirty.value = true)

function getData() {
  setTimeout(() => isDirty.value = false, 100)
  emits('getData')
}

const emits = defineEmits(['getData'])
const isDirty = ref(false)
</script>