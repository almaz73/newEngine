<template>
  <div>
    <div v-for="(file, ind) in files">
      <div class="file-frame">
        <img alt="" src="@/assets/img/doc.png" v-if="file.mimeType==='doc'" />
        <img alt="" src="@/assets/img/txt.png" v-if="file.mimeType==='txt'" />
        <img alt="" src="@/assets/img/pdf.png" v-if="file.mimeType==='pdf'" />
        <img alt="" src="@/assets/img/rtf.png" v-if="file.mimeType==='rtf'" />
        <img alt="" src="@/assets/img/xls.png" v-if="file.mimeType==='xls'" />
        <img alt="" src="@/assets/img/picture.png"
             v-if="['png','jpg','gif','raw','tiff','bmp','psd'].includes(file.mimeType)" />

        <a v-if="!file.Document" @click="openFile(file)">{{ file.title }}</a>
        <span v-if="file.Document">{{ file.title }}</span>
        <span size="small" style="cursor: pointer" @click="deleteFile(itemIndex, ind)"> ✖ </span>
      </div>
    </div>

    <br>
    <el-upload
      ref="upload"
      :show-file-list="false"
      style="float: right"
      :http-request="uploadFiles"
      :auto-upload="true"
    >
      <template #trigger>
        <el-button :icon="Plus"> Файл</el-button>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { checkPictureBeforeUpload } from "@/utils/globalFunctions";
import { ElMessage } from "element-plus";
import { ref } from "vue";

const props = defineProps(['files'])
const emits = defineEmits(['setFiles'])
const files = ref([])

files.value = props.files

function openFile(file: any) {
  let fileUrl = `/api/file/${file.documentId}`
  window.open(fileUrl)
}

function deleteFile(itemIndex, ind) {
  files.value.splice(ind, 1)
}
function uploadFiles(obj) {
  if (checkPictureBeforeUpload(obj.file, 10, 'allFiles')) return false
  const f = obj.file

  if (f) {
    const fr = new FileReader()
    fr.onload = () => {
      const fbase64 = fr.result //файл в base64
      if (!files.value) files.value = []
      files.value.push({
        mimeType: setMimeType(obj.file.name),
        Document: fbase64.split('base64,')[1],
        title: obj.file.name
      })
      emits('setFiles', files.value)
    }
    fr.readAsDataURL(f)
  }
}

function getTextAfterLastDot(str) {
  const lastIndex = str.lastIndexOf('.')
  return lastIndex !== -1 ? str.substring(lastIndex + 1) : ''
}

function setMimeType(fileName) {
  let mimeType = getTextAfterLastDot(fileName)
  if (mimeType.toLowerCase().includes('xls')) mimeType = 'xls'
  if (mimeType.toLowerCase().includes('doc')) mimeType = 'doc'

  if (['exe', 'bat'].includes(mimeType.toLowerCase())) {
    ElMessage.warning('Осторожно! Вы сохраняете запускаемый файл')
    return false
  }

  if (!mimeType || !['txt', 'doc', 'xls', 'pdf', 'rtf', 'png', 'jpg', 'gif', 'raw', 'tiff', 'bmp', 'psd'].includes(mimeType)) {
    mimeType = 'txt'
  }

  return mimeType.toLowerCase()
}

</script>