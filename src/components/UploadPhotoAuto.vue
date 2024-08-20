<template>
  <el-upload
    class="avatar-uploader"
    accept="image/png, image/gif, image/jpeg"
    :show-file-list="false"
    :auto-upload="true"
    ref="upload"
    :http-request="uploadFiles"
    :data-name="props.number"
  >
    <span class="photo-upload" @click.stop="()=>{}" v-if="props.photo">
      <span class="photo-upload__btns">
        <span @click="handlePictureCardPreview()" title="Посмотреть" style="width: 130px; height: 160px">
          <el-icon><zoom-in /></el-icon>
        </span>
      </span>
   </span>
    <img alt="" v-if="props.photo" :src="props.photo.smallPhoto+isDirty" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon">
      <Plus />
    </el-icon>

  </el-upload>

  <div class="buttons" style="display: flex" v-if="props.photo">
    <img @click="newFile()" alt="" src="@/assets/icons/icon-edit-dark.png">
    <img @click="deleteFile()" alt="" src="@/assets/icons/icon-delete-dark.png">
    <img @click="rotatePhoto(20)" alt="" src="@/assets/icons/rotateRight.png">
    <img @click="rotatePhoto(10)" alt="" src="@/assets/icons/rotateLeft.png">
  </div>

  <el-dialog v-model="dialogVisible" top="0" draggable :width="globalStore.isMobileView?'100%':'73%'">
    {{ PhotoNumberBuyer[nextNumber] }}
    <img v-if="props.photo && props.number===nextNumber"
         :src="props.listBigPictures[nextNumber]+isDirty" alt=""
         style="max-height: 800px" />
    <img v-if="props.photo && props.number!==nextNumber"
         :src="props.listBigPictures[nextNumber]" alt=""
         style="max-height: 800px" />
    <el-button @click="nextPhoto(-1)"> < </el-button>
    <el-button @click="nextPhoto(1)"> > </el-button>
  </el-dialog>
</template>


<script setup>

import { ElMessage } from 'element-plus'
import { PhotoNumberBuyer } from '@/utils/globalConstants'
import { Plus, ZoomIn } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'

const dealStore = useDealStore()
const props = defineProps(['photo', 'number', 'listBigPictures'])
const emits = defineEmits(['setNewPhoto'])
const globalStore = useGlobalStore()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref(null)
const isDirty = ref('')
const nextNumber = ref(props.number)


function nextPhoto(val) {
  let numbers = Object.keys(props.listBigPictures)

  nextNumber.value = +numbers[numbers.lastIndexOf('' + nextNumber.value) + val]
  if (!nextNumber.value) nextNumber.value = +numbers[0]
}

function newFile() {
  document.querySelectorAll(`.avatar-uploader[data-name="${props.number}"]`)[0].querySelector('input').click()
}


const handlePictureCardPreview = () => {
  dialogImageUrl.value = props.photo.bigPhoto
  dialogVisible.value = true
}

function keyHear(key) {
  if (key.key === 'ArrowLeft') nextPhoto(-1)
  if (key.key === 'ArrowRight')nextPhoto(1)
}

watch(dialogVisible, (val) => {
  if (val) document.addEventListener('keydown', keyHear)
  if (!val) document.removeEventListener('keydown', keyHear)
})




const deleteFile = () => {
  globalStore.deleteFile(props.photo.id).then(res => res.status === 200 && emits('setNewPhoto', true))
}

function rotatePhoto(type) {
  globalStore.rotatoPhoto(props.photo.id, type).then(res => {
    emits('setNewPhoto', true)
    isDirty.value = '?' + parseInt(Math.random() * 100)
  })
}


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

  if (obj.file) {
    const fr = new FileReader()
    fr.onload = () => {
      globalStore.uploadFile({ file: obj.file, fileName: obj.file.name }).then(res => {
        let files = res.data.files
        let params = {
          autoId: dealStore.deal.auto.autoId,
          dealId: dealStore.deal.id,
          number: props.number,
          fullPhotoId: files[0].id,
          thumbMediumId: files[1].id,
          thumbSmallId: files[2].id
        }
        globalStore.attachFile(params).then(() => emits('setNewPhoto', true))
      })
    }
    fr.readAsDataURL(obj.file)
  }
}

</script>