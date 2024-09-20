<template>
  <div style="position: relative">
    <el-upload
      class="avatar-uploader"
      accept="image/png, image/gif, image/jpeg"
      :show-file-list="false"
      :auto-upload="true"
      :http-request="uploadFiles"
    >
    <span class="photo-upload" @click.stop="()=>{}" v-if="photoEL">
      <span class="photo-upload__btns">
        <span @click="handlePictureCardPreview()" title="Посмотреть" style="width: 130px; height: 160px">
          <el-icon><zoom-in /></el-icon>
        </span>
      </span>
   </span>

      <img alt="" v-if="photoEL" :src="photoEL.previewPhotoPath+isDirty" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>


    </el-upload>
    <div v-if="photoEL && photoEL.id" class="avatar-uploader_3bt">
      <img @click="rotatePhoto(10)" alt="" src="@/assets/icons/rotateRight.png">
      <img @click="deleteFile()" alt="" src="@/assets/icons/icon-delete-dark.png">
      <img @click="rotatePhoto(20)" alt="" src="@/assets/icons/rotateLeft.png">
    </div>

    <Teleport to="body">
      <el-dialog v-model="dialogVisible" top="50px" :style="{width: globalStore.isMobileView?'100%':'50%'}">
        <a :href="photoEL.photoPath" target="_blank"
           v-if="photoEL.id && !globalStore.isMobileView"
           style="position: absolute; right: 40px; top: 14px; color: #bbb"> Открыть в отдельной вкладке</a>
        <img :src="dialogImageUrl+isDirty" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </Teleport>
  </div>
</template>


<script setup>

/**
 * для Листа осмотра
 */

import { ElMessage } from 'element-plus'
import { Plus, ZoomIn } from '@element-plus/icons-vue'
import { ref, watchEffect } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'

const globalStore = useGlobalStore()
const props = defineProps(['photo', 'noEdit', 'itemId'])
const emits = defineEmits(['setNewPhoto'])
const photoEL = ref(null)

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const isDirty = ref('')


function deleteFile() {
  emits('setNewPhoto', props.photo, 'delete')
  photoEL.value = null
}

function rotatePhoto(type) {
  globalStore.rotatoPhotoInspection(props.photo.previewPhotoId, props.photo.photoId, type).then(() => {
    isDirty.value = '?' + parseInt(Math.random() * 100)
  })
}


const handlePictureCardPreview = () => {
  if (!photoEL.value) return false
  dialogImageUrl.value = photoEL.value.photoPath
  dialogVisible.value = true
}

watchEffect(() => photoEL.value = props.photo)

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
  const f = obj.file

  if (f) {
    const fr = new FileReader()
    fr.onload = () => {
      const fbase64 = fr.result //файл в base64
      photoEL.value = { photoPath: fbase64, previewPhotoPath: fbase64, itemId:props.itemId }

      emits('setNewPhoto', photoEL.value, 'addPhoto')
    }
    fr.readAsDataURL(f)
  }
}

</script>