<template>
  <div class="photo-place photo-view"
       @click="handlePictureCardPreview()"
       :style="{width: props.width+'px', height: props.height+'px'}">
    <img :src="props.url" />

  </div>

  <Teleport to="body">
    <el-dialog class="all-place"  v-model="isDialogVisible" top="0">
      <img :src="props.url" alt=""  />
    </el-dialog>
  </Teleport>
</template>

<style>
.photo-big{
  position: absolute;
  top: 3px;
  padding: 0 100px;
  left: calc(50% - 150px);
}
.photo-view img {
  border-radius: 0;
  cursor: pointer
}

.crest {
  position: absolute;
  cursor: pointer;
  padding: 0 4px;
}

.all-place{
  background: #00000099;
  width: 100vw;
  overflow: hidden;
  height: 100vh;
  position: absolute;
}
.all-place img{
  object-fit: contain;
  width: 99vw;
  height: 97vh;
  margin-top:-20px;
}

</style>

<script setup>/**
 * Просмотр рисунков и удаление
 */

import { ref } from 'vue'

const isDialogVisible = ref(false)
const props = defineProps(['url', 'id', 'width', 'height', 'delete'])
const emits = defineEmits(['deleteAnaliticScreen'])

const handlePictureCardPreview = () => isDialogVisible.value = true

</script>