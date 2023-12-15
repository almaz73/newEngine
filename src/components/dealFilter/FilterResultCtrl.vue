<template>
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

const props = defineProps(['TAGS', 'isOpen', 'searchFilter'])
const emits = defineEmits(['toSearch'])

const filterParams = {}

let s = props.searchFilter


function go() {
  Object.keys(s).forEach(el => {
    if (s[el]) filterParams[el] = s[el]
    else delete filterParams[el]
  })

  let length = Object.keys(filterParams).length
  if (length) localStorage.setItem('dealFilters', JSON.stringify(filterParams))

  emits('toSearch')
}

function clearSearch() {
  localStorage.removeItem('dealFilters')
  Object.keys(s).forEach(el => s[el] = null)
  emits('toSearch')
}

function removeFilter(element) {
  Object.keys(s).forEach(el => {
    if (el === element.word) s[el] = null
  })

}
</script>