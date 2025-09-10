<template>
  <div class="frame_pub">
    <div class="container">
      <button class="fix-button" v-if="isDatas" @click="removeDatas()"> ОЧИСТИТЬ</button>
      <img src="@/assets/img/loading.gif" alt=""
           :class="{showwaiter:isWaiting}" class="waiter"
      />
      <div style="margin: auto; width: 243px"><img src="@/pages/pub/images/logo.png"></div>
      <h1>Онлайн оценка вашего автомобиля</h1>

      <div class="form-section">
        <form id="carEvaluationForm">
          <div class="form-row">
            <div class="form-group">
              <label class="required">VIN номер</label>
              <el-input
                  @change="auto.vin>16 && saveDatas()"
                  size="large"
                  placeholder="Введите VIN"
                  v-model="auto.vin"
                  maxlength="17"
                  minlength="17"
                  style="min-width: 325px;"
                  clearable
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Марка</label>
              <el-select
                  size="large"
                  clearable
                  placeholder="Выберите марку"
                  @change="getModels(auto.brand)"
                  v-model="auto.brand">
                <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label class="required">Модель</label>
              <el-select
                  size="large"
                  clearable
                  placeholder="Выберите модель"
                  @change="getGenerations(auto.model)"
                  v-model="auto.model">
                <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Поколение</label>
              <el-select
                  size="large"
                  clearable
                  placeholder="Выберите поколение"
                  @change="getModifications(auto.generation)"
                  v-model="auto.generation">
                <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label class="required">Год выпуска</label>
              <el-select
                  size="large"
                  clearable
                  placeholder="Выберите год выпуска"
                  @change="saveDatas()"
                  v-model="auto.year">
                <el-option v-for="item in years" :key="item" :label="item" :value="item"/>
              </el-select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Модификация</label>
              <el-select
                  size="large"
                  clearable
                  placeholder="Выберите модификацию"
                  @change="getComplectations(auto.modification)"
                  v-model="auto.modification">
                <el-option v-for="item in modifications" :key="item.id" :label="item.name_short" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label class="required">Пробег</label>
              <!--              <el-input v-model="auto.mileageAuto"/>-->

              <el-input v-model="auto.mileageAuto"
                        size="large"
                        clearable
                        @change="saveDatas()"
                        @input="()=>{auto.mileageAuto=numberWithSpaces(auto.mileageAuto)}"/>

              <span style="float: right">км</span>
              <el-slider
                  :show-tooltip="false"
                  v-model="mileageAuto1000"
                  style="max-width: 300px"
                  @input="auto.mileageAuto=numberWithSpaces(mileageAuto1000 * 10000)"/>

            </div>
          </div>

<!--          <div class="form-row">-->
<!--            <div class="form-group">-->
<!--              <label class="required">ПТС оригинальный</label>-->
<!--              <el-radio-group-->
<!--                  @change="saveDatas()"-->
<!--                  size="large"-->
<!--                  v-model="auto.isOriginalVC">-->
<!--                <el-radio :value="true">Да</el-radio>-->
<!--                <el-radio :value="false">Нет</el-radio>-->
<!--              </el-radio-group>-->
<!--            </div>-->

<!--            <div class="form-group">-->
<!--              <label class="required">Количество хозяев по ПТС</label>-->
<!--              <el-input-number v-model="auto.countHostsByVC" :min="1" :max="10" @change="saveDatas()"/>-->
<!--            </div>-->
<!--          </div>-->



          <div class="form-row">
            <div class="form-group">
              <label class="required">Телефон</label>

              <el-input placeholder="Телефон" title="Телефон"
                        size="large"
                        clearable
                        @change="saveDatas()"
                        :formatter="(value) =>value && formattingPhone(value, (val)=>auto.phone=val)"
                        v-model="auto.phone"/>
            </div>

            <div class="form-group">
              <label>Email</label>

              <el-input placeholder="Email"
                        clearable
                        size="large"
                        @change="emailValidate(auto.email); saveDatas()"
                        title="Email" v-model="auto.email" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="required">Город</label>
              <el-select
                  size="large"
                  clearable
                  placeholder="Выберите город"
                  @change="saveDatas()"
                  v-model="auto.city">
                <el-option v-for="item in cities" :key="item" :label="item" :value="item"/>
              </el-select>
            </div>

            <div class="form-group">
              <label class="required">ФИО</label>
              <el-input
                  input-style="500px"
                  @change="saveDatas()"
                  size="large"
                  clearable
                  placeholder="Введите имя"
                  v-model="auto.person"
                  style="min-width: 325px;"
              />
            </div>
          </div>


        </form>

        <div style="text-align: center">
          <el-button type="primary" size="large" @click="nextPage()">
            Перейти на добавление фото
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

  function saveF(val:any) {
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
  if (auto.value.brand) getModels(auto.value.brand)
  if (auto.value.model) getGenerations(auto.value.model)
  if (auto.value.generation) getModifications(auto.value.generation)
  if (auto.value.modification) getComplectations(auto.value.modification)
  if (auto.value.mileageAuto) mileageAuto1000.value = numberNoSpace(auto.value.mileageAuto) / 1000

}

let currentYear = new Date().getFullYear()
for (let year: number = currentYear; year >= 1980; year--) {
  years.value.push(year)
}

isWaiting.value = true
pubStore.getBrands().then(res => {
  brands.value = res.data
  isWaiting.value = false
})

function getModels(id: number) {
  isWaiting.value = true

  pubStore.getModels(id).then(res => {
    models.value = res.data
    isWaiting.value = false
    saveDatas()
  })
}

function getGenerations(id: number) {
  isWaiting.value = true
  pubStore.getGenerations(id).then(res => {
    generations.value = res.data
    isWaiting.value = false
    saveDatas()
  })
}

function getModifications(id: number) {
  isWaiting.value = true
  pubStore.getModifications(id).then(res => {
    modifications.value = res.data
    modifications.value = res.data.map(el => {
      el.name_short = el.name.split('\n')[0] + ' (' + el.engineTypeName + ')'
      return el
    })
    saveDatas()
    isWaiting.value = false
  })
}

function getComplectations(id: number) {
  pubStore.getComplectations(id).then(res => {
    console.log('res = ', res)
    saveDatas()
    // modifications.value = res.data
  })
}


function nextPage(){
  console.log('11 = ',11)
  router.push('public2')
}



</script>
