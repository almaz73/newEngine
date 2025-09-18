<template>
  <div class="frame_pub">
    <button class="install-btn" style="" id="installBtn">Открыть в приложении</button>
    <div id="offline-text">
      Нет подключения к интернету.
    </div>

    <div class="container photo">

      <h2>Добавьте фото <br>необходимые для оценки автомобиля</h2>

      <div style="display: flex; width: 100%; flex-wrap: wrap; justify-content: space-around"
           :class="{empty:false}">

        <div @click="currentPhoto=nessasaryPhoto" v-for="nessasaryPhoto in mandatoryPhotoList" :key="nessasaryPhoto">
           <span style="display: flex;
           align-items: end;
           width: 150px; flex-wrap: wrap; justify-content: center; min-height: 50px; ">{{
               PhotoNumberBuyer[nessasaryPhoto]
             }}</span>
          <UploadPhotoJS @setNewPhoto="setNewPhoto" :src="photos[nessasaryPhoto]" @deletePhoto="deletePhoto" :id="nessasaryPhoto"/>
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
import '@/pages/pub/script__pub_sw.js'
import '@/pages/pub/somefiles/style.css'
import '@/pages/pub/somefiles/style2.css'
import router from "@/router";
import {PhotoNumberBuyer} from "@/utils/globalConstants.ts";
import UploadPhotoJS from "@/pages/pub/somefiles/UploadPhotoJS.vue";
import {getPhotoFromDB, initDatabase, savePhotoToDB, deletePhoto} from "@/pages/pub/somefiles/IndexDBService.ts";

const photos = ref({})
const mandatoryPhotoList = [10, 20, 22, 290, 19, 11]
let currentPhoto = null

initDatabase().then(() => getSavedPhotos())

function getSavedPhotos() {
  mandatoryPhotoList.forEach(el => {
    getPhotoFromDB(el).then(res => {
      if (res) photos.value[el] = res
    })
  })
}

function deletePhoto(val) {
  savePhotoToDB('', val)
}

function setNewPhoto(file: string) {  // Сохраняем в IndexedDB
  savePhotoToDB(file, currentPhoto)
      .then(() => console.log('Фотография успешно сохранена в IndexedDB!'))
      .catch(error => console.error('Ошибка сохранения:', error));
}

const prevPage = () => router.push('public')
const nextPage = () => router.push('public3')


</script>
