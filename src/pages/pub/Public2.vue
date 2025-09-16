<template>
  <div class="frame_pub">

    <div class="container photo">

      <h2>Добавьте фото <br>необходимые для оценки автомобиля</h2>

      <div style="display: flex; width: 100%; flex-wrap: wrap; justify-content: space-around"
          :class="{empty:false}" >

         <div @click="currentPhoto=nessasaryPhoto"  v-for="nessasaryPhoto in mandatoryPhotoList" :key="nessasaryPhoto">
           <span style="display: flex;
           align-items: end;
           width: 150px; flex-wrap: wrap; justify-content: center; min-height: 50px; " >{{ PhotoNumberBuyer[nessasaryPhoto] }}</span>
            <UploadPhotoJS @setNewPhoto="setNewPhoto"/>
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
import {savePhotoToDB} from "@/pages/pub/somefiles/IndexDBService.ts";

const photos = ref({})
const mandatoryPhotoList = [10, 20, 22, 290, 19, 11]
let currentPhoto = null

function setNewPhoto(file:string) {
  console.log('file = ', file.slice(0, 40))
  console.log('currentPhoto = ',currentPhoto)

  initDatabase()
  alert()

}


const prevPage = () => router.push('public')
const nextPage = () => router.push('public3')


</script>
