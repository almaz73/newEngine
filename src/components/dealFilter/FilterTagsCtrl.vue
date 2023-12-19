<template>
  <div class="tags">
    <span v-for="(el,ind) in store.tags" :key="ind">
      {{ el.name }}
      <b @click="isDirty=true; removeElement(el)">✖</b>
    </span>
    <span
        v-if="store.tags.length"
        class="clear"
        @click="isDirty=true; removeElement(el)">Очистить все</span>
    <span
        class="find "
        :class="{active:true}"
        v-if="isDirty"
        @click="isDirty=false; emits('getData')">Искать</span>
  </div>
</template>

<script setup>
import {store, removeElement} from './dealStore'
import {ref, watch} from "vue";

watch(store, () => isDirty.value = true)

const emits = defineEmits(['getData'])
const isDirty = ref(false)
</script>