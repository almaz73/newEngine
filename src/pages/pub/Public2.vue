<template>
  <div class="frame_pub">

    <div class="container photo">

      <h2>Добавьте фото <br>необходимые для оценки автомобиля</h2>

      <div style="display: flex; margin-left: 10px; width: 100%; flex-wrap: wrap; justify-content: space-around"
          :class="{empty:false}" >

         <div @click="currentPhoto=nessasaryPhoto"  v-for="nessasaryPhoto in mandatoryPhotoList" :key="nessasaryPhoto">
           <span style="display: flex;
           align-items: end;
           width: 150px; flex-wrap: wrap; justify-content: center; min-height: 50px; " >{{ PhotoNumberBuyer[nessasaryPhoto] }}</span>
            <UploadPhotoJS/>
          </div>

      </div>



      <div style="display: flex; justify-content: center; margin: 40px 0">
        <el-button size="large" @click="prevPage()">
          Назад
        </el-button>
        <el-button type="primary" size="large" @click="nextPage()">
          Далее ▷
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import '@/pages/pub/somefiles/style.css'
import '@/pages/pub/somefiles/style2.css'
import router from "@/router";
import {PhotoNumberBuyer} from "@/utils/globalConstants.ts";
import UploadPhotoJS from "@/pages/pub/somefiles/UploadPhotoJS.vue";

const photos = ref({})
const mandatoryPhotoList = [10, 20, 22, 290, 19, 11]
let currentPhoto = null

// function setNewPhoto(file) {
//   console.log('file = ', file)
//   let zzz = null
//
//
//   if (file && file.fbase64) {
//     photos.value[currentPhoto] = {file: file.fbase64.split('base64,')[1]}
//
//     url = file
//
//     // photos.value[currentPhoto] = {url:  file.fbase64.split('base64,')[1]}
//     // user.value.avatar.file = file.fbase64.split('base64,')[1]
//     // user.value.avatar.name = file.name
//   } else {
//     // user.value.avatar.file = null
//     // user.value.avatar.url = ''
//   }
//
//   console.log('photos = ', photos)
// }


const prevPage = () => router.push('public')
const nextPage = () => router.push('public3')


</script>
