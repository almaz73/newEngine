<template>
  <div style="border: 1px solid #999; width: 98%; padding: 4px; text-align: center">
        <textarea rows="3" style="width:100%"
                  title="Создать снимок экрана можно программой Ножницы от Windows ✂
            Второй способ - использовать горячие клавиши Win + Shift + S. "/>

    <div
         style="margin: -65px 0 10px; pointer-events: none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           style="width: 28px"
           stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
           viewBox="0 0 24 24" class="upload-loader__image">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9"></path>
        <path d="m16 16-4-4-4 4"></path>
      </svg>
      <br>
      <span> Добавьте скрин экрана сюда по ctrl+V</span>
    </div>
<!--    <span v-for="photo in allPhoto">-->
<!--            <img src="{{photo.img64}}"-->
<!--                 style="border: 1px dotted #999; width: 138px; max-height: 150px; object-fit:contain"/>-->
<!--            <span title="Удалить" @click="deletePhoto(photo.file)"-->
<!--                  style="cursor: pointer; margin-right: 20px; vertical-align: top">❌</span>-->
<!--        </span>-->
  </div>

  <div>

  </div>
</template>

<script setup lang="ts">


import {UploadFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {checkPictureBeforeUpload} from "@/utils/globalFunctions";
import {ref} from "vue";

const allPhoto=ref([])
function addScreen(event) {
  event.stopPropagation()
  ElMessage.info('Теперь вставьте изображение по ctrl+V')
}

function deletePhoto() {
  console.log('deletePhoto = ')
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

</script>