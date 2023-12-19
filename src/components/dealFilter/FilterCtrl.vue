<template>
  <div class="deal-filters">
    <div>
      <span class="label">Дата соаздания</span>
      <el-date-picker placeholder="Выберите дату"
                      @change="changed"
                      format="DD-MM-YYYY"
                      v-model="vModel.createDate"/>
    </div>
    <div>
      <span class="label">Модель </span>
      <div class="filter-block">
        <el-select
            placeholder="Выберите бренд"
            v-model="vModel.carBrandId"
            @change="changeBrand"
            filterable
            clearable
        >
          <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
        <span style="white-space: nowrap">
           &nbsp; &nbsp; &nbsp; &nbsp;
          <el-select
              placeholder="Выберите модель"
              v-model="vModel.carModelId"
              @change="changed"
              filterable
              clearable
          >
            <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </span>
      </div>
    </div>

    <div>
      <span class="label">Год выпуска</span>
      <div class="filter-block">
        &nbsp; &nbsp; &nbsp; от
        <el-select
            @change="changed"
            placeholder="Выберите год"
            v-model="vModel.lowYearReleased"
            filterable
            clearable
        >
          <el-option v-for="item in years" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
        <span style="white-space: nowrap">
          &nbsp; &nbsp; &nbsp; до
          <el-select
              @change="changed"
              placeholder="Выберите год"
              v-model="vModel.highYearReleased"
              filterable
              clearable
          >
            <el-option
                v-for="item in years"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </span>
      </div>
    </div>
    <div>
      <span class="label">Обьем двигателя</span>
      <div class="filter-block">
        &nbsp; &nbsp; &nbsp; от
        <el-select
            placeholder="Выберите объем"
            v-model="vModel.lowEngineCapacity"
            @change="changed"
            filterable
            clearable
        >
          <el-option
              v-for="item in capacities"
              :key="item.name"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
        <span style="white-space: nowrap">
          &nbsp; &nbsp; &nbsp; до
          <el-select
              placeholder="Выберите объем"
              v-model="vModel.highEngineCapacity"
              @change="changed"
              filterable
              clearable
          >
            <el-option
                v-for="item in capacities"
                :key="item.name"
                :label="item.name"
                :value="item.name"
            />
          </el-select>
        </span>
      </div>
    </div>
    <div style="clear: both"></div>
    <div>
      <span class="label">Тип привода</span>
      <el-select
          placeholder="Выберите тип привода"
          v-model="vModel.driveType"
          @change="changed"
          filterable
          clearable
      >
        <el-option v-for="item in driveTypies" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>
    <div>
      <span class="label">Тип КПП</span>
      <el-select
          v-model="vModel.gearboxType"
          @change="changed"
          multiple
          placeholder="Выберите несколько типов"
      >
        <el-option v-for="item in kpp" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </div>
    <div>
      <span class="label">Город</span>
      <el-select
          placeholder="Выберите город"
          v-model="vModel.locationCity"
          @change="changed"
          filterable
          clearable
      >
        <el-option v-for="(item, ind) in cities" :key="ind" :label="item" :value="item"/>
      </el-select>
    </div>
    <div>
      <span class="label">Менеджер</span>
      <el-select
          placeholder="Выберите менеджера"
          v-model="vModel.manager"
          @change="changed"
          filterable
          clearable
      >
        <el-option v-for="item in manageres" :key="item.id" :label="item.title" :value="item.id"/>
      </el-select>
    </div>
    <div>
      <span class="label">Организация</span>
      <el-select
          placeholder="Выберите организацию"
          v-model="vModel.orgelement"
          @change="changed"
          filterable
          clearable
      >
        <el-option
            v-for="item in organizations"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </div>
    <div>
      <span class="label">Тип выкупа</span>
    </div>
    <div>
      <span class="label">Источник</span>
    </div>
    <div>
      <span class="label">Гос.номер</span>
      <!--      <el-input />-->
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {store} from './dealStore'
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const emit = defineEmits(['update:modelValue', 'changeFilter', 'getData'])
const vModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const props = defineProps(['modelValue'])
const globalStore = useGlobalStore()
const brands = ref([])
const models = ref([])
const years = ref([])
const capacities = ref([])
const driveTypies = [
  {id: 10, name: 'Передний привод'},
  {id: 20, name: 'Задний привод'},
  {id: 30, name: 'Полный привод'}
]
const kpp = [
  {id: 10, name: 'Механическая'},
  {id: 20, name: 'Автоматическая'},
  {id: 30, name: 'Вариатор'},
  {id: 40, name: 'Роботизированная'}
]
const cities = ref([])
const places = ref([])
const organizations = ref([])
const manageres = ref([])
const tags = ref([])

