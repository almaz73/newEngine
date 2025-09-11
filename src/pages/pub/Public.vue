<template>
  <div class="frame_pub">
    <div class="container">
      <img src="@/assets/img/loading.gif" alt=""
           :class="{showwaiter:isWaiting}" class="waiter"
      />
      <div style="margin: auto; width: 243px"><img src="@/pages/pub/somefiles/images/logo.png"></div>
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
                  prop="brandId"
                  :rules="{required: true, message: 'Не выбрана марка', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите марку"
                    @change="getModels(auto.brandId)"
                    v-model="auto.brandId">
                  <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group">

              <label class="required">Модель</label>
              <el-form-item
                  prop="modelId"
                  :rules="{required: true, message: 'Не выбрана модель', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите модель"
                    @change="getGenerations(auto.modelId)"
                    v-model="auto.modelId">
                  <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Поколение</label>
              <el-form-item
                  prop="generationId"
                  :rules="{required: true, message: 'Не выбрано поколение', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите поколение"
                    @change="getModifications(auto.generationId)"
                    v-model="auto.generationId">
                  <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group">

              <label class="required">Год выпуска</label>
              <el-form-item
                  prop="yearReleased"
                  :rules="{required: true, message: 'Не выбран год выпуска', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите год выпуска"
                    @change="saveDatas()"
                    v-model="auto.yearReleased">
                  <el-option v-for="item in years" :key="item" :label="item" :value="item"/>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Модификация</label>
              <el-form-item
                  prop="modificationId"
                  :rules="{required: true, message: 'Не выбрана модификация', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите модификацию"
                    @change="getComplectations(auto.modificationId)"
                    v-model="auto.modificationId">
                  <el-option v-for="item in modifications" :key="item.id" :label="item.name_short" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group">

              <label class="required">Пробег</label>
              <span style="float: right">км</span>
              <el-form-item
                  prop="mileage"
                  :rules="{validator: checkMili, equired: true, message: 'Не выбран пробег', trigger: ['blur','change']}">
                <el-input v-model="auto.mileage"
                          size="large"
                          clearable
                          @change="saveDatas()"
                          @input="()=>{auto.mileage=numberWithSpaces(auto.mileage)}"
                />
              </el-form-item>


              <el-slider
                  :show-tooltip="false"
                  v-model="mileage1000"
                  style="max-width: 300px"
                  @input="auto.mileage=numberWithSpaces(mileage1000 * 5000)"/>

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
          <el-button type="primary" size="large" @click="save()">
            Сохранить
          </el-button>
          <br>  <br>

          <el-button size="large" @click="removeDatas()">
            Очистить
          </el-button>
          <el-button type="primary" size="large" @click="nextPage()">
            Добавить фото ▷
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {usePubStore} from "@/pages/pub/somefiles/pubStore.ts";
import {formattingPhone, numberWithSpaces, numberNoSpace, emailValidate, simplePhone} from "@/pages/pub/GlobFuntions";
import '@/pages/pub/somefiles/style.css'
import router from "@/router";
import {ElMessage, ElMessageBox} from "element-plus";

const pubStore = usePubStore()
const auto = ref<{
  brandId:number,
  modelId: number,
  generationId: number,
  yearReleased: number,
  mileage: number
}>({})
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
const mileage1000 = ref(null)
const formRef = ref()
const submitForm = (formEl:any) => formEl && formEl.validate((valid:boolean) => !valid)


function removeDatas() {
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then(() => {
        localStorage.removeItem('datas')
        isDatas.value = null
        auto.value = {}
      })
}

// const vinRegex = new RegExp("^[A-HJ-NPR-Z\\d]{8}[\\dX][A-HJ-NPR-Z\\d]{2}\\d{6}$");
const vinRegex = new RegExp("^[A-HJ-NPR-Z\\d]{13}\\d{4}$", "i");
function checkVIN(rule: any, value: any, callback: any) {
  if (!value.match(vinRegex))callback('Ошибочный VIN')
  else if (value.length != 17) callback('Поле не заполнено')
  else callback()

}

function checkMili(rule: any, value: any, callback: any) {
  if (!value || value < 1000) callback('Не реальный пробег')
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
  if (auto.value.brandId) getModels(auto.value.brandId, true)
  if (auto.value.modelId) getGenerations(auto.value.modelId, true)
  if (auto.value.generationId) getModifications(auto.value.generationId, true)
  if (auto.value.modificationId) getComplectations(auto.value.modificationId)
  if (auto.value.mileage) mileage1000.value = numberNoSpace(auto.value.mileage) / 1000

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
    auto.value.modelId = null
    auto.value.generationId = null
    auto.value.modificationId = null
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
    auto.value.generationId = null
    auto.value.modificationId = null
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
    auto.value.modificationId = null
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


function save() {

  console.log('auto.value = ', auto.value)

  let newAuto = JSON.parse(JSON.stringify(auto.value))

  newAuto.mileage = numberNoSpace(newAuto.mileage)
  newAuto.phone = simplePhone(newAuto.phone)

  console.log('newAuto= ',newAuto)


  let primer = {
    "vin": "string",
      "modelId": 0,
      "generationId": 0,
      "modificationId": 0,
      "yearReleased": 0,
      "mileage": 0,
      "countHostsByVC": 0,
      "engineType": 10,
      "driveType": 10,
      "gearboxType": 10,
      "bodyType": 1,
      "enginePower": 0,
      "engineCapacity": 0,
      "doorsCount": 0,
      "comment": "string",
      "city": "string",
      "fullName": "string",
      "phone": "string",
      "email": "user@example.com"
  }
}

//generationId, model, modification,year, 


</script>
