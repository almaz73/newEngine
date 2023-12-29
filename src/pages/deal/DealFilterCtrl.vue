<template>
  <div class="deal-filters">
    <a @click="isMoreFilter=!isMoreFilter">Дополнительный фильтер </a>
    <!--    Скрытая часть-->
    <div class="more-filter" :class="{open:isMoreFilter}">
      <div style="min-height: 0; overflow: hidden">
        <div>
          <span class="label">Пробег, км</span>
          <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'116px':''}">
            &nbsp; от
            <el-input v-model="vModel.lowMileage"
                      @change="changed"
                      type="number"
                      placeholder="Введите пробег"
                      clearable
                      @key.enter="changed"/>
          </span>
          <br v-if="globalStore.isMobileView">
          <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'114px':''}">
            &nbsp; до
            <el-input v-model="vModel.highMileage"
                      @change="changed"
                      type="number"
                      placeholder="Введите пробег"
                      clearable
                      @key.enter="changed"/>
          </span>
        </div>

        <div>
          <span class="label">Мощность двигателя</span>
          <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'116px':''}">
            &nbsp; от
            <el-input v-model="vModel.lowEnginePowerHP"
                      @change="changed"
                      type="number"
                      placeholder="Введите мощность"
                      clearable
                      @key.enter="changed"/>
          </span>
          <br v-if="globalStore.isMobileView">
          <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'114px':''}">
            &nbsp; до
            <el-input v-model="vModel.highEnginePowerHP"
                      @change="changed"
                      type="number"
                      placeholder="Введите мощность"
                      clearable
                      @key.enter="changed"/>
          </span>
        </div>


        <div>
          <span class="label">Тип кузова</span>
          <el-select
              placeholder="Выберите тип кузова"
              v-model="vModel.bodyType"
              @change="changed"
              filterable
              clearable>
            <el-option
                v-for="item in bodyTypes"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </div>
        <div>
          <span class="label">Цвет кузова</span>
          <el-select
              placeholder="Выберите цвет кузова"
              v-model="vModel.bodyColorId"
              @change="changed"
              filterable
              clearable>
            <el-option v-for="item in colors" :key="item.id" :label="item.colorName" :value="item.id"/>
          </el-select>
        </div>


        <div>
          <span class="label">Период оценок</span>
          <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'116px':''}">
            &nbsp; от
            <el-date-picker placeholder="Выберите дату"
                            @change="changed"
                            format="DD-MM-YYYY"
                            v-model="vModel.lowCreateDatePeriod"/>
          </span>
          <br v-if="globalStore.isMobileView">
          <span style="white-space: nowrap" :style="{margin:globalStore.isMobileView?'105px':''}">
            &nbsp; &nbsp; до
            <el-date-picker placeholder="Выберите дату"
                            @change="changed"
                            format="DD-MM-YYYY"
                            v-model="vModel.highCreateDatePeriod"/>
         </span>
        </div>

        <div>
          <span class="label">Местонахождение</span>
          <el-select
              placeholder="Выберите место"
              v-model="vModel.locationId"
              @change="changed"
              filterable
              clearable>
            <el-option v-for="item in places" :key="item.id"
                       :label="item.title + '  - ('+item.city+' '+item.typeTitle+')'" :value="item.id"/>
          </el-select>
        </div>
        <div>
          <span class="label">Статус</span>
          <el-select
              placeholder="Выберите статус"
              v-model="vModel.DealStatus"
              @change="changed"
              filterable
              clearable>
            <el-option v-for="item in statuses" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>
      </div>
    </div>
    <!--    Конец скрытой части-->

    <FilterFieldsCtrl @changed="changed"
                      :vModel="vModel"
                      :fields="fields"
                      :models="models"
                      :brands="brands"
                      :cities="cities"
                      :places="places"
                      :years="years"
    />

    <br><br>===========================================
