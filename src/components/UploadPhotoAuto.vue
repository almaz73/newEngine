<template>
  <el-upload
      class="avatar-uploader"

      accept="image/png, image/gif, image/jpeg"
      :show-file-list="false"
      :auto-upload="true"
      ref="upload"
      :http-request="uploadFiles"
      :data-name="props.ind"

  >

    <span class="photo-upload" @click.stop="()=>{}" v-if="props.photo">
      <span class="photo-upload__btns">
        <span @click="handlePictureCardPreview()" title="Посмотреть" style="width: 130px; height: 160px">
          <el-icon><zoom-in/></el-icon>
        </span>

      </span>
   </span>
    <img alt="" v-if="props.photo" :src="props.photo.smallPhoto" class="avatar"/>
    <el-icon v-else class="avatar-uploader-icon">
      <Plus/>
    </el-icon>

  </el-upload>

  <div class="buttons" style="display: flex" v-if="props.photo">
    <img @click="newFile()" alt="" src="@/assets/icons/icon-edit-dark.png">
    <img @click="deleteFile()" alt="" src="@/assets/icons/icon-delete-dark.png">
    <img @click="rotateRight()" alt="" src="@/assets/icons/rotateRight.png">
    <img @click="rotateLeft()" alt="" src="@/assets/icons/rotateLeft.png">
  </div>

  <el-dialog v-model="dialogVisible" top="10px" draggable :width="globalStore.isMobileView?'100%':'50%'">
    <img :src="props.photo.bigPhoto" alt="Preview Image" style="height: 800px"/>
  </el-dialog>
</template>


<script setup>

import {ElMessage} from "element-plus";

import {Plus, ZoomIn} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";

const props = defineProps(['photo', 'ind'])
const emits = defineEmits(['setNewPhoto'])
const globalStore = useGlobalStore()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref(null)


function newFile() {
  document.querySelectorAll(`.avatar-uploader[data-name="${props.ind}"]`)[0].querySelector('input').click()
}


const handlePictureCardPreview = () => {
  dialogImageUrl.value = props.photo.bigPhoto
  dialogVisible.value = true
}


const deleteFile = () => {
  globalStore.deleteFile(props.photo.id).then(res => {
    emits('setNewPhoto')
  })


}

function rotateRight() {

}

function rotateLeft() {

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
    const fr = new FileReader();
    fr.onload = () => {

      globalStore.uploadFile({file: obj.file, fileName: obj.file.name}).then(res => {
        console.log('res = ', res)

        // todo нужно правильные

        globalStore.attachFile(
            {
              autoId: 124593,
              comment: null,
              dealId: 392407,
              fullPhotoId: 3484409,
              id: 830919,
              number: 20,
              thumbMediumId: 3484410,
              thumbSmallId: 3484411
            }
        ).then(() => emits('setNewPhoto'))


      })

    }
    fr.readAsDataURL(obj.file);
  }
}

// function uploadFiles(obj) {
//   console.log('obj = ',obj)
//
//   if (checkBeforeUpload(obj.file)) return false
//   const f = obj.file;
//
//   if (f) {
//     const fr = new FileReader();
//     fr.onload = () => {
//       saveFile({file:obj.file, fileName: obj.file.name})
//     }
//     fr.readAsDataURL(f);
//   }
// }
//
// function saveFile(file, fileName) {
//   globalStore.uploadFile({file, fileName}).then(res=>{
//     console.log('res = ',res)
//   })
// }


// function uploadFile(file) {
//
//   globalStore.uploadFile(file)
// }


</script>