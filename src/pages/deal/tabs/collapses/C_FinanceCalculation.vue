<template>
  <div class="a-report-data" v-if="dealStore.deal">

    <div class="info-filed" v-show="dealStore.deal.maxPriceBought!==null">
      <label class="label l_200">Максимальная цена выкупа</label>
      {{ dealStore.deal.maxPriceBought }} ₽
    </div>

    <div class="info-filed" v-show="dealStore.deal.priceMarket!==null">
      <label class="label l_200">Максимальная цена выкупа</label>
      {{ dealStore.deal.priceMarket }} ₽
    </div>


    <div class="info-filed" v-show="dealStore.deal.priceDemanded!==null">
      <label class="label l_200">Комментарий аналитика</label>
      {{ dealStore.deal.priceDemanded }} ₽
    </div>


    <div class="info-filed" v-show="dealStore.deal.priceDemanded!==null">
      <label class="label l_200">Цена клиента</label>
      {{ dealStore.deal.clientSellPrice }} ₽
    </div>

    <div class="info-filed" v-show="dealStore.deal.managerPrice!==null">
      <label class="label l_200">Цена руководителя</label>
      {{ dealStore.deal.managerPrice }} ₽
    </div>


    <div class="info-filed" v-show="dealStore.deal.commissionFee!==null">
      <label class="label l_200">Комиссионное вознаграждение</label>
      {{ dealStore.deal.commissionFee }} ₽
    </div>

  </div>
</template>

<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'

const dealStore = useDealStore()

</script>