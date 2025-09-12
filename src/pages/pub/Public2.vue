<template>
  <div class="frame_pub">

    <div class="container photo">

      <h5> 🚀 разработке  </h5>

      <h2>Добавьте фото <br>необходимые для оценки автомобиля</h2>

      <div class="many-photo" :class="{empty:false}" v-for="nessasaryPhoto in mandatoryPhotoList" :key="nessasaryPhoto">
        {{ PhotoNumberBuyer[nessasaryPhoto] }}

        <div class="photo-place" style="margin: 12px; min-height: 150px"  @click="currentPhoto=nessasaryPhoto">


          <UploadPhotoAutoNew @setNewPhoto="setNewPhoto"

                              :photo="photos[nessasaryPhoto]"
                              :number="nessasaryPhoto"
                              :listBigPictures="bigPhotos"
          />
        </div>
      </div>


      <div style="display: flex; justify-content: center">
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
import UploadPhotoAutoNew from "@/pages/pub/somefiles/UploadPhotoAutoNew.vue";

const bigPhotos = ref<any>({})

const photos = ref({})
const mandatoryPhotoList = [10, 20, 22,  290, 19, 11]
let currentPhoto = null

function setNewPhoto(url) {
  console.log('currentPhoto = ', currentPhoto)
  console.log('file = ', url)
  if (url) {

    photos.value[currentPhoto] = {bigPhoto :url}
  } else {
    photos.value[currentPhoto].file = null
    photos.value[currentPhoto].url = ''
  }
  
  console.log(' photos.value = ', photos.value)
}


const prevPage = () => router.push('public')
const nextPage = () => router.push('public3')


</script>
