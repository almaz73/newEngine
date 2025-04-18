<template>
  <div class="photo-place photo-view"
       @click="handlePictureCardPreview()"
       :style="{width: props.width+'px', height: props.height+'px'}">
    <img :src="props.url" />

    <span v-if="props.delete" @click.stop="emits('deleteAnaliticScreen', props.id)" class="crest" title="Удалить"> 🗙 </span>
  </div>

  <Teleport to="body">
    <el-dialog v-model="isDialogVisible" top="50px">
      <ForFullSceen>
      <a :href="props.url" target="_blank"
         style="position: absolute; right: 40px; top: 14px; color: #bbb"> Открыть в отдельной вкладке</a>
      <img :src="props.url" alt="Preview Image" style="width: 100%; height: 100%" />
      </ForFullSceen>
    </el-dialog>
  </Teleport>
</template>

<style>
.photo-view img {
  border-radius: 0;
  cursor: pointer
}

.crest {
  position: absolute;
  cursor: pointer;
  padding: 0 4px;
}

.photo-view:hover .crest {
  background: white;
}

</style>

<script setup>/**
 * Просмотр рисунков и удаление
 */

import { ref } from 'vue'
import ForFullSceen from '@/components/ForFullSceen.vue'

const isDialogVisible = ref(false)
const props = defineProps(['url', 'id', 'width', 'height', 'delete'])
const emits = defineEmits(['deleteAnaliticScreen'])

const handlePictureCardPreview = () => isDialogVisible.value = true


</script>