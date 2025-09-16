<template>
  <div style="min-height: 150px; width:150px">
    <div class="avatar-uploader">
      <div class="el-upload">
        <i  v-if="!showPhoto"
            class="el-icon avatar-uploader-icon" @click="upload()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
            <path fill="currentColor"
                  d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z">
            </path>
          </svg>
        </i>

        <div
            v-if="showPhoto"
            @click="handlePictureCardPreview()"
            style="background: #00000000; width: 100%; height: 100%">
        </div>

        <input class="el-upload__input" ref="Upload__input" name="file" accept="image/*" capture type="file">

        <div class="photo-upload">
          <img ref="imagePreview" alt="" style="width: 100%">
        </div>
      </div>

      <div class="buttons" style="display: flex; justify-content: center"
           v-if="showPhoto">
        <img @click="upload()" alt="" src="@/assets/icons/icon-edit-dark.png">
        <img @click="deleteFile()" alt="" src="@/assets/icons/icon-delete-dark.png">
        <img @click="rotate(20)" alt="" src="@/assets/icons/rotateRight.png">
        <img @click="rotate(10)" alt="" src="@/assets/icons/rotateLeft.png">
      </div>
      <div style="height: 42px" v-if="!showPhoto"></div>

    </div>
  </div>
  <Teleport to="body">
    <el-dialog v-model="dialogVisible" >
      <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
    </el-dialog>
  </Teleport>
</template>

<script setup lang="ts">
import {onMounted, ref, watch, watchEffect} from "vue";
import {rotatePhoto} from "@/pages/pub/somefiles/GlobFuntions.ts";

const props = defineProps(['src', 'id'])
const emits = defineEmits(['setNewPhoto', 'deletePhoto'])
const Upload__input = ref(null)
const imagePreview = ref(null)
let originalWidth = null
let originalHeight = null
const showPhoto = ref(false)

const dialogImageUrl = ref('')
const dialogVisible = ref(false)


watchEffect(()=>{
  if(props.src) {
    imagePreview.value.src = props.src
    showPhoto.value = true
  }
})

const handlePictureCardPreview = () => {
  dialogImageUrl.value = imagePreview.value.src
  dialogVisible.value = true
}



function deleteFile(){
  imagePreview.value.src = null
  showPhoto.value = false
  emits('deletePhoto', props.id)
}
function rotate(val){
   rotatePhoto(imagePreview.value.src, val, originalHeight, originalWidth).then(res=>{
     imagePreview.value.src = res
   })
}

function upload() {
  Upload__input.value.click();
  Upload__input.value.addEventListener('change', photoInp)
}

function removeEventListener() {
  Upload__input.value.removeEventListener('change', photoInp)
}

function photoInp(e) {

  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      showPhoto.value = true

      // Загружаем оригинальное изображение
      let originalImageData = e.target.result;
      imagePreview.value.src = originalImageData

      // Получаем размеры изображения
      const img = new Image();
      img.onload = function() {
        originalWidth = img.width;
        originalHeight = img.height;
      };
      img.src = originalImageData;

      emits('setNewPhoto', originalImageData)
    };

    reader.readAsDataURL(file);
  }

  removeEventListener()
}


</script>