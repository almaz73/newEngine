<template>
  <el-upload
    class="avatar-uploader"
    accept="image/png, image/gif, image/jpeg"
    :show-file-list="false"
    :auto-upload="true"
    ref="upload"
    :http-request="uploadFiles"
    :data-name="props.number"
  >
    <span class="photo-upload" @click.stop="()=>{}" v-if="props.photo">
      <span class="photo-upload__btns">
        <span @click="handlePictureCardPreview()" title="Посмотреть" style="width: 130px; height: 160px">
          <el-icon><zoom-in /></el-icon>
        </span>
      </span>
   </span>
    <img alt="" v-if="props.photo" :src="props.photo.bigPhoto+isDirty" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon">
      <Plus />
    </el-icon>

  </el-upload>

  <div class="buttons" style="display: flex" v-if="props.photo">
    <img @click="newFile()" alt="" src="@/assets/icons/icon-edit-dark.png">
    <img @click="deleteFile()" alt="" src="@/assets/icons/icon-delete-dark.png">
    <img @click="rotatePhoto(20)" alt="" src="@/assets/icons/rotateRight.png">
    <img @click="rotatePhoto(10)" alt="" src="@/assets/icons/rotateLeft.png">
  </div>
  <Teleport to="body">
    <el-dialog v-model="dialogVisible" top="12px"
               style="display:table;text-align:center;width:300px">
      <div>{{ PhotoNumberBuyer[nextNumber] }}</div>
      <a :href="props.listBigPictures[nextNumber]+isDirty" target="_blank"
         style="position:absolute;right:40px;top:14px;color:#bbb"> Открыть в отдельной вкладке</a>
      <img v-if="props.photo && props.number===nextNumber"
           :src="props.listBigPictures[nextNumber]+isDirty" alt=""
           style="max-height:800px" />
      <img v-if="props.photo && props.number!==nextNumber"
           :src="props.listBigPictures[nextNumber]" alt=""
           style="max-height: 800px" />
      <div style="margin-bottom: -10px">
        <el-button @click="nextPhoto(-1)"> <</el-button>
        <el-button @click="nextPhoto(1)"> ></el-button>
      </div>
    </el-dialog>

  </Teleport>
</template>


<script setup>
import { PhotoNumberBuyer } from '@/utils/globalConstants'
import { Plus, ZoomIn } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import {checkPictureBeforeUpload} from "@/utils/globalFunctions";

const dealStore = useDealStore()
const props = defineProps(['photo', 'number', 'listBigPictures'])
const emits = defineEmits(['setNewPhoto'])
const globalStore = useGlobalStore()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const upload = ref(null)
const isDirty = ref('')
const nextNumber = ref(props.number)


function nextPhoto(val) {
  let numbers = Object.keys(props.listBigPictures)

  // todo numbers не всегда содержит только необходимые для показа фотки, но и прикрепленные

  nextNumber.value = +numbers[numbers.lastIndexOf('' + nextNumber.value) + val]
  if (isNaN(nextNumber.value)) nextNumber.value = +numbers[0]
}

function newFile() {
  document.querySelectorAll(`.avatar-uploader[data-name="${props.number}"]`)[0].querySelector('input').click()
}


const handlePictureCardPreview = () => {
  dialogImageUrl.value = props.photo.bigPhoto
  dialogVisible.value = true
}

function keyHear(key) {
  if (key.key === 'ArrowLeft') nextPhoto(-1)
  if (key.key === 'ArrowRight') nextPhoto(1)
}

watch(dialogVisible, (val) => {
  if (val) document.addEventListener('keydown', keyHear)
  if (!val) document.removeEventListener('keydown', keyHear)
})


const deleteFile = () => {
  globalStore.deleteFile(props.photo.id).then(res => res.status === 200 && emits('setNewPhoto', true))
}

function rotatePhoto(type) {
  globalStore.rotatoPhoto(props.photo.id, type).then(() => {
    emits('setNewPhoto', true)
    isDirty.value = '?' + parseInt(Math.random() * 100)
  })
}


function uploadFiles(obj) {

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
          fullPhotoId: files.id,
          // fullPhotoId: files[0].id,
          // thumbMediumId: files[1].id,
          // thumbSmallId: files[2].id
        }
        globalStore.attachFile(params).then(() => emits('setNewPhoto', true))
      })
    }
    fr.readAsDataURL(obj.file)
  }
}

</script>