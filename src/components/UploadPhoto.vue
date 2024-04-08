<template>
  <el-upload
      class="avatar-uploader"
      accept="image/png, image/gif, image/jpeg"
      :show-file-list="false"
      :auto-upload="true"
      :http-request="uploadFiles"
  >
    <span class="photo-upload" @click.stop="()=>{}" v-if="photoUrl">
      <span class="photo-upload__btns" :style="{pointerEvents:isClickparent?'none':'auto'}">
        <span @mouseover="uploadFocus" @mouseout="uploadBlur">
          <el-icon><Download/></el-icon>
        </span>
        <span @click="handlePictureCardPreview()">
          <el-icon><zoom-in/></el-icon>
        </span>
        <span @click="handleRemove()">
          <el-icon><Delete/></el-icon>
        </span>
      </span>
   </span>

    <img alt="" v-if="photoUrl" :src="photoUrl" class="avatar"/>
    <el-icon v-else class="avatar-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img :src="dialogImageUrl" alt="Preview Image"/>
  </el-dialog>
</template>


<script setup>

import {ElMessage} from "element-plus";
import {Delete, Download, Plus, ZoomIn} from "@element-plus/icons-vue";
import {ref, watchEffect} from "vue";

const props = defineProps(['url'])
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

const checkBeforeUpload = (rawFile) => {
  if (!rawFile.type.includes('image')) {
    ElMessage.error('Не подходящий формат для фотографии!')
    return true
  } else if (rawFile.size > 2000000) {
    ElMessage.error('Фото не может быть больше 2 mb!')
    return true
  }
}

function uploadFiles(obj) {
  if (checkBeforeUpload(obj.file)) return false
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