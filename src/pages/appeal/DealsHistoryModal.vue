<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 730"
            :top="50"
            :title="title"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'480px':'600px'">

      <div
          v-if="!dossier.sellWorkflowChains?.length && !dossier.commissionChains?.length && !dossier.buyWorkflowChains?.length"
          style="text-align: center">Нет данных
      </div>

      <div
          v-if="(dossier && dossier.buyWorkflowChains && dossier.buyWorkflowChains.length)">
        <h3 @click="isPay = !isPay" style="cursor: pointer">Выкуп
          <span v-if="isPay">▼</span>
        </h3>

        <div v-for="(buy, ind) in dossier.buyWorkflowChains" :key="ind">
          <div v-if="!isPay && dossier.buyWorkflowChains.length"
               style="border: 1px solid #ddd; border-radius: 5px; padding: 8px; margin: 4px 0;background: white">


            <details v-show="buy.buyAppealChainModel">
              <summary style="display: block">
                <table style="width: 100%; color: grey">
                  <tr>
                    <td style="width: 220px">
                      <a v-if="buy.buyAppealChainModel.appealId"
                         :href="'/v2/appeal/'+buy.buyAppealChainModel.appealId">
                        {{ buy.buyAppealChainModel.appealId }} </a>
                      <span v-if="!buy.buyAppealChainModel.appealId"></span>
                    </td>
                    <td style="width: 250px">
                      Обращение
                    </td>
                    <td style="color: var(--main-color)">
                      {{ buy.buyAppealChainModel.appealType }}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {{ formatDMY_hm(buy.buyAppealChainModel.createDate) }}
                    </td>
                    <td>
                            <span :style="{'background': buy.buyAppealChainModel.appealStatus==='Новый'
                                    ?'#01a9db': buy.buyAppealChainModel.appealStatus==='В работе'
                                    ?'#3cac71': buy.buyAppealChainModel.appealStatus==='Архив'
                                    ?'orange':'#d34439'}"
                                  style="color: white; padding: 1px 5px">
                                {{ buy.buyAppealChainModel.appealStatus }}
                            </span>
                    </td>
                  </tr>
                </table>
                <div v-if="buy.buyAppealChainModel.appealComment" style="margin-bottom:12px">
                  Комментарий:
                  {{ buy.buyAppealChainModel.appealComment }}
                </div>
              </summary>
              <div style="margin: 19px 0 0 52px">
                <div v-if="buy.buyAppealChainModel.responsible">
                  <div class="label" style="margin-left: -33px; display: inline-block">Ответственный:</div>
                  {{ buy.buyAppealChainModel.responsible }}
                </div>
                <div v-if="buy.buyAppealChainModel.salon">
                  <div class="label" style="width: 100px; display: inline-block">Салон:</div>
                  {{ buy.buyAppealChainModel.salon }}
                </div>
                <div v-if="buy.buyAppealChainModel.clientPhone">
                  <div class="label" style="width: 100px; display: inline-block">Телефон:</div>
                  {{ buy.buyAppealChainModel.clientPhone }}
                </div>


                <div v-if="buy.buyAppealChainModel.auto.brand">
                  <div class="label" style="width: 100px; display: inline-block">Модель:</div>
                  {{ buy.buyAppealChainModel.auto.brand }} {{ buy.buyAppealChainModel.auto.model }}<br>
                </div>
                <div v-if="buy.buyAppealChainModel.auto.price">
                  <div class="label" style="width: 100px; display: inline-block">Стоимость:</div>
                  {{ buy.buyAppealChainModel.auto.price }}
                </div>
                <div v-if="buy.buyAppealChainModel.auto.vin">
                  <div class="label" style="width: 100px; display: inline-block">VIN:</div>
                  {{ buy.buyAppealChainModel.auto.vin }}
                </div>

                <div v-if="buy.buyAppealChainModel.lastUpdateDate">
                  <div class="label" style="width: 100px; display: inline-block">Изменен:</div>
                  {{ formatDMY_hm(buy.buyAppealChainModel.lastUpdateDate) }}
                </div>


              </div>
            </details>

            <details v-show="buy.buyWorkflowChainModel">
              <summary style="display: block">
                <table style="width: 100%; color: grey">
                  <tr>
                    <td style="width: 220px">
                      <a v-if="buy.buyWorkflowChainModel?.autoId"
                         :href="'/v2/auto/'+buy.buyWorkflowChainModel?.autoId+'/deal/'+buy.buyWorkflowChainModel?.buyId"
                      >
                        {{ buy.buyWorkflowChainModel?.buyId }}
                      </a>
                    </td>
                    <td style="width: 250px">
                      Оценка:
                    </td>
                    <td style="color: var(--main-color)">
                      {{ buy.buyWorkflowChainModel?.buyType }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {{ formatDMY_hm(buy.buyWorkflowChainModel?.createDate) }}
                    </td>
                    <td>
                                <span :style="{'background': buy.buyWorkflowChainModel?.status==='Новый'
                                        ?'#01a9db': buy.buyWorkflowChainModel?.status==='В работе'
                                        ?'#3cac71': buy.buyWorkflowChainModel?.status==='Архив'
                                        ?'orange':'#d34439'}"
                                      style="color: white; padding: 1px 5px">
                                    {{ buy.buyWorkflowChainModel?.status }}
                                </span>
                    </td>
                  </tr>
                </table>

                <div v-if="buy.buyWorkflowChainModel?.appealComment" style="margin-bottom:12px">
                  Комментарий:
                  {{ buy.buyWorkflowChainModel?.appealComment }}
                </div>
              </summary>

              <div style="margin: 19px 0 0 52px">
                <div v-if="buy.buyWorkflowChainModel?.responsible">
                  <div class="label" style="margin-left: -33px; display: inline-block">Ответственный:</div>
                  {{ buy.buyWorkflowChainModel?.responsible }}
                </div>
                <div v-if="buy.buyWorkflowChainModel?.financialEvaluation.maxBuyPrice">
                  <div class="label" style="width: 100px; display: inline-block">Макс. цена:</div>
                  {{ buy.buyWorkflowChainModel?.financialEvaluation.maxBuyPrice }}
                </div>
                <div v-if="buy.buyWorkflowChainModel?.financialEvaluation.plannedSellPrice">
                  <div class="label" style="width: 100px; display: inline-block">План. цена:</div>
                  {{ buy.buyWorkflowChainModel?.financialEvaluation.plannedSellPrice }}
                </div>


                <div v-if="buy.buyWorkflowChainModel?.auto.brand">
                  <div class="label" style="width: 100px; display: inline-block">Модель:</div>
                  {{ buy.buyWorkflowChainModel?.auto.brand }} {{ buy.buyWorkflowChainModel?.auto.model }}<br>
                </div>

                <div v-if="buy.buyWorkflowChainModel?.auto.vin">
                  <div class="label" style="width: 100px; display: inline-block">VIN:</div>
                  {{ buy.buyWorkflowChainModel?.auto.vin }}
                </div>

              </div>
            </details>

          </div>
        </div>


      </div>

      <!--    Комиссия-->

      <br>
      <div
          v-if="dossier && dossier.commissionChains && dossier.commissionChains.length">


        <h3 @click="isComiss = !isComiss" style="cursor: pointer">Комиссия
          <span v-if="isComiss">▼</span>
        </h3>
        <div v-for="(comiss, ind) in dossier.commissionChains" :key="ind">

          <details v-if="!isComiss" v-show="comiss.commissionAppealChainModel">
            <summary style="display: block">
              <table style="width: 100%; color: grey">
                <tr>
                  <td style="width: 220px">
                    <a v-if="comiss.commissionAppealChainModel?.appealId"
                       :href="'/v2/appeal/commission/'+comiss.commissionAppealChainModel.appealId">
                      {{ comiss.commissionAppealChainModel.appealId }} </a>
                    <span v-if="!comiss.commissionAppealChainModel.appealId"></span>
                  </td>
                  <td style="width: 250px">
                    Обращение:
                  </td>
                  <td style="color: var(--main-color)">
                    {{ comiss.commissionAppealChainModel.appealType }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ formatDMY_hm(comiss.commissionAppealChainModel.createDate) }}
                  </td>
                  <td>
                            <span :style="{'background': comiss.commissionAppealChainModel.appealStatus==='Новый'
                                            ?'#01a9db': comiss.commissionAppealChainModel.appealStatus==='В работе'
                                            ?'#3cac71': comiss.commissionAppealChainModel.appealStatus==='Архив'
                                            ?'orange':'#d34439'}"
                                  style="color: white; padding: 1px 5px">
                            {{ comiss.commissionAppealChainModel.appealStatus }}
                            </span>
                  </td>
                </tr>
              </table>

              <div v-if="comiss.commissionAppealChainModel.appealComment" style="margin-bottom:12px">
                Комментарий:
                {{ comiss.commissionAppealChainModel.appealComment }}
              </div>
            </summary>

            <div style="margin: 19px 0 0 52px">
              <div v-if="comiss.commissionAppealChainModel.responsible">
                <div class="label" style="margin-left: -33px; display: inline-block">Ответственный:</div>
                {{ comiss.commissionAppealChainModel.responsible }}
              </div>
              <div v-if="comiss.commissionAppealChainModel.salon">
                <div class="label" style="width: 100px; display: inline-block">Салон:</div>
                {{ comiss.commissionAppealChainModel.salon }}
              </div>
              <div v-if="comiss.commissionAppealChainModel.clientPhone">
                <div class="label" style="width: 100px; display: inline-block">Телефон:</div>
                {{ comiss.commissionAppealChainModel.clientPhone }}
              </div>


              <div v-if="comiss.commissionAppealChainModel.financialEvaluation.maxBuyPrice">
                <div class="label" style="width: 100px; display: inline-block">Макс. цена:</div>
                {{ comiss.commissionAppealChainModel.financialEvaluation.maxBuyPrice }}
              </div>
              <div v-if="comiss.commissionAppealChainModel.financialEvaluation.plannedSellPrice">
                <div class="label" style="width: 100px; display: inline-block">План. цена:</div>
                {{ comiss.commissionAppealChainModel.financialEvaluation.plannedSellPrice }}
              </div>

              <div v-if="comiss.commissionAppealChainModel.lastUpdateDate">
                <div class="label" style="width: 100px; display: inline-block">Изменен:</div>
                {{ formatDMY_hm(comiss.commissionAppealChainModel.lastUpdateDate) }}
              </div>
            </div>
          </details>

        </div>
      </div>

      <!--    продажи -->
      <br>
      <div
          v-if="dossier && dossier.sellWorkflowChains && dossier.sellWorkflowChains.length">
        <h3 @click="isSell = !isSell" style="cursor: pointer">Реализация
          <span v-if="isSell">▼</span>
        </h3>
        <div v-for="(sell, ind) in dossier.sellWorkflowChains" :key="ind">

          <div v-if="!isSell" style="border: 1px solid #ddd; border-radius: 5px; padding: 8px; margin: 4px 0">

            <details v-show="sell.sellAppealChainModel">
              <summary style="display: block">
                <table style="width: 100%; color: grey">
                  <tr>
                    <td style="width: 220px">
                      <a v-if="sell.sellAppealChainModel?.appealId"
                         :href="'/v2/appeal/'+sell.sellAppealChainModel.appealId">
                        {{ sell.sellAppealChainModel.appealId }} </a>
                      <span v-if="!sell.sellAppealChainModel.appealId"></span>
                    </td>
                    <td style="width: 250px">
                      Обращение
                    </td>
                    <td STYLE="color: var(--main-color)">
                      {{ sell.sellAppealChainModel.appealType }}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {{ formatDMY_hm(sell.sellAppealChainModel.createDate) }}
                    </td>
                    <td>
                                <span :style="{'background': sell.sellAppealChainModel.appealStatus==='Новый'
                                            ?'#01a9db': sell.sellAppealChainModel.appealStatus==='В работе'
                                            ?'#3cac71': sell.sellAppealChainModel.appealStatus==='Архив'
                                            ?'orange':'#d34439'}"
                                      style="color: white; padding: 1px 5px">
                                    {{ sell.sellAppealChainModel.appealStatus }}
                                </span>
                    </td>
                  </tr>
                </table>


                <div v-if="sell.sellAppealChainModel.appealComment" style="margin-bottom:12px">
                  Комментарий:
                  {{ sell.sellAppealChainModel.appealComment }}
                </div>
              </summary>

              <div v-if="isShowSell" style="margin: 19px 0 0 52px">
                <div v-if="sell.sellAppealChainModel.responsible">
                  <div class="label" style="margin-left: -33px; display: inline-block">Ответственный:</div>
                  {{ sell.sellAppealChainModel.responsible }}
                </div>
                <div v-if="sell.sellAppealChainModel.salon">
                  <div class="label" style="width: 100px; display: inline-block">Салон:</div>
                  {{ sell.sellAppealChainModel.salon }}
                </div>
                <div v-if="sell.sellAppealChainModel.clientPhone">
                  <div class="label" style="width: 100px; display: inline-block">Телефон:</div>
                  {{ sell.sellAppealChainModel.clientPhone }}
                </div>


                <div v-if="sell.sellAppealChainModel.auto.brand">
                  <div class="label" style="width: 100px; display: inline-block">Модель:</div>
                  {{ sell.sellAppealChainModel.auto.brand }} {{ sell.sellAppealChainModel.auto.model }}<br>
                </div>

                <div v-if="sell.sellAppealChainModel.auto.vin">
                  <div class="label" style="width: 100px; display: inline-block">VIN:</div>
                  {{ sell.sellAppealChainModel.auto.vin }}
                </div>

                <div v-if="sell.sellAppealChainModel.lastUpdateDate">
                  <div class="label" style="width: 100px; display: inline-block">Изменен:</div>
                  {{ formatDMY_hm(sell.sellAppealChainModel.lastUpdateDate) }}
                </div>

                <div v-if="sell.sellAppealChainModel.appealComment">
                  <div class="label" style="width: 100px; display: inline-block">Комментарий:</div>
                  {{ sell.sellAppealChainModel.appealComment }}
                </div>
              </div>
            </details>
            <!--      /////////////1/////////////////      -->

            <details v-show="sell.sellCreditChainModel">
              <summary style="display: block">
                <table style="width: 100%; color: grey">
                  <tr>
                    <td style="width: 220px">
                      <a v-if="sell.sellCreditChainModel?.creditID"
                         :href="'/v2/credit-application/general/'+sell.sellCreditChainModel.creditID">
                        {{ sell.sellCreditChainModel.creditID }} </a>
                      <span v-if="!sell.sellCreditChainModel.creditID"></span>
                    </td>
                    <td style="width: 250px">
                      Кредит
                    </td>
                    <td style="color: var(--main-color)">
                      {{ sell.sellCreditChainModel.appealType }}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {{ formatDMY_hm(sell.sellCreditChainModel.createDate) }}
                    </td>
                    <td>
                                <span v-if="sell.sellCreditChainModel.appealStatus"
                                      :style="{'background': sell.sellCreditChainModel.appealStatus==='Новый'
                                            ?'#01a9db': sell.sellCreditChainModel.appealStatus==='В работе'
                                            ?'#3cac71': sell.sellCreditChainModel.appealStatus==='Архив'
                                            ?'orange':'#d34439'}"
                                      style="color: white; padding: 1px 5px">
                                {{ sell.sellCreditChainModel.appealStatus }}
                                </span>
                    </td>
                  </tr>
                </table>

                <div v-if="sell.sellCreditChainModel.appealComment" style="margin-bottom:12px">
                  Комментарий:
                  {{ sell.sellCreditChainModel.appealComment }}
                </div>
              </summary>

              <div v-if="isShowCredit" style="margin: 19px 0 0 52px">
                <div v-if="sell.sellCreditChainModel.responsible">
                  <div class="label" style="margin-left: -33px; display: inline-block">Ответственный:</div>
                  {{ sell.sellCreditChainModel.responsible }}
                </div>
                <div v-if="sell.sellCreditChainModel.salon">
                  <div class="label" style="width: 100px; display: inline-block">Салон:</div>
                  {{ sell.sellCreditChainModel.salon }}
                </div>
                <div v-if="sell.sellCreditChainModel.clientPhone">
                  <div class="label" style="width: 100px; display: inline-block">Телефон:</div>
                  {{ sell.sellCreditChainModel.clientPhone }}
                </div>


                <div v-if="sell.sellCreditChainModel.auto.brand">
                  <div class="label" style="width: 100px; display: inline-block">Модель:</div>
                  {{ sell.sellCreditChainModel.auto.brand }} {{ sell.sellCreditChainModel.auto.model }}<br>
                </div>

                <div v-if="sell.sellCreditChainModel.auto.vin">
                  <div class="label" style="width: 100px; display: inline-block">VIN:</div>
                  {{ sell.sellCreditChainModel.auto.vin }}
                </div>

                <div v-if="sell.sellCreditChainModel.lastUpdateDate">
                  <div class="label" style="width: 100px; display: inline-block">Изменен:</div>
                  {{ formatDMY_hm(sell.sellCreditChainModel.lastUpdateDate) }}
                </div>

                <div v-if="sell.sellCreditChainModel.creditSum">
                  <div class="label" style="width: 100px; display: inline-block">Сумма кредита, р.:</div>
                  {{ sell.sellCreditChainModel.creditSum }}
                </div>

                <div v-if="sell.sellCreditChainModel.firstDepositSum">
                  <div class="label" style="width: 100px; display: inline-block">Первый депозит, р.:</div>
                  {{ sell.sellCreditChainModel.firstDepositSum }}
                </div>
              </div>
            </details>
            <!--      /////////////2/////////////////      -->


            <details v-show="sell.sellRealizationChainModel">
              <summary style="display: block">
                <table style="width: 100%; color: grey">
                  <tr>
                    <td style="width: 220px">
                      <a v-if="sell.sellRealizationChainModel?.realizationId"
                         :href="'/v2/realization/general/'+sell.sellRealizationChainModel.realizationId">
                        {{ sell.sellRealizationChainModel.realizationId }} </a>

                      <span v-if="!sell.sellRealizationChainModel.realizationId"></span>
                    </td>
                    <td style="width: 250px">
                      Реализация
                    </td>
                    <td style="color:var(--main-color)">
                      {{ sell.sellRealizationChainModel.appealType }}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      {{ formatDMY_hm(sell.sellRealizationChainModel.createDate) }}
                    </td>
                    <td>
                                <span :style="{'background': sell.sellRealizationChainModel.status==='Новый'
                                            ?'#01a9db': sell.sellRealizationChainModel.status==='В работе'
                                            ?'#3cac71': sell.sellRealizationChainModel.status==='Архив'
                                            ?'orange':'#d34439'}"
                                      style="color: white; padding: 1px 5px">
                                    {{ sell.sellRealizationChainModel.status }}
                                </span>
                    </td>
                  </tr>
                </table>


                <div v-if="sell.sellRealizationChainModel.appealComment" style="margin-bottom:12px">
                  Комментарий:
                  {{ sell.sellRealizationChainModel.appealComment }}
                </div>
              </summary>

              <div v-if="isShowReal" style="margin: 19px 0 0 52px">
                <div v-if="sell.sellRealizationChainModel.manager">
                  <div class="label" style="width: 100px; display: inline-block">Менеджер:</div>
                  {{ sell.sellRealizationChainModel.manager }}
                </div>
                <div v-if="sell.sellRealizationChainModel.salon">
                  <div class="label" style="width: 100px; display: inline-block">Салон:</div>
                  {{ sell.sellRealizationChainModel.salon }}
                </div>
                <div v-if="sell.sellRealizationChainModel.clientPhone">
                  <div class="label" style="width: 100px; display: inline-block">Телефон:</div>
                  {{ sell.sellRealizationChainModel.clientPhone }}
                </div>


                <div v-if="sell.sellRealizationChainModel.auto.brand">
                  <div class="label" style="width: 100px; display: inline-block">Модель:</div>
                  {{ sell.sellRealizationChainModel.auto.brand }} {{ sell.sellRealizationChainModel.auto.model }}<br>
                </div>

                <div v-if="sell.sellRealizationChainModel.auto.vin">
                  <div class="label" style="width: 100px; display: inline-block">VIN:</div>
                  {{ sell.sellRealizationChainModel.auto.vin }}
                </div>

                <div v-if="sell.sellRealizationChainModel.lastUpdateDate">
                  <div class="label" style="width: 100px; display: inline-block">Изменен:</div>
                  {{ formatDMY_hm(sell.sellRealizationChainModel.lastUpdateDate) }}
                </div>

                <div v-if="sell.sellRealizationChainModel.credit.responsible">
                  <div class="label" style="width: 100px; display: inline-block">Оформитель:</div>
                  {{ sell.sellRealizationChainModel.credit.responsible }}
                </div>

                <div v-if="sell.sellRealizationChainModel.credit.bankName">
                  <div class="label" style="width: 100px; display: inline-block">Банк:</div>
                  {{ sell.sellRealizationChainModel.credit.bankName }}
                </div>

                <div v-if="sell.sellRealizationChainModel.credit.creditSum">
                  <div class="label" style="width: 100px; display: inline-block">Сумма кредита, р.:</div>
                  {{ sell.sellRealizationChainModel.credit.creditSum }}
                </div>

                <div v-if="sell.sellRealizationChainModel.credit.firstDepositSum">
                  <div class="label" style="width: 100px; display: inline-block">Первый депозит, р.:</div>
                  {{ sell.sellRealizationChainModel.credit.firstDepositSum }}
                </div>

              </div>
            </details>
            <!--      /////////////3/////////////////      -->

          </div>
        </div>


      </div>
    </el-scrollbar>
  </AppModal>
</template>

<script setup>
/**
 * История измеенний клиента / юридического лица
 */
import AppModal from '@/components/AppModal.vue'
import {useGlobalStore} from '@/stores/globalStore'
import {ref} from 'vue'
import {formatDMY_hm} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const isOpen = ref(false)
const dossier = ref([])
const isPay = ref(false)
const isComiss = ref(false)
const isSell = ref(false)
const closeModal = () => isOpen.value = false
const title = ref('')
const subtitle = ref('')

function open(clientId, fio) {
  isOpen.value = true
  title.value = 'История сделок с клиентом'
  subtitle.value = fio

  globalStore.isWaiting = true
  globalStore.getLeadActivityHistory(clientId).then(res => {
    dossier.value = res
    globalStore.isWaiting = false
  })
}


defineExpose({open})

</script>