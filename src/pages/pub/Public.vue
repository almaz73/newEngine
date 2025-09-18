<template>
  <div class="frame_pub">
    <button class="install-btn" style="" id="installBtn">Открыть в приложении</button>
    <div id="offline-text">
      Нет подключения к интернету.
    </div>
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
                    trigger: ['blur']}]">
                <el-input
                    @change="auto.vin.length>16 && datasSaved()"
                    size="large"
                    onfocus="this.select()"
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
                  :rules="{required: true, message: 'Не выбрана марка автомобиля', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    filterable
                    placeholder="Выберите марку"
                    @change="getModels(auto.brandId, false)"
                    v-model="auto.brandId">
                  <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group" v-if="models && models.length">

              <label class="required">Модель</label>
              <el-form-item
                  prop="modelId"
                  :rules="{required: true, message: 'Не выбрана модель', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    filterable
                    placeholder="Выберите модель"
                    @change="getGenerations(auto.modelId, false)"
                    v-model="auto.modelId">
                  <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group" v-if="generations && generations.length">

              <label class="required">Поколение</label>
              <el-form-item
                  prop="generationId"
                  :rules="{required: true, message: 'Не выбрано поколение модели', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    @change="setYears(auto.generationId, false)"
                    placeholder="Выберите поколение"
                    v-model="auto.generationId">
                  <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
                </el-select>
              </el-form-item>
            </div>

            <div class="form-group" v-if="years && years.length">
              <label class="required">Год выпуска</label>
              <el-form-item
                  prop="yearReleased"
                  :rules="{required: true, message: 'Не выбран год выпуска', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите год выпуска"
                    @change="getModifications(auto.generationId, false)"
                    v-model="auto.yearReleased">
                  <el-option v-for="item in years" :key="item" :label="item" :value="item"/>
                </el-select>
              </el-form-item>

            </div>
          </div>

          <div class="form-row">
            <div class="form-group" v-if="modifications && modifications.length">

              <label class="required">Модификация</label>
              <el-form-item
                  prop="modificationId"
                  :rules="{required: true, message: 'Не выбрана модификация модели', trigger: ['blur','change']}">
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

            <div class="form-group" style="max-width: 360px">

              <label class="required">Пробег</label>
              <span style="float: right">км</span>
              <el-form-item
                  prop="mileage"
                  :rules="{validator: checkMili, equired: true, message: 'Не выбран Пробег', trigger: ['blur','change']}">
                <el-input v-model="auto.mileage"
                          size="large"
                          clearable
                          @change="datasSaved()"
                          @input="()=>{changeMiles();auto.mileage=numberWithSpaces(auto.mileage)}"
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
              <label class="required">Количество владельцев по ПТС</label>
              <el-form-item
                  prop="countHostsByVC"
                  :rules="{required: true, message: 'Не заполнено количество владельцев', trigger: ['blur','change']}">
                <el-input-number
                    size="large"
                    class="nowidth"
                    v-model="auto.countHostsByVC" :min="1" :max="20" @change="datasSaved()"/>
              </el-form-item>
            </div>

            <div class="form-group">
              <label class="required">Описание повреждений</label>
              <el-form-item
                  title="Указываются ранее крашенные элементы, все текущие повреждения (узлы, агрегаты, жестянка)"
                  prop="comment"
                  :rules="{required: true, message: 'Укажите ранее крашенные элементы, все текущие повреждения (узлы, агрегаты, жестянка)', trigger: ['blur','change']}">
                <el-input class="textarea_field" type="textarea" size="large" v-model="auto.comment"
                          placeholder="Укажите  повреждения"/>
              </el-form-item>
            </div>
          </div>


          <div class="form-row">
            <div class="form-group">
              <label class="required">Телефон</label>
              <el-form-item
                  prop="phone"
                  :rules="{required: true, message: 'Не выбран Телефон', trigger: ['blur','change']}">
                <el-input placeholder="Телефон" title="Телефон"
                          size="large"
                          clearable
                          @change="datasSaved()"
                          :formatter="(value) =>value && formattingPhone(value, (val)=>auto.phone=val)"
                          v-model="auto.phone"/>
              </el-form-item>
            </div>

            <div class="form-group">
              <label>Email</label>

              <el-input placeholder="Email"
                        clearable
                        size="large"
                        @change="emailValidate(auto.email); datasSaved()"
                        title="Email" v-model="auto.email"/>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="required">Город</label>
              <el-form-item
                  prop="city"
                  :rules="{required: true, message: 'Не выбран Город', trigger: ['blur','change']}">
                <el-select
                    size="large"
                    clearable
                    placeholder="Выберите город"
                    @change="datasSaved()"
                    v-model="auto.city">
                  <el-option v-for="item in cities" :key="item" :label="item" :value="item"/>
                </el-select>
              </el-form-item>


            </div>

            <div class="form-group">
              <label class="required">ФИО</label>
              <el-form-item
                  prop="fullName"
                  :rules="{required: true, message: 'Не выбрано Имя', trigger: ['blur','change']}">
                <el-input
                    input-style="500px"
                    @change="datasSaved()"
                    size="large"
                    clearable
                    placeholder="Введите имя"
                    v-model="auto.fullName"
                />
              </el-form-item>
            </div>
          </div>

        </el-form>
        <div style="text-align: center">
          <el-button size="large" class="el-message__content" @click="removeDatas()">
            &nbsp; Очистить &nbsp;
          </el-button>
          <el-button type="primary" size="large" @click="nextPage()">
            Сохранить
          </el-button>

          <br><br>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import '@/pages/pub/script__pub_sw.js'
