<template>
  <div class="tags">
    <span v-for="(el,ind) in globalRef.tags" :key="ind">
      {{ el.name }}
      <b @click="removeElement(el)">✖</b>
    </span>
  </div>
  <div class="tags">
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
  <div style="clear: both"></div>
</template>

<script setup>
import {globalRef, removeElement} from './FilterGlobalRef'
import {ref, watch} from "vue";

watch(globalRef, () => isDirty.value = true)

function getData() {
  setTimeout(() => {
    emits('getData')
    isDirty.value = false
  }, 100)

}

const emits = defineEmits(['getData'])
const isDirty = ref(false)
</script>