<!--        <div>-->
<!--          <span class="label">Дата создания</span>-->
<!--          <el-date-picker placeholder="Выберите дату"-->
<!--                          @change="changed"-->
<!--                          format="DD-MM-YYYY"-->
<!--                          v-model="vModel.createDate"/>-->
<!--        </div>-->
<!--        <div>-->
<!--          <span class="label">Модель </span>-->
<!--          <div class="filter-block">-->
<!--            <el-select-->
<!--                placeholder="Выберите бренд"-->
<!--                v-model="vModel.carBrandId"-->
<!--                @change="changeBrand"-->
<!--                filterable-->
<!--                clearable-->
<!--            >-->
<!--              <el-option v-for="item in brands" :key="item.id" :label="item.name" :value="item.id"/>-->
<!--            </el-select>-->
<!--            <span style="white-space: nowrap">-->
<!--               &nbsp; &nbsp; &nbsp; &nbsp;-->
<!--              <el-select-->
<!--                  placeholder="Выберите модель"-->
<!--                  v-model="vModel.carModelId"-->
<!--                  @change="changed"-->
<!--                  filterable-->
<!--                  clearable-->
<!--              >-->
<!--                <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>-->
<!--              </el-select>-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->

<!--    <div>-->
<!--      <span class="label">Год выпуска</span>-->
<!--      <div class="filter-block">-->
<!--        &nbsp; от-->
<!--        <el-select-->
<!--            @change="changed"-->
<!--            placeholder="Выберите год"-->
<!--            v-model="vModel.lowYearReleased"-->
<!--            filterable-->
<!--            clearable-->
<!--        >-->
<!--          <el-option v-for="item in years" :key="item.name" :label="item.name" :value="item.name"/>-->
<!--        </el-select>-->
<!--        <span style="white-space: nowrap">-->
<!--          &nbsp; &nbsp; &nbsp; до-->
<!--          <el-select-->
<!--              @change="changed"-->
<!--              placeholder="Выберите год"-->
<!--              v-model="vModel.highYearReleased"-->
<!--              filterable-->
<!--              clearable-->
<!--          >-->
<!--            <el-option-->
<!--                v-for="item in years"-->
<!--                :key="item.name"-->
<!--                :label="item.name"-->
<!--                :value="item.name"-->
<!--            />-->
<!--          </el-select>-->
<!--        </span>-->
<!--      </div>-->
<!--    </div>-->
    <div>
      <span class="label">Объем двигателя</span>
      <div class="filter-block">
        &nbsp; от
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
          placeholder="Выберите типы КПП"
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
      <el-select
          placeholder="Выберите тип выкупа"
          v-model="vModel.buyType"
          @change="changed"
          filterable
          clearable
      >
        <el-option
            v-for="item in buyTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </div>
    <div>
      <span class="label">Источник</span>
      <el-select
          placeholder="Выберите источник"
          v-model="vModel.treatmentSource"
          @change="changed"
          filterable
          clearable
      >
        <el-option
            v-for="item in treatments"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
    </div>
    <div>
      <span class="label">Гос.номер</span>
      <el-input v-model="vModel.registrationMark"
                @change="changed"
                @input="changeRegistartionMark"
                style="text-transform: uppercase"
                placeholder="X 000 XX 000"
                maxlength="12"
                @key.enter="changed"/>
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {driveTypies, kpp, buyTypes, bodyTypes, statuses} from '@/utils/globalConstants'
import {globalRef} from "@/components/filterControls/FilterGlobalRef";

import {formatDateDDMMYYYY, vetRegNumber} from "@/utils/globalFunctions";
import FilterFieldsCtrl from "@/components/filterControls/FilterFieldsCtrl.vue";

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


const cities = ref([])
const places = ref([])
const organizations = ref([])
const manageres = ref([])
const tags = ref([])
const treatments = ref([])
const isMoreFilter = ref(false)
const colors = ref([])

