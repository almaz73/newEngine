<template>
  <div class="category-auto"
       :style="{background:['#518468', '#c6e0cc', 'orange', '#848484', '#d84e4e'][number-1]}">
    {{ number && categoryAutos.find((el => el.id === number)).name }}
  </div>
</template>

<script setup lang="ts">
import {categoryAutos} from '@/utils/globalConstants'
import {ref} from "vue";

let number = ref(null)
let {categoryNumber, categoryName} = defineProps(['categoryNumber', 'categoryName'])

number.value = categoryNumber
if (categoryName) number.value = ['_', 'A', 'B', 'C', 'D', 'S'].indexOf(categoryName)

</script>