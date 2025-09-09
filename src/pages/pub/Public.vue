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
                  size="large"
                  placeholder="Введите VIN"
                  v-model="auto.vin"
                  maxlength="17"
                  minlength="17"
                  clearable
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Марка</label>
              <el-select
                  size="large"
                  placeholder="Выберите марку"
                  @change="getModels(auto.brand)"
                  v-model="auto.brand">
                <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label for="brand" class="required">Модель</label>
              <el-select
                  size="large"
                  placeholder="Выберите модель"
                  @change="getGenerations(auto.model)"
                  v-model="auto.model">
                <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label for="brand" class="required">Поколение</label>
              <el-select
                  size="large"
                  placeholder="Выберите поколение"
                  @change="getModifications(auto.generation)"
                  v-model="auto.generation">
                <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label for="brand" class="required">Год выпуска</label>
              <el-select
                  size="large"
                  placeholder="Выберите год выпуска"
                  @change="saveDatas()"
                  v-model="auto.year">
                <el-option v-for="item in years" :key="item" :label="item" :value="item"/>
              </el-select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label for="brand" class="required">Модификация</label>
              <el-select
                  size="large"
                  placeholder="Выберите модификацию"
                  @change="getComplectations(auto.modification)"
                  v-model="auto.modification">
                <el-option v-for="item in modifications" :key="item.id" :label="item.name_short" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label for="brand" class="required">Пробег</label>
              <el-input v-model="auto.mileageAuto"/>
              <span style="float: right">км</span>
              <el-slider
                  :show-tooltip="false"
                  v-model="auto.mileageAuto1000"
                  style="max-width: 300px"
                  @input="mili(auto.mileageAuto1000)"/>

            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {usePubStore} from "@/pages/pub/pubStore";

const pubStore = usePubStore()
const auto = ref<{}>({brand: null, model: null, generation: null, year: null, mileageAuto: 0})
const brands = ref<[]>()
const models = ref<[]>()
const generations = ref<[]>()
const modifications = ref<[]>()
const years = ref([])
const isWaiting = ref(true)
const isDatas = ref()

function removeDatas() {
  localStorage.removeItem('datas')
  isDatas.value = null
}

function saveDatas() {
  // локально запоминаем введенные данные
  let newDatas = {}
  Object.entries(auto.value).forEach(el => {
    if (el[1]) newDatas[el[0]] = el[1]
  })
  if (Object.keys(newDatas).length) {
    isDatas.value = true
    localStorage.setItem('datas', JSON.stringify(newDatas))
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

}



function mili(val: number) {
  auto.value.mileageAuto = val * 10000
}

let currentYear = new Date().getFullYear()
for (let year: number = currentYear; year >= 1980; year--) {
  years.value.push(year)
}

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


</script>

<style>

.frame_pub .fix-button {
  position: fixed;
  left: 5px;
  top: 5px;
  background: #f5f1dc;
  border: none;
  padding: 5px;
}

.frame_pub .waiter {
  width: 73px;
  position: fixed;
  pointer-events: none;
  z-index: 1000;
  left: calc(50% - 35px);
  top: 73px;
  transition: opacity .3s;
  opacity: 0;
}

.frame_pub .waiter.showwaiter {
  opacity: 1;
}

.frame_pub {
  font-family: 'Roboto', Arial, sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 10px;
  background: linear-gradient(135deg, #a7d5f9 0%, #020a2d 100%); /* Теплый градиент */
  background: linear-gradient(135deg, #f5f1dc 0%, #e9d202 100%); /* Теплый градиент */
  /*background: linear-gradient(135deg, #fcc4c4 0%, #880202 100%); !* Теплый градиент *!*/

}

.frame_pub .container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.frame_pub h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.frame_pub .form-section {
  margin-bottom: 25px;
}

.frame_pub .form-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px 15px;
}

.frame_pub .form-group {
  flex: 1 0 0;
  padding: 0 30px 0 20px;
  margin-bottom: 15px;
}

.frame_pub label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.frame_pub .required::after {
  content: ' *';
  color: #e74c3c;
}

@media (max-width: 600px) {
  .frame_pub .form-group {
    flex: 1 0 50%;
  }

  .frame_pub .el-input__inner {
    max-width: inherit;
  }

  /*.frame_pub .buttons {*/
  /*  flex-direction: column;*/
  /*}*/
  /*.frame_pub .btn {*/
  /*  width: 100%;*/
  /*}*/


}
</style>