const fields = [
  {type: '1.Дата', label: 'Дата создания', name: 'createDate', placeholder: 'Выберите дату'},
  {
    type: '4. Два списка', label: 'Модель', name1: 'carBrandId', placeholder1: 'Выберите бренд',
    name2: 'carModelId', placeholder2: 'Выберите модель'
  },
  {
    type: '5. Две даты', label: 'Год выпуска', name1: 'lowYearReleased', placeholder1: 'Выберите год',
    name2: 'highYearReleased', placeholder2: 'Выберите год'
  },


  // {type: '2.Список', label: 'Город', name: 'locationCity', placeholder: 'Выберите город'},
  // {type: '3.Список c множественным выбором', label: 'Тип КПП', name: 'gearboxType', placeholder: 'Выберите типы КПП'},

]

watch(globalRef, function () {
  let params = globalRef.tags.map(el => el.param)

  Object.keys(vModel.value).forEach(el => { // чистим контрол, если удалили тег
    if (!params.includes(el) && vModel.value[el]) vModel.value[el] = null
  })

  globalRef.tags.forEach(el => { // добавляем
    if (el.name) vModel.value[el.param] = el.code
  })
})


function changeRegistartionMark(val) {
  vModel.value.registrationMark = vetRegNumber(val)
}

function changeBrand(id) {
  console.log('changeBrand =2222222 = =')
  vModel.value.carModelId = null
  globalStore.getModels(id).then((res) => (models.value = res))
}

function changed() {
  console.log('changed')

  // Если есть уже бренд авто, вытягиваем модели
  if (!models.value.length && vModel.value.carBrandId) changeBrand(vModel.value.carBrandId)




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
      case 'buyType':
        name = buyTypes.find(el => el.id === key).name
        tags.value.push({param, name, code: key})
        break
      case 'treatmentSource':
        name = treatments.value.find(el => el.id === key).name
        tags.value.push({param, name, code: key})
        break
      case 'registrationMark':
        tags.value.push({param, name: key, code: key})
        break
      case 'lowMileage':
        tags.value.push({param, name: 'Пробег от ' + key, code: key})
        break
      case 'highMileage':
        tags.value.push({param, name: 'Пробег до ' + key, code: key})
        break
      case 'lowEnginePowerHP':
        tags.value.push({param, name: 'Мощноcть от ' + key, code: key})
        break
      case 'highEnginePowerHP':
        tags.value.push({param, name: 'Мощность до ' + key, code: key})
        break
      case 'bodyType':
        name = bodyTypes.find(el => el.id === key).name
        tags.value.push({param, name, code: key})
        break
      case 'bodyColorId':
        name = colors.value.find(el => el.id === key).colorName
        tags.value.push({param, name, code: key})
        break
      case 'lowCreateDatePeriod':
        tags.value.push({param, name: 'Период от ' + formatDateDDMMYYYY(key), code: new Date(key)})
        break
      case 'highCreateDatePeriod':
        tags.value.push({param, name: 'Период до ' + formatDateDDMMYYYY(key), code: new Date(key)})
        break
      case 'locationId':
        var pl = places.value.find(el => el.id === key)
        name = pl.title + ' ' + pl.typeTitle
        tags.value.push({param, name: 'Место: ' + name, code: key})
        break
      case 'DealStatus':
        name = statuses.find((el) => el.id === key).name
        name && tags.value.push({param, name: 'Статус: ' + name, code: key})
        break

    }
  })
  globalRef.tags = tags.value
}

function open() {
  if (brands.value.length) return false;
  for (let z = new Date().getFullYear(); z > 1939; z--) {
    years.value.push({name: z})

    console.log('years.value')
  }
  for (let z = 800; z <= 6000; z = z + 100) {
    capacities.value.push({name: z})
  }

  globalStore.getBrands().then(res => brands.value = res)
  globalStore.getOrganizations().then((res) => (organizations.value = res.items))
  globalStore.getTeatments().then(res => treatments.value = res.items)
  globalStore.getRoles([20, 120]).then((res) => (manageres.value = res.items))
  globalStore.getColors().then((res) => (colors.value = res.items))

  globalStore.getPlaces().then((res) => {
    cities.value = res.citys
    places.value = res.items
  })

  if (vModel.value.carBrandId) {
    let id = vModel.value.carBrandId
    globalStore.getModels(id).then((res) => (models.value = res))
  }
}

defineExpose({open})
</script>