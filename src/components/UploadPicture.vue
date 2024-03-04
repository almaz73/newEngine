<template>
  <el-upload
      class="avatar-uploader"
      :action="upload_url"
      accept="image/png, image/gif, image/jpeg"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
  >
    <img alt="" v-if="url" :src="url" class="avatar"/>
    <el-icon v-else class="avatar-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
<style>

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 126px;
  height: 126px;
  text-align: center;
}
</style>

<script setup>

import {ElMessage} from "element-plus";
import {Plus} from "@element-plus/icons-vue";
import {ref} from "vue";

const url = ref('')
const upload_url = '/api/file/upload-auto-photo?fileName=crocodile.png&access=public'
// const upload_url = '/api/File/upload-auto-photo'


const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

function handleAvatarSuccess(response, uploadFile) {
  console.log("response", response);
  console.log("uploadFile", uploadFile);
  url.value = response.fullPhotoUrl
}

</script>