/* Разбил модалку чтобы упростить*/
<template>
  <small>
    <label class="label-right l_100">Источник</label>

    <el-select
        style="width: 220px"
        v-model="fields.treatmentSourceId"
        filterable>
      <el-option v-for="item in props.treatmentSources" :key="item.id" :label="item.name" :value="item.id"/>
    </el-select>
    <br></small>

  Продавец
  <br>
  <small>
    <label class="label-right l_100">Тип клиента</label>
    <el-select
        style="width: 200px"
        v-model="fields.lead.leadType"
        filterable>
      <el-option v-for="item in LeadType" :key="item.id" :label="item.name" :value="item.id"/>
    </el-select>
  </small>
  <br>

  <small>
    <label class="label-right l_100">Телефон</label>

    <el-form-item prop="phone" style="display: table-cell"
                  :rules="{required: true, message: 'Телефон', trigger: ['blur']}">
      <el-autocomplete
          v-model="fields.phone"
          :disabled="props.disablePerson"
          :fetch-suggestions="getSeller"
          :trigger-on-focus="false"
          @select="setClient"
          clearable
          placeholder="Введите телефон"
      />
    </el-form-item>
    <br>
  </small>


  <small v-if="fields.lead.leadType===20">
    <label class="label-right l_100">Наименование</label>
    <el-input v-model="fields.name" :disabled="disablePerson" placeholder="Введите наименование"/>
    <br>
  </small>

  <small v-if="fields.lead.leadType===20">
    <label class="label-right l_100">ИНН</label>
    <el-form-item prop="inn" style="display: table-cell"
                  :rules="{required: true, message: 'ИНН', trigger: ['blur']}">
      <el-autocomplete
          v-model="fields.inn"
          :disabled="disablePerson"
          :fetch-suggestions="getInn"
          :trigger-on-focus="false"
          @select="setClient"
          clearable
          placeholder="Введите ИНН"
      />
    </el-form-item>
    <br></small>


  <small>
    <label class="label-right l_100">Фамилия</label>
    <el-input v-model="fields.lastName" :disabled="disablePerson"/>
    <br></small>

  <small>
    <label class="label-right l_100">Имя</label>
    <el-form-item prop="firstName" style="display: table-cell"
                  :rules="{required: true, message: 'Имя', trigger: ['blur']}">
      <el-input v-model="fields.firstName" :disabled="disablePerson"/>
    </el-form-item>
    <br></small>

  <hr>

  Автомобиль<br>
  <small>
    <label class="label-right l_100">Марка</label>

    <el-select
        style="width: 140px"
        v-model="fields.carBrand"
        @change="changeBrand(fields.carBrand)"
        clearable
    >
      <el-option v-for="brand in props.brands" :key="brand.id" :label="brand.name" :value="brand.id"/>
    </el-select>
  </small>
  <small>
    <label class="label-right l_100">Модель</label>

    <el-select
        style="width: 110px"
        v-model="fields.carModelId"
        :filterable="!globalStore.isMobileView"
        placeholder="Модель">
      <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
    </el-select>
  </small>
  <small>
    <label class="label-right l_100">Год выпуска</label>

    <el-select placeholder="Год выпуска"
               clearable
               style="width: 110px"
               v-model="fields.yearReleased">
      <el-option v-for="item in Years" :key="item.name" :label="item.name" :value="item.name"/>
    </el-select>
  </small>

</template>

<script setup lang="ts">
import {LeadType, Years} from "@/utils/globalConstants";
import {useAppealStore} from "@/stores/appealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";


const appealStore = useAppealStore()
const globalStore = useGlobalStore()
const props = defineProps(['newWorkflow', 'disablePerson', 'brands', 'treatmentSources'])
const fields = ref(null)
const isDisablePerson = ref(null)
const models = ref([])

fields.value = props.newWorkflow
isDisablePerson.value = props.disablePerson


function setClient(val) {
  console.log(val)

  fields.value.firstName = val.firstName
  fields.value.lastName = val.lastName
  fields.value.phone = val.phone
  fields.value.inn = val.inn
  if (fields.value.lead.leadType === 10) {
    fields.value.client = val
  }
  if (fields.value.lead.leadType === 20) {
    fields.value.legal = val

    if (val.person) {
      fields.value.name = val.name
      fields.value.firstName = val.person.firstName
      fields.value.lastName = val.person.lastName
      fields.value.phone = val.person.phone
    }
  }
}

const getSeller = value => {
  if (value.length < 3) return []
  return appealStore.getIndividual(value).then(res => {
    return res.items.map(el => {
      el.value = el.lastName + ' ' + el.firstName + ' ' + el.middleName + ' ( ' + el.phone + ' ) '
      return el
    })
  })
}

const getInn = value => {
  if (value.length < 3) return []
  return appealStore.getInn(value, fields.value.lead.leadType).then(res => {
    return res.models.map(el => {
      el.value = el.name + ' ' + el.type + ' ( ' + el.inn + ' ) '
      return el
    })
  })
}

function changeBrand(id) {
  fields.value.carModelId = null
  id && globalStore.getModels(id).then((res) => models.value = res)
}


</script>