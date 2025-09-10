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
        <form>
          <div class="form-row" style="text-align: center">

            <div class="damage-map">
              <h2>Карта повреждений автомобиля</h2>
              <div></div>
              <div class="damage_block" id="damageMap">
                <div class="flex-grid">
                  <!-- ngRepeat: (key, value) in allDamages -->
                  <div class="flex-grid-1" style="">
                    <IMG_1/>

                  </div>
                  <div
                      class="flex-grid-1"
                      nnnnn-repeat="(key, value) in allDamages"
                  >
                    <IMG_2/>
                  </div>
                  <div>
                    <IMG_3/>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="form-row" style="text-align: center">
            <div class="form-group">
              <el-checkbox v-model="type10">
                Нет повреждений
              </el-checkbox>
            </div>
          </div>


        </form>

        <div style="display: flex; justify-content: center">

          <el-button size="large" @click="prevPage()">
            Назад
          </el-button>

          <el-button type="primary" size="large" @click="nextPage()">
            Получить оценку
          </el-button>
        </div>
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
import IMG_1 from "@/pages/pub/images/IMG_1.vue";
import IMG_2 from "@/pages/pub/images/IMG_2.vue";
import IMG_3 from "@/pages/pub/images/IMG_3.vue";

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


function prevPage() {
  router.push('public2')
}



</script>
