<template>
  <el-upload
      class="avatar-uploader"
      accept="image/png, image/gif, image/jpeg"
      :show-file-list="false"
      :auto-upload="true"
      :http-request="uploadFiles"
  >
    <div class="photo-upload" @click.stop="()=>{}" v-if="photoUrl">
      <div class="photo-upload__btns" :style="{pointerEvents:isClickparent?'none':'auto'}">
        <div v-if="props.noEdit"
             @click="handlePictureCardPreview()"
             style="background: #00000000; width: 200px; height: 200px">
        </div>

        <div v-if="!props.noEdit" style="display: flex; gap: 12px; padding: 4px">
          <span @mouseover="uploadFocus" @mouseout="uploadBlur" title="Загрузить новый фото">
            <el-icon><Download /></el-icon>
          </span>
          <span @click="handlePictureCardPreview()" title="Посмотреть">
            <el-icon><zoom-in /></el-icon>
          </span>
          <span @click="handleRemove()" title="Удалить">
            <el-icon><Delete /></el-icon>
          </span>
        </div>
      </div>
   </div>

    <img alt="" v-if="photoUrl" :src="photoUrl" class="avatar"/>
    <el-icon v-else class="avatar-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>

  <Teleport to="body">
    <el-dialog v-model="dialogVisible" top="50px">
      <a :href="photoUrl" target="_blank"
         style="position: absolute; right: 40px; top: 14px; color: #bbb"> Открыть в отдельной вкладке</a>
      <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
    </el-dialog>
  </Teleport>
</template>


<script setup>

/**
 * Два вида использования, либо просмотр + редактирование, либо только просмотр noEdit=true
 */

import {checkPictureBeforeUpload} from "@/utils/globalFunctions";
import {Delete, Download, Plus, ZoomIn} from "@element-plus/icons-vue";
import {ref, watchEffect} from "vue";

const props = defineProps(['url', 'noEdit'])
const emits = defineEmits(['setNewPhoto'])
const photoUrl = ref(null)

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const isClickparent = ref(false)


const handlePictureCardPreview = () => {
  if (!photoUrl.value) return false
  dialogImageUrl.value = photoUrl.value
  dialogVisible.value = true
}

const handleRemove = () => {
  photoUrl.value = null
  emits('setNewPhoto', {fbase64: null, name: ''})
}

const uploadFocus = () => isClickparent.value = true
const uploadBlur = () => isClickparent.value = false


watchEffect(() => photoUrl.value = props.url)

function uploadFiles(obj) {
  if (checkPictureBeforeUpload(obj.file, 2)) return false
  const f = obj.file;

  if (f) {
    const fr = new FileReader();
    fr.onload = () => {
      const fbase64 = fr.result; //файл в base64
      photoUrl.value = fbase64
      emits('setNewPhoto', {fbase64, name: obj.file.name})
    }
    fr.readAsDataURL(f);
  }
}

</script>