watch(store, function () {
  let params = store.tags.map(el => el.param)

  Object.keys(vModel.value).forEach(el => { // чистим контрол, если удалили тег
    if (!params.includes(el) && vModel.value[el]) vModel.value[el] = null
  })

  store.tags.forEach(el => { // добавляем
    if (el.name) vModel.value[el.param] = el.code
  })
})

function changeBrand(id) {
  vModel.value.carModelId = null
  globalStore.getModels(id).then((res) => (models.value = res))
  changed()
}

function changed() {
  // создаем кнопки
  tags.value = []
  Object.keys(vModel.value).forEach((param) => {
    let name = ''
    let key = vModel.value[param]
    if (!key) return false;

    switch (param) {
      case 'createDate':
        tags.value.push({param, name: formatDateDDMMYYYY(key), code: new Date(key)})
        break
      case 'carBrandId':
        var brand = brands.value.find((el) => el.id === key)
        name = brand && brand.name
        name && tags.value.push({param, name, code: brand.id})
        break
      case 'carModelId':
        var model = models.value.find((el) => el.id === key)
        name = model && model.name
        name && tags.value.push({param, name, code: model.id})
        break
      case 'lowYearReleased':
        tags.value.push({param, name: 'от ' + key, code: key})
        break
      case 'highYearReleased':
        tags.value.push({param, name: 'до ' + key, code: key})
        break
      case 'lowEngineCapacity':
        tags.value.push({param, name: 'объем от ' + key, code: key})
        break
      case 'highEngineCapacity':
        tags.value.push({param, name: 'объем до ' + key, code: key})
        break
      case 'driveType':
        name = driveTypies.find(el => el.id === key).name
        tags.value.push({param, name, code: key})
        break
      case 'gearboxType':
        name = Object.keys(key).reduce((sum, el) => {
          return sum + kpp.find(item => item.id === key[el]).name + '; '
        }, '')
        key.length && tags.value.push({param, name, code: key})
        break
      case 'locationCity':
        tags.value.push({param, name: 'г. ' + key, code: key})
        break
      case 'orgelement':
        name = organizations.value.find((el) => el.id === key).name
        name && tags.value.push({param, name: 'Организация: ' + name, code: key})
        break
      case 'manager':
        name = manageres.value.find((el) => el.id === key).title
        name && tags.value.push({param, name: 'Менеджер: ' + name, code: key})
        break
    }
  })
  store.tags = tags.value
}

function open() {
  if (brands.value.length) return false;
  for (let z = new Date().getFullYear(); z > 1939; z--) {
    years.value.push({name: z})
  }
  for (let z = 800; z <= 6000; z = z + 100) {
    capacities.value.push({name: z})
  }

  globalStore.getBrands().then(res => brands.value = res)
  globalStore.getOrganizations().then((res) => (organizations.value = res.items))
  globalStore.getRoles([20, 120]).then((res) => (manageres.value = res.items))
  globalStore.getPlaces().then((res) => {
    cities.value = res.citys
    places.value = res.items
  })

   if(vModel.value.carBrandId) {
     let id = vModel.value.carBrandId
     globalStore.getModels(id).then((res) => (models.value = res))
   }
}

defineExpose({open})
</script>