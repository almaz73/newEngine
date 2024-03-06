<template>
  <el-upload
      class="avatar-uploader"
      accept="image/png, image/gif, image/jpeg"
      :show-file-list="false"
      :auto-upload="true"
      :http-request="uploadFiles"
  >
    <img alt="" v-if="photoUrl" :src="photoUrl" class="avatar"/>
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
.el-upload {
  width: 126px;
  height: 126px;
}

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
import {ref, watchEffect} from "vue";

const props = defineProps(['url'])
const emits = defineEmits(['setNewPhoto'])
const photoUrl = ref(null)

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