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
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useDealStore} from '@/stores/dealStore'
import {useGlobalStore} from "@/stores/globalStore";
import {PhotoNumberBuyer} from "@/utils/globalConstants";
import UploadPhotoAuto from "@/components/UploadPhotoAuto.vue";

const globalStore = useGlobalStore()
const dealStore = useDealStore()
const bigPhotos = ref({})
const photoOrder = ref({})
const mandatoryPhotoList = [10, 20, 22, 24, 290, 19, 11, 23, 308, 306, 307]


function open() {
  getData()
}

function getData(upd) {
  if (upd) photoOrder.value = {}
  dealStore.getPhoto(dealStore.deal.dealId, upd).then(res => {
    let arr = res.data.items
    arr.forEach(el => bigPhotos.value[el.number] = el.fullPhotoUrl)
    mandatoryPhotoList.forEach(el => {
      let p = arr.find(item => item.number === el)
      if (p) {
        photoOrder.value[el] ={
          smallPhoto: p.thumbSmallUrl,
          bigPhoto: p.fullPhotoUrl,
          id: p.id
        }
      }
    })
  })
}


defineExpose({open})
</script>