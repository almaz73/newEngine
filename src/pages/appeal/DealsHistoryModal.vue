<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 730"
            :top="50"
            :title="title"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">

      <div style="border-radius: 12px; border: 3px solid #e5e5e5; padding: 8px;font-size: larger; margin-top: 4px"
           v-if="(dossier && dossier.buyWorkflowChains && dossier.buyWorkflowChains.length) || isWaiter">
        <h3 @click="isPay = !isPay" style="cursor: pointer">Выкуп
          <span v-if="isWaiter" style="font-size: 24px; opacity: 0.3"> ⧖ </span>
          <span v-if="isPay">▼</span>
        </h3>

        <div v-for="(buy, ind) in dossier.buyWorkflowChains" :key="ind">
          <div v-if="!isPay && dossier.buyWorkflowChains.length"
               style="border: 1px solid #ddd; border-radius: 5px; padding: 8px; margin: 4px 0;background: white">
            <table style="width: 100%; color: grey" v-show="buy.buyAppealChainModel">
              <tr>
                <td style="width: 100px">
                  <a v-if="buy.buyAppealChainModel.appealId"
                     href="#/appeal/{{buy.buyAppealChainModel.appealId}}">
                    {{ buy.buyAppealChainModel.appealId }} ᐅ</a>
                  <span v-if="!buy.buyAppealChainModel.appealId">ᐅ</span>
                </td>
                <td style="width: 250px">
                  Обращение
                </td>
                <td>
                  {{ buy.buyAppealChainModel.appealType }}
                  <a
                      v-show="buy.buyAppealChainModel.appealId"
                      style="color: grey; text-decoration: none"
                      @click="isShowBuy = !isShowBuy"
                  >
                    <span v-if="!isShowBuy">▼</span>
                    <span v-if="isShowBuy">▲</span>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  {{ buy.buyAppealChainModel.createDate }}
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


            <div v-if="isShowBuy" style="margin-left: 32px">
              <div v-if="buy.buyAppealChainModel.responsible">
                <div class="label" style="width: 100px; display: inline-block">Ответственный:</div>
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
                {{ buy.buyAppealChainModel.lastUpdateDate }}
              </div>


            </div>


            <table style="width: 100%; color: grey" v-show="buy.buyWorkflowChainModel">
              <tr>
                <td style="width: 100px">
                  <a v-if="buy.buyWorkflowChainModel.autoId"
                     href="#/auto/{{buy.buyWorkflowChainModel.autoId}}/deal/{{buy.buyWorkflowChainModel.buyId}}"
                  >
                    {{ buy.buyWorkflowChainModel.buyId }} ᐅ
                  </a>
                  <span v-if="!buy.buyWorkflowChainModel.autoId">ᐅ</span>
                </td>
                <td style="width: 250px">
                  Оценка:
                </td>
                <td>
                  {{ buy.buyWorkflowChainModel.buyType }}
                  <a
                      v-show="buy.buyWorkflowChainModel.autoId"
                      style="color: grey; text-decoration: none"
                      @click="isShowBuyFinish = !isShowBuyFinish"
                  >
                    <span v-if="!isShowBuy">▼</span>
                    <span v-if="isShowBuy">▲</span>
                  </a>
                </td>
              </tr>
              <tr>
                <td>
                  {{ buy.buyWorkflowChainModel.createDate }}
                </td>
                <td>
                            <span :style="{'background': buy.buyWorkflowChainModel.status==='Новый'
                                    ?'#01a9db': buy.buyWorkflowChainModel.status==='В работе'
                                    ?'#3cac71': buy.buyWorkflowChainModel.status==='Архив'
                                    ?'orange':'#d34439'}"
                                  style="color: white; padding: 1px 5px">
                                {{ buy.buyWorkflowChainModel.status }}
                            </span>
                </td>
              </tr>
            </table>

            <div v-if="buy.buyWorkflowChainModel.appealComment" style="margin-bottom:12px">
              Комментарий:
              {{ buy.buyWorkflowChainModel.appealComment }}
            </div>

            <div v-if="isShowBuyFinish" style="margin-left: 32px">
              <div v-if="buy.buyWorkflowChainModel.responsible">
                <div class="label" style="width: 100px; display: inline-block">Ответственный:</div>
                {{ buy.buyWorkflowChainModel.responsible }}
              </div>
              <div v-if="buy.buyWorkflowChainModel.financialEvaluation.maxBuyPrice">
                <div class="label" style="width: 100px; display: inline-block">Максимальная цена:</div>
                {{ buy.buyWorkflowChainModel.financialEvaluation.maxBuyPrice }}
              </div>
              <div v-if="buy.buyWorkflowChainModel.financialEvaluation.plannedSellPrice">
                <div class="label" style="width: 100px; display: inline-block">Запланированная цена:</div>
                {{ buy.buyWorkflowChainModel.financialEvaluation.plannedSellPrice }}
              </div>


              <div v-if="buy.buyWorkflowChainModel.auto.brand">
                <div class="label" style="width: 100px; display: inline-block">Модель:</div>
                {{ buy.buyWorkflowChainModel.auto.brand }} {{ buy.buyWorkflowChainModel.auto.model }}<br>
              </div>

              <div v-if="buy.buyWorkflowChainModel.auto.vin">
                <div class="label" style="width: 100px; display: inline-block">VIN:</div>
                {{ buy.buyWorkflowChainModel.auto.vin }}
              </div>

            </div>

          </div>
        </div>


      </div>

      <!--    Комиссия-->

      <br>
      <div style="border-radius: 12px; border: 3px solid #e5e5e5; padding: 4px 16px;;font-size: larger;"
           v-if="dossier && dossier.commissionChains && dossier.commissionChains.length">


        <h3 @click="isComiss = !isComiss" style="cursor: pointer">Комиссия
          <span v-if="isComiss">▼</span>
        </h3>
        <div v-for="(comiss, ind) in dossier.commissionChains" :key="ind">

          <table v-if="!isComiss" style="width: 100%; color: grey" v-show="comiss.commissionAppealChainModel">
            <tr>
              <td style="width: 100px">
                <a v-if="comiss.commissionAppealChainModel.appealId"
                   href="#/appeal/commission/{{comiss.commissionAppealChainModel.appealId}}">
                  {{ comiss.commissionAppealChainModel.appealId }} ᐅ</a>
                <span v-if="!comiss.commissionAppealChainModel.appealId">ᐅ</span>
              </td>
              <td style="width: 250px">
                Обращение:
              </td>
              <td>
                {{ comiss.commissionAppealChainModel.appealType }}
                <a
                    v-show="comiss.commissionAppealChainModel.appealId"
                    style="color: grey; text-decoration: none"
                    @click="isShowBuy = !isShowBuy"
                >
                  <span v-if="!isShowBuy">▼</span>
                  <span v-if="isShowBuy">▲</span>
                </a>
              </td>
            </tr>
            <tr>
              <td>
                {{ comiss.commissionAppealChainModel.createDate }}
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

          <div v-if="isShowBuy" style="margin-left: 32px">
            <div v-if="comiss.commissionAppealChainModel.responsible">
              <div class="label" style="width: 100px; display: inline-block">Ответственный:</div>
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
              <div class="label" style="width: 100px; display: inline-block">Максимальная цена:</div>
              {{ comiss.commissionAppealChainModel.financialEvaluation.maxBuyPrice }}
            </div>
            <div v-if="comiss.commissionAppealChainModel.financialEvaluation.plannedSellPrice">
              <div class="label" style="width: 100px; display: inline-block">Запланированная цена:</div>
              {{ comiss.commissionAppealChainModel.financialEvaluation.plannedSellPrice }}
            </div>

            <div v-if="comiss.commissionAppealChainModel.lastUpdateDate">
              <div class="label" style="width: 100px; display: inline-block">Изменен:</div>
              {{ comiss.commissionAppealChainModel.lastUpdateDate }}
            </div>
          </div>

        </div>
      </div>

      <!--    продажи -->
      <br>
      <div style="border-radius: 12px; border: 3px solid #e5e5e5; padding: 8px;font-size: larger;"
           v-if="dossier && dossier.sellWorkflowChains && dossier.sellWorkflowChains.length">
        <h3 @click="isSell = !isSell" style="cursor: pointer">Реализация
          <span v-if="isSell">▼</span>
        </h3>
        <div v-for="(sell, ind) in dossier.sellWorkflowChains" :key="ind">

          <div v-if="!isSell" style="border: 1px solid #ddd; border-radius: 5px; padding: 8px; margin: 4px 0">
            <table style="width: 100%; color: grey" v-show="sell.sellAppealChainModel">
              <tr>
                <td style="width: 100px">
                  <a v-if="sell.sellAppealChainModel.appealId"
                     href="#/appeal/{{sell.sellAppealChainModel.appealId}}">
                    {{ sell.sellAppealChainModel.appealId }} ᐅ</a>
                  <span v-if="!sell.sellAppealChainModel.appealId">ᐅ</span>
                </td>
                <td style="width: 250px">
                  Обращение
                </td>
                <td>
                  {{ sell.sellAppealChainModel.appealType }}
                  <a
                      v-show="sell.sellAppealChainModel.appealId"
                      style="color: grey; text-decoration: none"
                      @click="isShowSell = !isShowSell"
                  >
                    <span v-if="!isShowSell">▼</span>
                    <span v-if="isShowSell">▲</span>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  {{ sell.sellAppealChainModel.createDate }}
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

            <div v-if="isShowSell" style="margin-left: 32px">
              <div v-if="sell.sellAppealChainModel.responsible">
                <div class="label" style="width: 100px; display: inline-block">Ответственный:</div>
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
                {{ sell.sellAppealChainModel.lastUpdateDate }}
              </div>

              <div v-if="sell.sellAppealChainModel.appealComment">
                <div class="label" style="width: 100px; display: inline-block">Комментарий:</div>
                {{ sell.sellAppealChainModel.appealComment }}
              </div>
            </div>
            <!--      /////////////1/////////////////      -->

            <table style="width: 100%; color: grey" v-show="sell.sellCreditChainModel">
              <tr>
                <td style="width: 100px">
                  <a v-if="sell.sellCreditChainModel.creditID"
                     href="#/credit-application/general/{{sell.sellCreditChainModel.creditID}}">
                    {{ sell.sellCreditChainModel.creditID }} ᐅ</a>
                  <span v-if="!sell.sellCreditChainModel.creditID">ᐅ</span>
                </td>
                <td style="width: 250px">
                  Кредит
                </td>
                <td>
                  {{ sell.sellCreditChainModel.appealType }}
                  <a
                      v-show="sell.sellCreditChainModel.creditID"
                      style="color: grey; text-decoration: none"
                      @click="isShowCredit = !isShowCredit"
                  >
                    <span v-if="!isShowCredit">▼</span>
                    <span v-if="isShowCredit">▲</span>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  {{ sell.sellCreditChainModel.createDate }}
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

            <div v-if="isShowCredit" style="margin-left: 32px">
              <div v-if="sell.sellCreditChainModel.responsible">
                <div class="label" style="width: 100px; display: inline-block">Ответственный:</div>
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
                {{ sell.sellCreditChainModel.lastUpdateDate }}
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
            <!--      /////////////2/////////////////      -->


            <table style="width: 100%; color: grey" v-show="sell.sellRealizationChainModel">
              <tr>
                <td style="width: 100px">
                  <a v-if="sell.sellRealizationChainModel.realizationId"
                     href="#/realization/general/{{sell.sellRealizationChainModel.realizationId}}">
                    {{ sell.sellRealizationChainModel.realizationId }} ᐅ</a>
                  <span v-if="!sell.sellRealizationChainModel.realizationId">ᐅ</span>
                </td>
                <td style="width: 250px">
                  Реализация
                </td>
                <td>
                  {{ sell.sellRealizationChainModel.appealType }}
                  <a
                      v-show="sell.sellRealizationChainModel.realizationId"
                      style="color: grey; text-decoration: none"
                      @click="isShowReal = !isShowReal"
                  >
                    <span v-if="!isShowReal">▼</span>
                    <span v-if="isShowReal">▲</span>
                  </a>
                </td>
              </tr>

              <tr>
                <td>
                  {{ sell.sellRealizationChainModel.createDate }}
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

            <div v-if="isShowReal" style="margin-left: 32px">
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
                {{ sell.sellRealizationChainModel.lastUpdateDate }}
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

const globalStore = useGlobalStore()
const isOpen = ref(false)
const dossier = ref([])
const isWaiter = ref(false)
const closeModal = () => isOpen.value = false
const title = ref('')
const subtitle = ref('')

function open(clientId) {
  console.log('clieentId = ', clientId)
  isOpen.value = true
  title.value = 'История сделок с клиентом ' + clientId
  subtitle.value = name

  globalStore.getLeadActivityHistory(clientId).then(res => {
    console.log('res = ', res)
    dossier.value = res.data
  })
  // adminStore[method](id)
}

function listChange(list) {
  let txt = ''
  list.forEach(item => {
    txt += ' <b>' + item.description + ' : </b> ' +
        '<span class="border-val">' + item.oldValue + '</span> ➔  <span class="border-val">' +
        item.newValue + '</span><br>'
  })
  return txt

}


defineExpose({open})

</script>