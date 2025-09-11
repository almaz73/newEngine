<template>
  <div class="frame_pub">
    <div class="container">
      <img src="@/assets/img/loading.gif" alt=""
           :class="{showwaiter:isWaiting}" class="waiter"
      />
      <!--      <div style="margin: auto; width: 243px"><img src="@/pages/pub/images/logo.png"></div>-->
      <!--      <h1>Онлайн оценка вашего автомобиля</h1>-->

      <div class="form-section">
        <div class="photo-upload">
          <p>Добавить фото</p>
          <p>
            Не более 10 фотографий одновременно в формате JPG или PNG. Макс. размер одного фото —
            10MB.
          </p>
          <input
              type="file"
              id="fileInput"
              accept="image/jpeg,image/png"
              multiple
              style="display: none"
          />

          <el-button type="primary" size="large"  @click="fileAdd()">Выбрать фото</el-button>
          <div id="file-list-preview"></div>
        </div>
      </div>


      <div style="display: flex; justify-content: center">
        <el-button size="large" @click="prevPage()">
          Назад
        </el-button>
        <el-button type="primary" size="large" @click="nextPage()">
          Описание повреждений ▷
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

const isWaiting = ref(false)
const isDatas = ref(null)
// const fileListPreview = ref(null)

function removeDatas() {

}


let fileListPreview = null
// const fileInput = document.getElementById('fileInput');


console.log('fileListPreview = ',fileListPreview)

function fileAdd() {
  fileListPreview = document.getElementById('file-list-preview');
  let bt = document.getElementById('fileInput')
  if (bt) bt.click()
  bt.addEventListener('change', handleFileSelect);
}

function handleFileSelect(event) {
  console.log('fileListPreview = ',fileListPreview)

  fileListPreview.innerHTML = ''; // Очищаем предыдущие превью
  const files = event.target.files;
  
  console.log('files = ',files)

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('image/')) {
      continue;
    }

    const previewContainer = document.createElement('div');
    console.log('previewContainer = ',previewContainer)
    
    previewContainer.classList.add('file-preview-item');

    const img = document.createElement('img');
    
    img.file = file;

    previewContainer.appendChild(img);
    
    console.log('previewContainer = ',previewContainer)
    
    fileListPreview.appendChild(previewContainer);

    const reader = new FileReader();
    reader.onload = (function (aImg) {
      return function (e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }
}


function prevPage() {
  router.push('public')
}

function nextPage() {
  router.push('public3')
}


</script>
