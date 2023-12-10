<template>
  <div class="deal-filters">
    <div>
      <label>Дата соаздания</label>
      <el-date-picker v-model="value.createDate" />
    </div>
    <div>
      <label style="">Модель </label>
      <div class="filter-block">
        <el-select
          placeholder="Бренд"
          v-model="value.brand"
          @change="changeBrand"
          filterable
          clearable
        >
          <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select placeholder="Модель" v-model="value.model" filterable clearable>
          <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
    </div>

    <div>
      <label>Год выпуска</label>
      <div class="filter-block">
        &nbsp; &nbsp; &nbsp; от
        <el-select placeholder="год" v-model="value.lowYearReleased" filterable clearable>
          <el-option v-for="item in years" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
        <span style="white-space: nowrap">
          &nbsp; &nbsp; &nbsp; до
          <el-select placeholder="год" v-model="value.highYearReleased" filterable clearable>
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
        <el-select placeholder="объем" v-model="value.lowEngineCapacity" filterable clearable>
          <el-option
            v-for="item in capacities"
            :key="item.name"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
        <span style="white-space: nowrap">
          &nbsp; &nbsp; &nbsp; до
          <el-select placeholder="объем" v-model="value.highEngineCapacity" filterable clearable>
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
      <el-select placeholder="выберите значение" v-model="value.driveType" filterable clearable>
        <el-option v-for="item in driveTypies" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div>
      <label>Тип КПП</label>
      <el-select v-model="value.gearboxType" multiple placeholder="Выберите несколько значений">
        <el-option v-for="item in kpp" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <div>
      <label>Город</label>
      <el-select placeholder="выберите значение" v-model="value.locationCity" filterable clearable>
        <el-option v-for="(item, ind) in cities" :key="ind" :label="item" :value="item" />
      </el-select>
    </div>
    <div>
      <label>Менеджер</label>
      <el-select placeholder="выберите значение" v-model="value.manager" filterable clearable>
        <el-option v-for="item in manageres" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
    </div>
    <div>
      <label>Организация</label>
      <el-select placeholder="выберите значение" v-model="value.orgelement" filterable clearable>
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

const value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const globalStore = useGlobalStore()
const brands = ref([])
const models = ref([])
const years = []
const capacities = []
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
  value.model = null
  globalStore.getModels(id).then((res) => (models.value = res))
}

for (let z = new Date().getFullYear(); z > 1930; z--) {
  years.push({ name: z })
}
for (let z = 800; z <= 6000; z = z + 100) {
  capacities.push({ name: z })
}

globalStore.getBrands().then((res) => (brands.value = res))
globalStore.getOrganizations().then((res) => (organizations.value = res.items))
globalStore.getRoles([20, 120]).then((res) => manageres.value = res.items )
globalStore.getPlaces().then((res) => {
  cities.value = res.citys
  places.value = res.items
})

</script>