<template>
  <div class="deal-filters">
    <div>
      <label>Дата соаздания</label>
      <el-date-picker @change="changed" placeholder="Выберите дату" v-model="vModel.createDate" />
    </div>
    <div>
      <label style="">Модель </label>
      <div class="filter-block">
        <el-select
          placeholder="Выберите бренд"
          v-model="vModel.carBrandId"
          @change="changeBrand"
          filterable
          clearable
        >
          <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        &nbsp; &nbsp;
        <el-select
          @change="changed"
          placeholder="Выберите модель"
          v-model="vModel.carModelId"
          filterable
          clearable
        >
          <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
    </div>

    <div>
      <label>Год выпуска</label>
      <div class="filter-block">
        &nbsp; &nbsp; &nbsp; от
        <el-select
          @change="changed"
          placeholder="Выберите год"
          v-model="vModel.lowYearReleased"
          filterable
          clearable
        >
          <el-option v-for="item in years" :key="item.name" :label="item.name" :value="item.name" />
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
      <label>Обьем двигателя</label>
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
      <label>Тип привода</label>
      <el-select
        placeholder="Выберите тип привода"
        v-model="vModel.driveType"
        @change="changed"
        filterable
        clearable
      >
        <el-option v-for="item in driveTypies" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div>
      <label>Тип КПП</label>
      <el-select
        v-model="vModel.gearboxType"
        @change="changed"
        multiple
        placeholder="Выберите несколько типов"
      >
        <el-option v-for="item in kpp" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div>
      <label>Город</label>
      <el-select
        placeholder="Выберите город"
        v-model="vModel.locationCity"
        @change="changed"
        filterable
        clearable
      >
        <el-option v-for="(item, ind) in cities" :key="ind" :label="item" :value="item" />
      </el-select>
    </div>
    <div>
      <label>Менеджер</label>
      <el-select
        placeholder="Выберите менеджера"
        v-model="vModel.manager"
        @change="changed"
        filterable
        clearable
      >
        <el-option v-for="item in manageres" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </div>
    <div>
      <label>Организация</label>
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
      <label>Тип выкупа</label>
    </div>
    <div>
      <label>Источник</label>
    </div>
    <div>
      <label>Гос.номер</label>
      <!--      <el-input />-->
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { formatDateDDMMYYYY } from '@/utils/globalFunctions'

const emit = defineEmits(['update:modelValue', 'changeFilter'])
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
  { id: 10, name: 'Передний привод' },
  { id: 20, name: 'Задний привод' },
  { id: 30, name: 'Полный привод' }
]
const kpp = [
  { id: 10, name: 'Механическая' },
  { id: 20, name: 'Автоматическая' },
  { id: 30, name: 'Вариатор' },
  { id: 40, name: 'Роботизированная' }
]
const cities = ref([])
const places = ref([])
const organizations = ref([])
const manageres = ref([])

function changeBrand(id) {
  vModel.model = null
  globalStore.getModels(id).then((res) => (models.value = res))
  changed()
}

function changed() {
  // создаем кнопки
  // console.log('organizations', organizations.value)
  let tags = []
  Object.keys(vModel.value).forEach((word) => {
    let key = vModel.value[word]
    let name
    switch (word) {
      case 'createDate':
        key && tags.push({ word, name: formatDateDDMMYYYY(key) })
        break
      case 'carBrandId':
        name = brands.value.find((el) => el.id === key).name
        name && tags.push({ word, name: name })
        break
      case 'carModelId':
        name = key && models.value.find((el) => el.id === key).name
        name && tags.push({ word, name: name })
        break
      case 'lowYearReleased':
        key && tags.push({ word, name: 'от ' + key })
        break
      case 'highYearReleased':
        key && tags.push({ word, name: 'до ' + key })
        break
      case 'lowEngineCapacity':
        key && tags.push({ word, name: 'объем от ' + key })
        break
      case 'highEngineCapacity':
        key && tags.push({ word, name: 'объем до ' + key })
        break
      case 'driveType':
        key && tags.push({ word, name: 'ссс ' + key })
        break
      case 'gearboxType':
        key && tags.push({ word, name: 'до ' + key })
        break
      case 'locationCity':
        key && tags.push({ word, name: 'г. ' + key })
        break
      case 'orgelement':
        name = key && organizations.value.find((el) => el.id === key).name
        name && tags.push({ word, name: 'Организация: ' + name })
        break
      case 'manager':
        name = key && manageres.value.find((el) => el.id === key).title
        name && tags.push({ word, name: 'Менеджер: ' + name })
        break
    }
  })

  emit('changeFilter', tags)
}

function open() {
  for (let z = new Date().getFullYear(); z > 1930; z--) {
    years.value.push({ name: z })
  }
  for (let z = 800; z <= 6000; z = z + 100) {
    capacities.value.push({ name: z })
  }
  globalStore.getBrands().then((res) => (brands.value = res))
  globalStore.getOrganizations().then((res) => (organizations.value = res.items))
  globalStore.getRoles([20, 120]).then((res) => (manageres.value = res.items))
  globalStore.getPlaces().then((res) => {
    cities.value = res.citys
    places.value = res.items
  })
}

defineExpose({ open })
</script>