<template>
  <div class="tags">
    <span v-for="(el,ind) in TAGS" :key="ind">
        {{ el.name }}
        <b @click="emits('removeElement', el)">✖</b>
      </span>
  </div>
  <div style="text-align: center">
    <el-button @click="emits('toSearch')">
      Искать
    </el-button>
    <el-button :disabled="!TAGS.length"
               @click=" emits('removeElement')">
      Очистить фильтр
    </el-button>
  </div>
</template>
<script setup lang="ts">

defineProps(['TAGS'])
const emits = defineEmits(['toSearch', 'removeElement'])
</script>