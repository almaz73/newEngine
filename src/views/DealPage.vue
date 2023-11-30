<template>
  <main>
    <el-button class="active">Все оценки:{{ fastFilter.buy }}</el-button>
    <el-button>По активным:{{ fastFilter.buyByActive }}</el-button>
    <el-button>На продаже:{{ fastFilter.buyOnSale }}</el-button>
    <el-button>Продано:{{ fastFilter.buySoldAuto }}</el-button>
    <el-button>Возврат:{{ fastFilter.returned }}</el-button>
  </main>
</template>
<script setup lang="ts">

import {ref} from "vue";

const fastFilter = ref({buy: 1000, buyByActive: 0, buyOnSale: 233, buySoldAuto: 200, returned: 2})
</script>