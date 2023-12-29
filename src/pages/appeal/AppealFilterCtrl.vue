<template>
  <div class="deal-filters">
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
      <span class="label">Подразделение</span>
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
      <span class="label">Период</span>
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
      <span class="label">Дата обращения</span>
      <el-date-picker placeholder="Выберите дату"
                      @change="changed"
                      format="DD-MM-YYYY"
                      v-model="vModel.createDate"/>
    </div>
    <div>
      <span class="label">Номер обращения</span>
      <el-input v-model="vModel.dealNumber"
                @change="changed"
                type="number"
                clearable
                placeholder=""
                @key.enter="changed"/>
    </div>
    <div style="clear: both"></div>

    <a @click="isMoreFilter=!isMoreFilter">Дополнительный фильтер </a>
    <!--    Скрытая часть-->
    <div class="more-filter" :class="{open:isMoreFilter}">
      <div style="min-height: 0; overflow: hidden">
        <div style="white-space: nowrap">
          <span class="label">Подменный номер</span>
          <el-input v-model="vModel.swapPhone"
                    @change="changed"
                    type="number"
                    clearable
                    placeholder=""
                    @key.enter="changed"/>
        </div>
        <div>
          <span class="label">Тип обращения</span>
          <el-select
              placeholder="Выберите тип обращения"
              v-model="vModel.workflowLeadType"
              @change="changed"
              filterable
              clearable
          >
            <el-option
                v-for="item in workflowTypes"
                :key="item.value"
                :label="item.title"
                :value="item.value"
            />
          </el-select>
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
            &nbsp; от
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
        </div>

        <div>
          <span class="label">Категория</span>
          <el-select
              placeholder="Выберите категорию"
              v-model="vModel.categoryAuto"
              @change="changed"
              filterable
              clearable
          >
            <el-option v-for="item in categoryAutos" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>

        <div>
          <span class="label">Сотрудник КЦ</span>
          <el-select
              placeholder="Выберите сотрудника"
              v-model="vModel.ccEmployee"
              @change="changed"
              filterable
              clearable
          >
            <el-option v-for="item in ccEmployees" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>
        </div>

        <div style="white-space: nowrap">
          <span class="label">Статус обращения</span>
          <el-select
              placeholder="Выберите статус"
              v-model="vModel.workflowStatus"
              @change="changed"
              filterable
              clearable
          >
            <el-option v-for="item in statuses" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </div>

        <div>
          <span class="label">Статус клиента</span>
          <el-select
              placeholder="Выберите статус клиента"
              v-model="vModel.clientStatus"
              @change="changed"
              filterable
              clearable
          >
            <el-option v-for="item in clientStatuses" :key="item.value" :label="item.title" :value="item.value"/>
          </el-select>
        </div>


      </div>
      <!--    Конец скрытой части-->
    </div>
    <div style="clear: both"></div>
  </div>
</template>
<script setup>
import {computed, ref, watch} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {categoryAutos, statuses} from '@/utils/globalConstants'
import {globalRef} from "@/components/filterControls/FilterGlobalRef";
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


const cities = ref([])
const places = ref([])
const manageres = ref([])
const tags = ref([])
const workflowTypes = ref([])
const isMoreFilter = ref(false)
const colors = ref([])
const ccEmployees = ref([])
const clientStatuses = ref([])

watch(globalRef, function () {
  let params = globalRef.tags.map(el => el.param)

  Object.keys(vModel.value).forEach(el => { // чистим контрол, если удалили тег
    if (!params.includes(el) && vModel.value[el]) vModel.value[el] = null
  })

  globalRef.tags.forEach(el => { // добавляем
    if (el.name) vModel.value[el.param] = el.code
  })
})


function changeBrand(id) {
  console.log('changeBrand111222')
  vModel.value.carModelId = null
  globalStore.getModels(id).then((res) => (models.value = res))
  changed()
}

function changed() {
  // создаем теги
  tags.value = []
  Object.keys(vModel.value).forEach((param) => {
    let name = ''
    let key = vModel.value[param]
    if (!key) return false;

    switch (param) {
      case 'createDate':
        tags.value.push({param, name: 'Обращение: ' + formatDateDDMMYYYY(key), code: new Date(key)})
        break
      case 'locationCity':
        tags.value.push({param, name: 'г. ' + key, code: key})
        break
      case 'manager':
        name = manageres.value.find((el) => el.id === key).title
        name && tags.value.push({param, name: 'Менеджер: ' + name, code: key})
        break
      case 'ccEmployee':
        name = ccEmployees.value.find((el) => el.id === key).title
        name && tags.value.push({param, name: 'Сотрудник КЦ: ' + name, code: key})
        break
      case 'dealNumber':
        tags.value.push({param, name: '№ обращения ' + key, code: key})
        break
      case 'lowMileage':
        tags.value.push({param, name: 'Пробег от ' + key, code: key})
        break
      case 'highMileage':
        tags.value.push({param, name: 'Пробег до ' + key, code: key})
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
      case 'workflowLeadType':
        name = workflowTypes.value.find((el) => el.value === key).title
        name && tags.value.push({param, name: 'Тип обращения: ' + name, code: key})
        break
      case 'swapPhone':
        tags.value.push({param, name: 'Подменный номер: ' + key, code: key})
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
      case 'categoryAuto':
        name = categoryAutos.find((el) => el.id === key).name
        name && tags.value.push({param, name: 'Категория: ' + name, code: key})
        break
      case 'workflowStatus':
        name = statuses.find((el) => el.id === key).name
        name && tags.value.push({param, name: 'Статус: ' + name, code: key})
        break
      case 'clientStatus':
        name = clientStatuses.value.find((el) => el.value === key).title
        name && tags.value.push({param, name: 'Статус клиента: ' + name, code: key})
        break

    }
  })
  globalRef.tags = tags.value
}

function open() {
  for (let z = new Date().getFullYear(); z > 1939; z--) {
    years.value.push({name: z})
  }
  for (let z = 800; z <= 6000; z = z + 100) {
    capacities.value.push({name: z})
  }

  globalStore.getBrands().then(res => brands.value = res)
  globalStore.getClientStatuses().then(res => clientStatuses.value = res.items)
  globalStore.getColors().then((res) => (colors.value = res.items))
  globalStore.getAppeals().then((res) => (workflowTypes.value = res.items))
  globalStore.getPlaces().then((res) => {
    cities.value = res.citys
    places.value = res.items
  })
  globalStore.getUsers().then((res) => {
    manageres.value = res.items
    manageres.value.forEach(item => {
      if (item.role === 110 || item.role === 111) ccEmployees.value.push(item);
    });
  })

  if (vModel.value.carBrandId) {
    let id = vModel.value.carBrandId
    globalStore.getModels(id).then((res) => (models.value = res))
  }
}

defineExpose({open})
</script>