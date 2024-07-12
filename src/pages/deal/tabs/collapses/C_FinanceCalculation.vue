<template>
  <div class="a-report-data" v-if="dealStore.deal">

    <div class="info-filed" v-show="dealStore.deal.maxPriceBought">
      <label class="label l_200">Максимальная цена выкупа</label>
      {{ dealStore.deal.maxPriceBought }} ₽
    </div>

    <div class="info-filed" v-show="dealStore.deal.priceMarket">
      <label class="label l_200">Максимальная цена выкупа</label>
      {{ dealStore.deal.priceMarket }} ₽
    </div>


    <!--    <div class="info-filed" v-show="analystComment">-->
    <!--      <label class="label l_200">Комментарий аналитика</label>-->
    <!--      {{ analystComment }} ₽-->
    <!--    </div>-->

    <div class="info-filed" v-show="dealStore.deal.priceDemanded">
      <label class="label l_200">Комментарий аналитика</label>
      {{ dealStore.deal.priceDemanded }} ₽
    </div>


    <div
      class="a-report-data-item a-no-clearfix"
      user-permission="dealStore.dealGeneral.priceDemanded"
      v-show="dealStore.deal.priceDemanded"
    >
      <div class="a-report-data-label">Цена клиента</div>
      <div class="a-report-data-text">
        {{ dealStore.deal.clientSellPrice }} <span class="uk-icon-ruble"></span>
      </div>
    </div>

    <div class="info-filed" v-show="dealStore.deal.managerPrice">
      <label class="label l_200">Цена руководителя</label>
      {{ dealStore.deal.managerPrice }} ₽
    </div>

    <!--    <div class="info-filed" v-show="buyerComment">-->
    <!--      <label class="label l_200">Комментарий байера</label>-->
    <!--      {{ buyerComment }}-->
    <!--    </div>-->


    <!--    user-permission="dealStore.dealGeneral.requestAnalystComment"-->
    <!--    user-permission-args="dealStore.deal.dealStore.dealStatus"-->
    <!--    <div class="info-filed" v-show="requestAnalystComment">-->
    <!--      <label class="label l_200">Комментарий аналитика</label>-->
    <!--      {{ requestAnalystComment }}-->
    <!--    </div>-->


    <!--    user-permission="dealStore.dealGeneral.requestBuyerManagerComment"-->
    <!--    user-permission-args="dealStore.deal.dealStore.dealStatus"-->
    <!--    <div class="info-filed" v-show="requestBuyerManagerComment">-->
    <!--      <label class="label l_200">Комментарий руководителя</label>-->
    <!--      {{ requestBuyerManagerComment }}-->
    <!--    </div>-->


    <!--    user-permission="dealStore.dealGeneral.declineBuyerManagerComment"-->
    <!--    user-permission-args="dealStore.deal.dealStore.dealStatus"-->
    <!--    <div class="info-filed" v-show="declineBuyerManagerComment">-->
    <!--      <label class="label l_200">Комментарий руководителя</label>-->
    <!--      {{ declineBuyerManagerComment }}-->
    <!--    </div>-->

    <div class="info-filed">
      <label class="label l_200">Комиссионное вознаграждение</label>
      {{ dealStore.deal.commissionFee }} ₽
    </div>

  </div>
</template>

<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'

const dealStore = useDealStore()

</script>