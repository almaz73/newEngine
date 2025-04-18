<template>
  <div class="many-photo" :class="{empty:false}" v-for="nessasaryPhoto in mandatoryPhotoList" :key="nessasaryPhoto">
    {{ PhotoNumberBuyer[nessasaryPhoto] }}

    <div class="photo-place" style="margin: 12px; min-height: 150px">
      <UploadPhotoAuto @setNewPhoto="getData"
                       :photo="photoOrder[nessasaryPhoto]"
                       :number="nessasaryPhoto"
                       :listBigPictures="bigPhotos"
      />
    </div>
  </div>

  <C_PhotoVideoFilesAnalitic ref="c_PhotoVideoFilesAnalitic"/>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {useDealStore} from '@/stores/dealStore'
import {useGlobalStore} from "@/stores/globalStore";
import {PhotoNumberBuyer} from "@/utils/globalConstants";
import UploadPhotoAuto from "@/components/UploadPhotoAuto.vue";
import C_PhotoVideoFilesAnalitic from '@/pages/deal/tabs/collapses/C_PhotoVideoFilesAnalitic.vue'

const globalStore = useGlobalStore()
const dealStore = useDealStore()
const bigPhotos = ref({})
const photoOrder = ref({})
const mandatoryPhotoList = [10, 20, 22, 24, 290, 19, 11, 23, 308, 306, 307]
const analiticPhoto = ref([])
const c_PhotoVideoFilesAnalitic = ref(null)



function open() {
  getData(false)
}

function getData(upd:boolean) {
  if (upd) photoOrder.value = {}
  analiticPhoto.value = []
  dealStore.getPhoto(dealStore.deal.dealId, upd).then(res => {
    let arr = res.data.items

    arr.forEach((el:any) => {
      bigPhotos.value[el.number] = el.fullPhotoUrl
      if (el.number === 5) analiticPhoto.value.push(el)
    })

    if (c_PhotoVideoFilesAnalitic.value)c_PhotoVideoFilesAnalitic.value.open(analiticPhoto.value)

    mandatoryPhotoList.forEach(el => {
      let p = arr.find((item:any) => item.number === el)
      if (p) {
        photoOrder.value[el] ={
          fullphotos: p.thumbSmallUrl,
          bigPhoto: p.fullPhotoUrl,
          id: p.id
        }
      }

    })
  })
}


defineExpose({open})
</script>