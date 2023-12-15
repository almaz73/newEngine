<template>
  ={{ searchText }}=
  <div class="tags">
    <span v-for="(el,ind) in TAGS" :key="ind">
        {{ el.name }}
        <b @click="removeFilter(el)">✖</b>
      </span>
  </div>
  <div style="text-align: center" class="result" :class="{open:isOpen}">
    <el-button @click="go()">Искать</el-button>
    <el-button @click="clearSearch()">Очистить фильтр</el-button>
  </div>
</template>
<style>

.result {
  opacity: 0;
  transition: opacity 0.3s
}

.result.open {
  opacity: 1;
}
</style>
<script setup lang="ts">
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";
import {ref} from "vue";

const props = defineProps(['TAGS', 'isOpen', 'searchText', 'searchFilter'])
const emits = defineEmits(['toSearch'])


const filter = {
  filter: {},
  // limit: rowsPerPage,
  // mainFilter: 10,
  // offset: 0,
  search: ''
}


function go() {
  // console.log('searchFilter', props.searchFilter)
  //

  let s = props.searchFilter

  console.log('s ', s)


  console.log('filter.filter', filter.filter)

  if (s.createDate) filter.filter.createDate = formatDateDDMMYYYY(s.createDate)
  else delete filter.filter.createDate

  if (s.carBrandId) filter.filter.carBrandId = s.carBrandId
  else delete filter.filter.carBrandId

  if (s.carModelId) filter.filter.carModelId = s.carModelId
  else delete filter.filter.carModelId

  if (s.lowYearReleased) filter.filter.lowYearReleased = s.lowYearReleased
  else delete filter.filter.lowYearReleased

  if (s.highYearReleased) filter.filter.highYearReleased = s.highYearReleased
  else delete filter.filter.highYearReleased

  if (s.lowEngineCapacity) filter.filter.lowEngineCapacity = s.lowEngineCapacity
  else delete filter.filter.lowEngineCapacity

  if (s.highEngineCapacity) filter.filter.highEngineCapacity = s.highEngineCapacity
  else delete filter.filter.highEngineCapacity

  if (s.driveType) filter.filter.driveType = s.driveType
  else delete filter.filter.driveType

  if (s.gearboxType && s.gearboxType.length) filter.filter.gearboxType = s.gearboxType
  else delete filter.filter.gearboxType

  if (s.locationCity) filter.filter.locationCity = s.locationCity
  else delete filter.filter.locationCity

  if (s.orgelement) filter.filter.orgelement = s.orgelement
  else delete filter.filter.orgelement

  if (s.manager) filter.filter.manager = s.manager
  else delete filter.filter.manager

  let length = Object.keys(filter.filter).length

  if (filter.filter && filter.filter.createDate) {
    // не хочет дата читаться из текста иначе
    filter.filter.createDate = filter.filter.createDate.split('.').reverse().join('.')
  }

  if (length) localStorage.setItem('dealFilters', JSON.stringify(filter.filter))


  console.log('filter.filter', filter)
  // getData()
  emits('toSearch', filter)
}

function clearSearch() {
  // filter.filter = {}
  // localStorage.removeItem('filterCtrl')
  // go()
}

function removeFilter(element) {
  // console.log(element)
  // TAGS.value = TAGS.value.filter(el => el.word != element.word)
}
</script>