<template>
  <div :class="{'full-screen':state}" style="overflow-y: auto">
    <a style="float: right" @click="setState()">
      {{ state ? 'Уменьшить' : 'На весь экран' }}
      ⏏
    </a>
    <slot />
  </div>
</template>

<style>
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100% - 30px);
  height: 100%;
  background: white;
  z-index: 100;
  border: 15px solid white;

}

.full-screen:has(body) {
  overflow: hidden
}

</style>

<script setup>
import { ref } from 'vue'

const state = ref(false)

function setState() {
  state.value = !state.value
  document.body.style.overflow = state.value ? 'hidden' : ''
}

</script>
