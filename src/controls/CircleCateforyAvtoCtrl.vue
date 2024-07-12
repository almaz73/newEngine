<template>
  <div class="category-auto"
       :style="{background:['#518468', '#c6e0cc', '#f0d089', '#c0c5ce', '#d84e4e'][categoryNumber-1]}">
    {{ categoryNumber && categoryAutos.find((el => el.id === categoryNumber)).name }}
  </div>
</template>

<script setup lang="ts">
import { categoryAutos } from '@/utils/globalConstants'

const { categoryNumber } = defineProps(['categoryNumber'])

</script>