import {usePubStore} from "@/pages/pub/somefiles/pubStore.ts";
import {
  checkEmptyFields,
  checkVIN,
  emailValidate,
  formattingPhone,
  numberNoSpace,
  numberWithSpaces,
  simplePhone
} from "@/pages/pub/somefiles/GlobFuntions.ts";
import '@/pages/pub/somefiles/style.css'
import router from "@/router";
import {ElMessage, ElMessageBox} from "element-plus";

interface ICar {
  id: number,
  name: string,
  name_short: string,
  engineType: number,
  driveType: number,
  mileage: number,
  phone: string,
  gearboxType: number,
  bodyType: number,
  enginePower: number,
  engineCapacity: number,
  doorsCount: number,
  countHostsByVC: number
}

interface IAuto {
  vin: string,
  countHostsByVC: number,
  fullName: string,
  brandId: number,
  modelId: number,
  generationId: number,
  yearReleased: number,
  mileage: number,
  modificationId: number,
  phone: string,
  email: string,
  city: string,
  comment: string

}

const pubStore = usePubStore()
const auto = ref<IAuto>({})
const brands = ref<[{ id: number, name: string }]>()
const models = ref<[{ id: number, name: string }]>()
const generations = ref<[{ id: number, name: string }]>()
const modifications = ref<[ICar]>()
let years = ref([])
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
const resetForm = (formEl: any) => formEl && formEl.resetFields()


function removeDatas() {
  ElMessageBox.confirm('Вы действительно хотите удалить?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then(() => remove())
}

function remove() {
  localStorage.removeItem('datas')
  isDatas.value = null
  auto.value = {}
  resetForm(formRef.value)
  models.value = []
  generations.value = []
  modifications.value = []
  years.value = []
}


function checkMili(rule: any, value: any, callback: any) {
  if (!value || value < 10) callback('Не реальный пробег')

  else callback()
}

let timerSave: any = null;

function datasSaved() {
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
  auto.value = {}

  console.log('datas = ', datas)

  console.log('auto.value = ', auto.value)

  Object.assign(auto.value, datas)
  if (auto.value.brandId) getModels(auto.value.brandId, true)
  if (auto.value.modelId) getGenerations(auto.value.modelId, true)
  if (auto.value.generationId) getModifications(auto.value.generationId, true)
  if (auto.value.mileage) mileage1000.value = numberNoSpace(auto.value.mileage) / 1000

  auto.value.email = auto.value.email || ''
}

let currentYear = new Date().getFullYear()


isWaiting.value = true
pubStore.getBrands().then(res => {
  brands.value = res.data
  isWaiting.value = false
})

function getModels(id: number, noClear: boolean | null) {
  // удалим связку
  if (!noClear) {
    auto.value.modelId = null
    auto.value.generationId = null
    auto.value.modificationId = null
    auto.value.yearReleased = null

    models.value = []
    generations.value = []
    modifications.value = []
    years.value = []
  }


  if (!id) return false

  isWaiting.value = true

  pubStore.getModels(id).then(res => {
    models.value = res.data
    isWaiting.value = false
    datasSaved()
  })
}

function setYears(id, noClear: boolean | null) {
  if (!noClear) {
    auto.value.yearReleased = null
    auto.value.modificationId = null
    modifications.value = []
  }


  let item = generations.value?.find(el => el.id === id)

  years.value = []
  if (!item) return false

  for (let year: number = item.yearTo; year >= item.yearFrom; year--) {
    years.value.push(year)
  }
}

function getGenerations(id: number, noClear) {
  if (!noClear) {
    auto.value.generationId = null
    auto.value.modificationId = null
    auto.value.yearReleased = null
    generations.value = []
    modifications.value = []
  }
  if (!id) return false
  isWaiting.value = true
  pubStore.getGenerations(id).then(res => {
    generations.value = res.data
    isWaiting.value = false
    if (auto.value.generationId) setYears(auto.value.generationId, true)
    datasSaved()
  })
}

function getModifications(id: number, noClear) {

  if (!id) return false

  setYears(id, true)
  isWaiting.value = true
  pubStore.getModifications(id).then(res => {
    modifications.value = res.data
    modifications.value = res.data.map(el => {
      el.name_short = el.name.split('\n')[0] + ' (' + el.engineTypeName + ')'
      return el
    })
    datasSaved()
    isWaiting.value = false
  })
}

function getComplectations(id: number) {
  pubStore.getComplectations(id).then(res => {
    datasSaved()
  })
}


function nextPage() {
  checkEmptyFields(formRef.value).then((res: boolean) => { // проверка заполненности обязательных полей
    if (res) save()
  })
}


function changeMiles() {
  if (auto.value.mileage) mileage1000.value = numberNoSpace(auto.value.mileage) / 1000
}
function save() {
  let car: ICar = modifications.value.find((el: any) => el.modificationId = auto.value.modificationId)

  let newAuto: ICar = JSON.parse(JSON.stringify(auto.value))
  newAuto.mileage = numberNoSpace(newAuto.mileage)
  if (typeof newAuto.mileage !== 'number') newAuto.mileage = null
  newAuto.phone = simplePhone(newAuto.phone)
  newAuto.engineType = car.engineType
  newAuto.driveType = car.driveType
  newAuto.gearboxType = car.gearboxType
  newAuto.bodyType = car.bodyType
  newAuto.enginePower = car.enginePower
  newAuto.engineCapacity = car.engineCapacity
  newAuto.doorsCount = car.doorsCount
  if (!newAuto.email) delete newAuto.email

  isWaiting.value = true
  pubStore.saveExternalAppeal(newAuto).then(res => {
    isWaiting.value = false
    if (res.status === 200) {
      ElMessage({message: 'Запрос на оценку успешно отправлен, после оценки с Вами свяжется сотрудник компании Автосеть.РФ', type: 'success', duration: 10000})
      remove()
      router.push('public2')
    }
  })

}


</script>
