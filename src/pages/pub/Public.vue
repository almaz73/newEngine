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
        <el-form ref="formRef" :model="auto">
          <div class="form-row">
            <div class="form-group">
              <label class="required">VIN номер</label>

              <el-form-item
                  prop="vin"
                  :rules="[{validator:checkVIN, required: true, min: 17, max: 17,
                    trigger: ['blur','change']}]">
                <el-input
                    @change="auto.vin>16 && saveDatas()"
                    size="large"
                    placeholder="Введите VIN"
                    v-model="auto.vin"
                    maxlength="17"
                    minlength="17"
                    clearable
                />
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Марка</label>
              <el-form-item
                  prop="brand"
                  :rules="{required: true, message: 'Не выбрана марка', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите марку"
                    @change="getModels(auto.brand)"
                    v-model="auto.brand">
                  <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group">

              <label class="required">Модель</label>
              <el-form-item
                  prop="model"
                  :rules="{required: true, message: 'Не выбрана модель', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите модель"
                    @change="getGenerations(auto.model)"
                    v-model="auto.model">
                  <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Поколение</label>
              <el-form-item
                  prop="generation"
                  :rules="{required: true, message: 'Не выбрано поколение', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите поколение"
                    @change="getModifications(auto.generation)"
                    v-model="auto.generation">
                  <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group">

              <label class="required">Год выпуска</label>
              <el-form-item
                  prop="year"
                  :rules="{required: true, message: 'Не выбран год выпуска', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите год выпуска"
                    @change="saveDatas()"
                    v-model="auto.year">
                  <el-option v-for="item in years" :key="item" :label="item" :value="item"/>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Модификация</label>
              <el-form-item
                  prop="modification"
                  :rules="{required: true, message: 'Не выбрана модификация', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите модификацию"
                    @change="getComplectations(auto.modification)"
                    v-model="auto.modification">
                  <el-option v-for="item in modifications" :key="item.id" :label="item.name_short" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group">

              <label class="required">Пробег</label>
              <span style="float: right">км</span>
              <el-form-item
                  prop="mileageAuto"
                  :rules="{validator: checkMili, equired: true, message: 'Не выбран пробег', trigger: ['blur','change']}">
                <el-input v-model="auto.mileageAuto"
                          size="large"
                          clearable
                          @change="saveDatas()"
                          @input="()=>{auto.mileageAuto=numberWithSpaces(auto.mileageAuto)}"
                />
              </el-form-item>


              <el-slider
                  :show-tooltip="false"
                  v-model="mileageAuto1000"
                  style="max-width: 300px"
                  @input="auto.mileageAuto=numberWithSpaces(mileageAuto1000 * 10000)"/>

            </div>
          </div>


          <div class="form-row">
            <div class="form-group">
              <label class="required">Телефон</label>
              <el-form-item
                  prop="phone"
                  :rules="{required: true, message: 'Не выбран телефон', trigger: ['blur','change']}">
                <el-input placeholder="Телефон" title="Телефон"
                          size="large"
                          clearable
                          @change="saveDatas()"
                          :formatter="(value) =>value && formattingPhone(value, (val)=>auto.phone=val)"
                          v-model="auto.phone"/>
              </el-form-item>
            </div>

            <div class="form-group">
              <label>Email</label>

              <el-input placeholder="Email"
                        clearable
                        size="large"
                        @change="emailValidate(auto.email); saveDatas()"
                        title="Email" v-model="auto.email"/>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="required">Город</label>
              <el-form-item
                  prop="city"
                  :rules="{required: true, message: 'Не выбран город', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите город"
                    @change="saveDatas()"
                    v-model="auto.city">
                  <el-option v-for="item in cities" :key="item" :label="item" :value="item"/>
                </el-select>
              </el-form-item>


            </div>

            <div class="form-group">
              <label class="required">ФИО</label>
              <el-form-item
                  prop="person"
                  :rules="{required: true, message: 'Не выбрано имя', trigger: ['blur','change']}">
                <el-input
                    input-style="500px"
                    @change="saveDatas()"
                    size="large"
                    clearable
                    placeholder="Введите имя"
                    v-model="auto.person"
                />
              </el-form-item>
            </div>
          </div>

        </el-form>
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
import {ElMessage} from "element-plus";
import {saveUnSaved} from "@/utils/unsavedRequests";

const pubStore = usePubStore()
const auto = ref<{}>({brand: null, model: null, generation: null, year: null, mileageAuto: null})
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
const mileageAuto1000 = ref(null)
const formRef = ref()
const submitForm = (formEl:any) => formEl && formEl.validate((valid:boolean) => !valid)


function removeDatas() {
  localStorage.removeItem('datas')
  isDatas.value = null
  auto.value = {}
}

const vinRegex = new RegExp("^[A-HJ-NPR-Z\\d]{8}[\\dX][A-HJ-NPR-Z\\d]{2}\\d{6}$");
function checkVIN(rule: any, value: any, callback: any) {
  if (!value.match(vinRegex))callback('Ошибочный VIN')
  else if (value.length != 17) callback('Поле не заполнено')
  else callback()

}

function checkMili(rule: any, value: any, callback: any) {
  if (value < 1000) callback(true)
  else callback()
}

let timerSave:any = null;

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
  // заполняем созраненными данными
  Object.assign(auto.value, datas)
  if (auto.value.brand) getModels(auto.value.brand, true)
  if (auto.value.model) getGenerations(auto.value.model, true)
  if (auto.value.generation) getModifications(auto.value.generation, true)
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

function getModels(id: number, noClear) {
  // удалим связку
  if (!noClear) {
    auto.value.model = null
    auto.value.generation = null
    auto.value.modification = null
  }


  if (!id) return false

  isWaiting.value = true

  pubStore.getModels(id).then(res => {
    models.value = res.data
    isWaiting.value = false
    saveDatas()
  })
}

function getGenerations(id: number, noClear) {

  if (!noClear) {
    auto.value.generation = null
    auto.value.modification = null
  }
  if (!id) return false
  isWaiting.value = true
  pubStore.getGenerations(id).then(res => {
    generations.value = res.data
    isWaiting.value = false
    saveDatas()
  })
}

function getModifications(id: number, noClear) {

  if (!noClear) {
    auto.value.modification = null
  }
  if (!id) return false
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
    saveDatas()
    // modifications.value = res.data
  })
}


function nextPage() {

  submitForm(formRef.value).then((res:boolean) => { // проверка заполненности обязательных полей
    if (res) router.push('public2')
    else ElMessage({message: 'Не все обязательные поля заполнены', type: 'error'})
  })
}


</script>
