<template>
  <div class="frame_pub">
    <div class="container">
      <h1>Онлайн оценка вашего автомобиля</h1>

      <div class="form-section">
        <h2>По параметрам</h2>

        <form id="carEvaluationForm">
          <div class="form-row">
            <div class="form-group">
              <label for="brand" class="required">Марка</label>
              <select id="brand"
                      @change="changeBrand(obj.brand)"
                      v-model="obj.brand" required>
                <option value="0">Выберите марку</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="model" class="required">Модель</label>
              <select
                  @change="changeModel(obj.model)"
                  v-model="obj.model"
                  required :disabled="!models">
                <option value="0">Сначала выберите марку</option>
                <option v-for="mod in models" :key="mod.id" :value="mod.id">
                  {{ mod.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="generation" class="required">Поколение</label>
              <select
                  v-model="obj.generation"
                  id="generation" required :disabled="!generations">
                <option value="0">Выберите значение</option>
                <option v-for="generation in generations" :key="generation.id" :value="generation.id">
                  {{ generation.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="year" class="required">Год выпуска</label>
              <select id="year"
                      v-model="obj.year">
                <option value="0">Выберите год</option>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year}}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="bodyType" class="required">Тип кузова</label>
              <select id="bodyType" required>
                <option value="">Выберите тип кузова</option>
                <option value="sedan">Седан</option>
                <option value="hatchback">Хэтчбек</option>
                <option value="station_wagon">Универсал</option>
                <option value="suv">Внедорожник</option>
                <option value="coupe">Купе</option>
              </select>
            </div>

            <div class="form-group">
              <label for="modification" class="required">Модификация</label>
              <select id="modification" required>
                <option value="">Выберите модификацию</option>
                <option value="1.6_mt">1.6 MT (115 л.с.)</option>
                <option value="1.8_at">1.8 AT (140 л.с.)</option>
                <option value="2.0_mt">2.0 MT (150 л.с.)</option>
                <option value="2.0_at">2.0 AT (180 л.с.)</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="mileage" class="required">Пробег (км)</label>
              <input type="number" id="mileage" placeholder="Введите пробег" required/>
            </div>

            <div class="form-group">
              <label for="ptsType" class="required">Тип ПТС</label>
              <select id="ptsType" required>
                <option value="">Выберите тип ПТС</option>
                <option value="original">Оригинал</option>
                <option value="duplicate">Дубликат</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="owners" class="required">Владельцев по ПТС</label>
              <select id="owners" required>
                <option value="">Выберите количество</option>
                <option value="1">1 владелец</option>
                <option value="2">2 владельца</option>
                <option value="3">3 владельца</option>
                <option value="4">4 владельца</option>
                <option value="5">5 и более владельцев</option>
              </select>
            </div>

            <div class="form-group">
              <label for="city" class="required">Город</label>
              <input type="text" id="city" placeholder="Введите город" required/>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="fullName" class="required">ФИО</label>
              <input type="text" id="fullName" placeholder="Введите ФИО" required/>
            </div>
          </div>
        </form>
      </div>

      <div class="selected-options">
        <p>Выбрано:</p>
        <div id="selected-values">
          Марка × Модель × Поколение × Год × Тип кузова × Модификация × Пробег ×
        </div>
      </div>

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

      <div class="damage-map">
        <h2>Карта повреждений автомобиля</h2>
        <div></div>
        <div class="damage_block" id="damageMap">
          <div class="flex-grid">
            <!-- ngRepeat: (key, value) in allDamages -->
            <div class="flex-grid-1"  style="">
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

      <div class="buttons">
        <button type="button" class="btn btn-primary" onclick="submitForm()">
          Получить оценку
        </button>
        <button type="button" class="btn btn-secondary" onclick="resetForm()">Сбросить</button>
      </div>
    </div>

  </div>

</template>

<style scoped>

.frame_pub {
  font-family: 'Roboto', Arial, sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 10px;
  background: linear-gradient(135deg, #a7d5f9 0%, #020a2d 100%); /* Теплый градиент */
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

h2 {
  margin: 20px 0 15px;
  color: #3498db;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
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
  padding: 0 30px 0 20px ;
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

select {
  background-color: white;
}

.required::after {
  content: ' *';
  color: #e74c3c;
}

.selected-options {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  border-left: 4px solid #3498db;
}

.selected-options p {
  margin-bottom: 10px;
  font-weight: bold;
}

.photo-upload {
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 30px;
  text-align: center;
  margin: 20px 0;
  transition: all 0.3s;
}

.photo-upload:hover {
  border-color: #3498db;
  background-color: #f0f8ff;
}

.photo-upload p {
  margin-bottom: 15px;
  color: #666;
}

.upload-btn {
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #2980b9;
}

#file-list {
  margin-top: 15px;
  font-size: 14px;
  color: #666;
}

.file-list-preview {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.file-preview-item {
  position: relative;
  width: 100px;
  height: 100px;
}

.file-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.damage-map {
  text-align: center;
  margin: 30px 0;
}

.damage-map img {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #2ecc71;
  color: white;
}

.btn-primary:hover {
  background-color: #27ae60;
}

.btn-secondary {
  background-color: #e74c3c;
  color: white;
}

.btn-secondary:hover {
  background-color: #c0392b;
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

.damage_block {
  display: block;
}

.damage_block img {
  max-width: 290px;
}

</style>

<script setup lang="ts">
import {usePubStore} from "@/pages/pub/somefiles/pubStore.ts";
import {ref} from "vue";
import IMG_1 from "@/pages/pub/somefiles/images/IMG_1.vue";
import IMG_2 from "@/pages/pub/somefiles/images/IMG_2.vue";
import IMG_3 from "@/pages/pub/somefiles/images/IMG_3.vue";
const pubStore=usePubStore()
const obj = ref({brand:0, model:0, generation:0, year:null})
const brands = ref<[]>()
const models = ref<[]>()
const generations = ref<[]>()
const years = ref([])

let currentYear = new Date().getFullYear()
for (let year = currentYear; year >= 1980; year--) {
  years.value.push(year)
}

pubStore.getBrands().then(res=>brands.value = res.data)

function changeBrand(id) {
  pubStore.getModels(id).then(res=>{
    models.value = res.data
  })
}

function changeModel(id) {
  pubStore.getGenerations(id).then(res=>{
    generations.value = res.data
  })
}



</script>