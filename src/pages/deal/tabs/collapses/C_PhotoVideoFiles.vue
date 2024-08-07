<template>
  <div class="many-photo" :class="{empty:false}" v-for="nessasaryPhoto in mandatoryPhotoList" :key="nessasaryPhoto">
    {{ PhotoNumberBuyer[nessasaryPhoto] }}

    <div class="photo-place" style="margin: 12px; min-height: 150px">
      <UploadPhotoAuto @setNewPhoto="grtData"
                       :photo="photoOrder[nessasaryPhoto]"
                       :ind="nessasaryPhoto"

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
const photos = ref([])
const photoOrder = ref({10:'https://dev.autonet.pro/api/file/3484090'})
const mandatoryPhotoList = [10, 20, 22, 24, 290, 19, 11, 23, 308, 306, 307]


function grtData() {
  console.log('grtData = ', )
  open()
}

function open() {
  dealStore.getPhoto(dealStore.deal.dealId).then(res => {
    let arr = res.data.items
    photos.value = res.items
    mandatoryPhotoList.forEach(el => {
      let p = arr.find(item => item.number === el)
      if (p) {
        photoOrder.value[el] ={
          smallPhoto: p.thumbSmallUrl,
          bigPhoto: p.fullPhotoUrl,
          id:p.id
        }
      }

    })
  })
}


defineExpose({open})
</script>