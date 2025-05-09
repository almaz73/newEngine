<template>
  <div :class="{'full-screen-win':isFull}" class="full-screen">
    <el-button class="ff" size="small" v-if="!isFull" @click="setState()"> {{ isFull ? 'Уменьшить' : 'На весь экран' }}
      &nbsp; ⏏
    </el-button>
    <slot/>
  </div>
</template>

<style>
.full-screen {
  overflow-y: auto
}

.full-screen .ff {
  float: right;
}

.full-screen-win {
  position: fixed;
  top: 0;
  left: 0;
  width: calc(100% - 30px);
  height: calc(100% - 40px);
  background: white;
  z-index: 100;
  border: 15px solid white;

}

.full-screen-win:has(body) {
  overflow: hidden
}

</style>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {ElMessage} from "element-plus";

const isFull = ref(false)

function setState() {
  isFull.value = !isFull.value
  if (isFull.value) ElMessage.info('Вернуться в обычный режим - Кнопка Esc')
  document.body.style.overflow = isFull.value ? 'hidden' : ''
}

function escapeHandler(e) {
  if (e.key === 'Escape') isFull.value = false
}

onMounted(() => document.addEventListener('keydown', escapeHandler))
onUnmounted(() => document.removeEventListener('keydown', escapeHandler))

</script>
