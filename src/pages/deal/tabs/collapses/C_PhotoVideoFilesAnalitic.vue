<template>
  <div v-if="permit('inspectionPhoto')">
    <div v-show="analiticPhoto && analiticPhoto.length">
      <h3 @click="()=>showAnaliticPhoto=!showAnaliticPhoto" style="cursor: pointer"> Фото прикрепленная аналитиком при
        оценке:
        <span>{{ showAnaliticPhoto ? '▼' : '▲' }}</span>
      </h3>


      <div class="uk-form-row" v-show="showAnaliticPhoto">
        <!--            user-permission="autoPhoto.inspectionPhoto"-->
        <div v-show="analiticPhoto && analiticPhoto.length">
              <span v-for="file in analiticPhoto" :key="file.id" style="float: left; margin:0 30px 30px 0">
                <UploadPhotoViewer
                  :width="100"
                  :height="100"
                  :url="file.fullPhotoUrl"
                  :id="file.id"
                  :delete="true"
                  @deleteAnaliticScreen="deleteAnaliticScreen"
                />
              </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import UploadPhotoViewer from '@/components/UploadPhotoViewer.vue'
import { useGlobalStore } from '@/stores/globalStore'
import { ElMessageBox } from 'element-plus'
import { permit } from '@/utils/permit.js'

const globalStore = useGlobalStore()
const analiticPhoto = ref(true)
const showAnaliticPhoto = ref(null)


function deleteAnaliticScreen(id: number) {
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
    .then(res => {
      res && globalStore.deleteFile(id).then(res => {
        if (res.status === 200) analiticPhoto.value = analiticPhoto.value.filter(el => el.id !== id)
      })
    })
    .catch(() => {
    })
}


function open(data: any) {
  analiticPhoto.value = data
}

defineExpose({ open })
</script>