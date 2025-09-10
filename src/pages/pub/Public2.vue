<template>
  <div class="frame_pub">
    <div class="container">
      <button class="fix-button" v-if="isDatas" @click="removeDatas()"> ОЧИСТИТЬ</button>
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
          <button class="upload-btn" onclick="document.getElementById('fileInput').click()">
            Выбрать фото
          </button>
          <div id="file-list"></div>
        </div>
      </div>


      <div style="display: flex; justify-content: center">
        <el-button size="large" @click="prevPage()">
          Назад
        </el-button>
        <el-button type="primary" size="large" @click="nextPage()">
          Перейти на описание повреждений
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {usePubStore} from "@/pages/pub/pubStore";
import {formattingPhone, numberWithSpaces, numberNoSpace, emailValidate} from "@/pages/pub/GlobFuntions";
import '@/pages/pub/style.css'
import router from "@/router";

const pubStore = usePubStore()
const auto = ref<{}>({brand: null, model: null, generation: null, year: null, mileageAuto: 0})
const brands = ref<[]>()
const models = ref<[]>()
const generations = ref<[]>()
const modifications = ref<[]>()
const years = ref([])
const isWaiting = ref(false)
const isDatas = ref()
const cities = ["Алматы",
  "Альметьевск",
  "Бавлы",
  "Белгород",
  "Бугульма",
  "Буинск",
  "Волгоград",
  "Грозный",
  "Екатеринбург",
  "Ижевск",
  "Йошкар-Ола",
  "Казань",
  "Москва",
  "Набережные Челны",
  "Нижнекамск",
  "Октябрьский",
  "Омск",
  "Пермь",
  "Россия",
  "Самара",
  "Саранск",
  "Саратов",
  "Стерлитамак",
  "Сургут",
  "Сызрань",
  "Томск",
  "Тюмень",
  "Ульяновск",
  "Уфа",
  "хз",
  "Чайковский",
  "Чебоксары",
  "Челябинск",
  "Чехов"]
const mileageAuto1000 = ref(0)

function removeDatas() {
  localStorage.removeItem('datas')
  isDatas.value = null
  auto.value = {}
}

let timerSave;

function saveDatas() {
  // локально запоминаем введенные данные
  let newDatas = {}
  Object.entries(auto.value).forEach(el => {
    if (el[1]) newDatas[el[0]] = el[1]
  })
  if (Object.keys(newDatas).length) {
    isDatas.value = true
    saveF(newDatas)
  }

  function saveF(val: any) {
    if (timerSave) clearTimeout(timerSave)
    timerSave = setTimeout(() => {
      localStorage.setItem('datas', JSON.stringify(val))
      console.log(' - - - - - - - - -  ')
    }, 200)
  }
}


let datas = localStorage.getItem('datas')
if (datas) {
  isDatas.value = true
  fillDields(JSON.parse(datas))
}

function fillDields(datas: any) {
  console.log('datas = ', datas)
  // заполняем созраненными данными
  Object.assign(auto.value, datas)
  // if (auto.value.brand) getModels(auto.value.brand)
  // if (auto.value.model) getGenerations(auto.value.model)
  // if (auto.value.generation) getModifications(auto.value.generation)
  // if (auto.value.modification) getComplectations(auto.value.modification)
  // if (auto.value.mileageAuto) mileageAuto1000.value = numberNoSpace(auto.value.mileageAuto) / 1000

}


function nextPage() {
  console.log('11 = ', 11)
  router.push('public2')
}


</script>
