<template>
  <div class="frame_pub">
    <div class="container">
      <div style="margin: auto; width: 243px"><img src="@/pages/pub/images/logo.png"></div>
      <h1>Онлайн оценка вашего автомобиля</h1>

      <div class="form-section">
        <form id="carEvaluationForm">
          <div class="form-row">
            <div class="form-group">
              <label class="required">VIN номер</label>
              <el-input size="large" v-model="auto.vin" placeholder="Введите VIN"/>
             </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label class="required">Марка</label>
              <el-select
                  size="large"
                  placeholder="Выберите марку"
                  @change="getModels(obj.brand)"
                  v-model="auto.brand">
                <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label for="brand" class="required">Модель</label>
              <el-select
                  id="brand"
                  size="large"
                  placeholder="Выберите модель"
                  @change="getGenerations(obj.model)"
                  v-model="auto.model">
                <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label for="brand" class="required">Поколение</label>
              <el-select
                  id="brand"
                  size="large"
                  placeholder="Выберите поколение"
                  v-model="auto.generation">
                <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label for="brand" class="required">Год выпуска</label>
              <el-select
                  id="brand"
                  size="large"
                  placeholder="Выберите год выпуска"
                  v-model="auto.year">
                <el-option v-for="item in years" :key="item" :label="item" :value="item"/>
              </el-select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">

              <label for="brand" class="required">Модификация</label>
              <el-select
                  id="brand"
                  size="large"
                  placeholder="Выберите поколение"
                  v-model="auto.generation">
                <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </div>

            <div class="form-group">

              <label for="brand" class="required">Пробег</label>
              <el-select
                  id="brand"
                  size="large"
                  placeholder="Выберите поколение"
                  v-model="auto.generation">
                <el-option v-for="item in generations" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
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
const auto = ref<{}>({brand: null, model: null, generation: null, year: null})
const brands = ref<[]>()
const models = ref<[]>()
const generations = ref<[]>()
const years = ref([])

let currentYear = new Date().getFullYear()
for (let year:number = currentYear; year >= 1980; year--) {
  years.value.push(year)
}

pubStore.getBrands().then(res => brands.value = res.data)

function getModels(id:number) {
  pubStore.getModels(id).then(res => {
    models.value = res.data
  })
}

function getGenerations(id:number) {
  pubStore.getGenerations(id).then(res => {
    generations.value = res.data
  })
}

</script>

<style scoped>
.frame_pub {
  font-family: 'Roboto', Arial, sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 10px;
  background: linear-gradient(135deg, #a7d5f9 0%, #020a2d 100%); /* Теплый градиент */
  /*background: linear-gradient(135deg, #fcc4c4 0%, #880202 100%); !* Теплый градиент *!*/
  margin: 1px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.form-section {
  margin-bottom: 25px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px 15px;
}

.form-group {
  flex: 1 0 0;
  padding: 0 30px 0 20px;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.required::after {
  content: ' *';
  color: #e74c3c;
}

@media (max-width: 600px) {
  .form-group {
    flex: 1 0 50%;
  }

  .buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>