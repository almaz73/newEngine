<template>
  <div>
    <div class="window-carPhoto" :class="{wcr_open:isShort}"
         :style="{width:globalStore.isMobileView?'360px':'520px' }">
      <div class="many-photo" :class="{empty:false}"
           v-for="nessasaryPhoto in mandatoryPhotoList"
           :key="nessasaryPhoto">
        {{ PhotoNumberBuyer[nessasaryPhoto] }}


        <div class="photo-place" style="margin: 12px; ">
          <UploadPhotoAutoComission
              :photo="photoOrder[nessasaryPhoto]||{bigPhoto:'', id:null}"
              :number="nessasaryPhoto"
              :listBigPictures="bigPhotos"
          />
        </div>
      </div>
      <br><br>
    </div>
    <el-button size="small" @click="isShort=!isShort" style="width: 100%; border: none">
      {{ !isShort ? 'Открыть галерею' : 'Закрыть галерею' }}

    </el-button>
  </div>
</template>
<style>
.window-carPhoto {
  height: 173px;
  overflow-y: hidden;
  transition: height .3s ease-in-out;
}

.window-carPhoto.wcr_open {
  height: 760px;
}

@media (width < 500px) {
  .window-carPhoto.wcr_open {
    height: auto
  }
}
</style>

<script setup lang="ts">
import {ref, watchEffect} from 'vue'
import {useGlobalStore} from "@/stores/globalStore";
import {PhotoNumberBuyer} from "@/utils/globalConstants";
import {useAppealStore} from '@/stores/appealStore'
import UploadPhotoAutoComission from '@/components/UploadPhotoAutoComission.vue'

const appealStore = useAppealStore()
const globalStore = useGlobalStore()
const bigPhotos = ref<any>({})
const photoOrder = ref<any>({})
const mandatoryPhotoList = [10, 20, 22, 24, 290, 19, 11, 23, 308, 306, 307]
const analiticPhoto = ref([])
const c_PhotoVideoFilesAnalitic = ref(null)
const isShort = ref(false)


watchEffect(() => {
  appealStore.comissId && getData(appealStore.comissId)
})


function getData(comissId: number) {
  photoOrder.value = {}
  analiticPhoto.value = []

  appealStore.getComissionPhotos(comissId).then(res => {
    let arr = res.data.items

    arr.forEach((el: any) => {
      bigPhotos.value[el.number] = el.fullUrl
    })


    c_PhotoVideoFilesAnalitic.value?.open(analiticPhoto.value)

    mandatoryPhotoList.forEach(el => {
      let p = arr.find((item: any) => item.number === el)
      if (p) photoOrder.value[el] = {bigPhoto: p.fullUrl, id: p.id}
    })
  })
}

</script>