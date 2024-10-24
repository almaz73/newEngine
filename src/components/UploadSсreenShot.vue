<template>
  <div class="shot-field"
       title="Создать снимок экрана можно программой Ножницы от Windows ✂
            Второй способ - использовать горячие клавиши Win + Shift + S. "
       :style="{'opacity':isActive?'1':'.5'}"
       @click.once="toActive()"
  >
    <div v-if="!allPhoto.length">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           style="width: 28px"
           stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
           viewBox="0 0 24 24" class="upload-loader__image">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9"></path>
        <path d="m16 16-4-4-4 4"></path>
      </svg>
      <br>

      <span> Добавьте сюда скриншоты по ctrl+V ⯑</span>
    </div>

    <div v-if="allPhoto.length">
      <span v-for="photo in allPhoto" style="display: inline-flex">
              <img :src="photo.img64" alt=""
                   style="border: 1px dotted #111; width: 140px; max-height: 100px; object-fit:contain" />
              <span title="Удалить" @click="deletePhoto(photo.file)"
                    style="cursor: pointer; margin-right: 20px; vertical-align: top">❌</span>
      </span>
    </div>

  </div>

  <el-divider/>

</template>

<style>
.shot-field{
  border: 1px solid #999;
  width: 95%;
  padding: 12px;
  text-align: center;
  color: #444;
  margin: 6px 0;
  background: white;
}
.shot-field:hover{
  box-shadow: 0 0 12px #999;
  cursor: cell;
}
</style>

<script setup lang="ts">

import {ElMessage} from "element-plus";
import {checkPictureBeforeUpload} from "@/utils/globalFunctions";
import {onUnmounted, ref} from "vue";
import {useGlobalStore } from '@/stores/globalStore'
import {useDealStore} from '@/stores/dealStore'

const dealStore = useDealStore()
const globalStore=useGlobalStore()
const isActive = ref(false)
const allPhoto=ref([])

function toActive() {
  isActive.value = true
  window.addEventListener("paste", addShot)
}

onUnmounted(()=>window.removeEventListener("paste", addShot))
function addShot(e: Event) {
  if (e.clipboardData) {  // получаем все содержимое буфера
    var items = e.clipboardData.items;
    if (items && items[0].type.indexOf("image") !== -1) {
      let file = items[0].getAsFile();
      // console.log('file = ',file)
      addedAndShowPhoto(file)
    } else ElMessage.warning('Необходимо снять скриншот с экрана перед добавлением')
  }
}

function toBase64(file, onSuccess) {
  let reader = new FileReader();
  reader.onload = () => onSuccess(reader.result);
  reader.readAsDataURL(file);
}

function addedAndShowPhoto(file: File) {
  if (checkPictureBeforeUpload(file, 15, 'allFiles')) return false

  setTimeout(() => {
    toBase64(file, img64 => {
      console.log('img64 = ', img64)

      allPhoto.value.push({file, img64})
      // setTimeout(() => {
      //   scope.needShowPreloader = false
      // })

      console.log('allPhoto = ', allPhoto.value)
    })
  }, 100)
  // }
}


function deletePhoto(file: File) {
  allPhoto.value = allPhoto.value.filter(el => el.file.lastModified !== file.lastModified)
}

function uploadFiles(obj) {
  console.log('obj = ',obj)

  if (checkPictureBeforeUpload(obj.file, 2)) return false

  if (obj.file) {
    const fr = new FileReader()
    fr.onload = () => {
      globalStore.uploadFile({ file: obj.file, fileName: obj.file.name }).then(res => {
        let files = res.data.files
        let params = {
          autoId: dealStore.deal.auto.autoId,
          dealId: dealStore.deal.id,
          number: props.number,
          fullPhotoId: files[0].id,
          thumbMediumId: files[1].id,
          thumbSmallId: files[2].id
        }
        console.log('params = ',params)
        // globalStore.attachFile(params).then(() => emits('setNewPhoto', true))
      })
    }
    fr.readAsDataURL(obj.file)
  }
}

function saveScreens() {
  allPhoto.value.forEach(el => sendPhotoToServer(el.file))
}

function sendPhotoToServer(file:File) {

  globalStore.uploadFile({ file: file, fileName: file.name }).then(res => {
    let files = res.data.files
    let params = {
      fullPhotoId: files[0].id,
      thumbMediumId: files[1].id,
      thumbSmallId: files[2].id,
      autoId: dealStore.deal.auto.autoId,
      dealId: dealStore.deal.id,
      number: 5
    }

    globalStore.attachFile(params)
  })

}

defineExpose({ saveScreens })
</script>