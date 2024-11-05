<template>
  <div>


    <el-tabs type="border-card" @tab-click="tabClick" v-model="activeName">
      <el-tab-pane label="История сделок" name="tab_1">
        <h3>История сделок</h3>
        <el-button
            style="background: beige"
            @click="getSimularDeals()"
            size="small">История сделок по аналогичным автомобилям
        </el-button>
        <el-table
            :data="tableDataDeal"
            :row-class-name="tableRowClassName"
            empty-text="Нет данных"
            highlight-current-row>

          <el-table-column label="Дата">
            <template #default="scope">
              {{ formatDMY_hm(scope.row.createDate) }}
            </template>
          </el-table-column>
          <el-table-column label="Город" prop="locationCity"/>
          <el-table-column label="Менеджер">
            <template #default="scope">
              <span style="white-space: nowrap"
                    :title="scope.row.managerFullName">{{ scope.row.managerFullName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="Пробег" prop="additionalAutoInfo.mileageAuto"/>
          <el-table-column label="Категория" prop="auto.categoryAuto">
            <template #default="scope">
              <CircleCateforyAvtoCtrl :categoryNumber="scope.row.auto.categoryAuto"/>
            </template>
          </el-table-column>

          <el-table-column label="Цена выкупа" prop="maxPriceBought"/>
          <el-table-column label="Цена продажи" prop="priceMarket"/>

        </el-table>

      </el-tab-pane>
      <el-tab-pane label="История изменений данных" name="tab_2">
        <h3>История изменения данных</h3>
        <el-radio-group v-model="radio" size="small">
          <el-radio-button @click="getGrade()" label="Оценка" value="10"/>
          <el-radio-button @click="getAuto()" label="Авто" value="20"/>
        </el-radio-group>

        <el-table
            style="margin-top: 24px"
            :data="tableData"
            empty-text="Нет данных"
            highlight-current-row
        >
          <el-table-column label="Пользователь"  min-width="100">
            <template #default="scope">
              {{ scope.row.userFirstName }} {{ scope.row.userLastName }}
            </template>
          </el-table-column>
          <el-table-column label="Дата" min-width="100">
            <template #default="scope">
              {{ formatDMY_hm(scope.row.dateOfChanges) }}
            </template>
          </el-table-column>
          <el-table-column label="Параметр"  min-width="200">
            <template #default="scope">
              <div v-for="value in scope.row.values">
                {{ value.property }} : &nbsp; &nbsp;
                <span class="border-val">{{ value.oldValue || '' }}</span>
                ➔
                <span class="border-val">{{ value.newValue }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="История изменений статуса" name="tab_3">
        <h3>История изменений статуса</h3>
        <el-table
            style="margin-top: 24px"
            :data="tableDataWorkflow"
            empty-text="Нет данных"
            highlight-current-row
        >
          <el-table-column label="Пользователь" prop="userTitle" maxWidth="150"/>
          <el-table-column label="Статус" prop="statusTitle" maxWidth="250"/>
          <el-table-column label="Дата начала">
            <template #default="scope">
              {{ formatDMY_hm(scope.row.dateStart) }}
            </template>
          </el-table-column>
          <el-table-column label="Дата окончания">
            <template #default="scope">
              {{ formatDMY_hm(scope.row.dateEnd) }}
            </template>
          </el-table-column>
          <el-table-column label="Длительность">
            <template #default="scope">
              <div v-if="scope.row.duration">
                <span v-if="scope.row.duration.days">
                  {{ scope.row.duration.days }} д.
                </span>
                <span v-if="scope.row.duration.hours">
                  {{ scope.row.duration.hours }} ч.
                </span>
                <span v-if="scope.row.duration.minutes">
                  {{ scope.row.duration.minutes }}
                  <span v-if="scope.row.duration.hours">мин.</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="Комментарий" prop="comment" minWidth="200">
            <template #default="scope">
              <span v-if="scope.row.workflowStatus==40">
                    Цена продажи: {{ scope.row.priceMarket }} руб.<br/>
                    Макс. цена выкупа: {{ scope.row.maxPriceBought }} руб.
                </span>
              <br/>

              <span v-if="scope.row.type == 'workflow' && scope.row.description">
                {{ scope.row.description }}<br/>
              </span>

              <span v-if="scope.row.type == 'workflow'"
                    style="color:#a12d24">
                {{ scope.row.comment }}
              </span>

              <div v-if="scope.row.commentDanger" style="background: yellow">
                Автомобиль запрещен к выкупу, только через согласование руководителя.
              </div>

              <span v-if="scope.row.type == 'event' && scope.row.description">
                    Описание: {{ scope.row.description }}<br/>
              </span>

              <span v-if="scope.row.type == 'event' && scope.row.comment">
                Комментарий: {{ scope.row.comment }}
              </span>

              <span v-if="scope.row.workflowStatus==75">
                Цена клиента: {{ scope.row.priceDemanded }} руб.
              </span>

              <span v-if="scope.row.workflowStatus==50">
                Договорная цена выкупа: {{ scope.row.priceDemanded }} руб.
              </span>

              <span v-if="scope.row.workflowStatus==310">
                    Установлена цена продажи: {{ scope.row.priceMarketOnSale }} руб.
              </span>

              <span v-if="scope.row.workflowStatus==320">
                    Сумма согласованная с клиентом: {{ scope.row.priceFactOnSale }} руб.
              </span>

              <span v-if="scope.row.workflowStatus==350">
                Сумма предоплаты: {{ scope.row.reservePrepayment }} руб.
              </span>

              <span v-if="scope.row.workflowStatus==16">
                Причина: {{ scope.row.archiveRequest }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

    </el-tabs>


  </div>
</template>

<style>
.beige-fon {
  background: beige !important;
}

.row-hide {
  display: none;
}


</style>

<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'
import {formatDMY_hm} from '@/utils/globalFunctions'
import {ref} from 'vue'
import CircleCateforyAvtoCtrl from '@/controls/CircleCateforyAvtoCtrl.vue'
import {ElMessage} from 'element-plus'

const dealStore = useDealStore()
const radio = ref(10)
const tableDataWorkflow = ref([])
const tableDataDeal = ref([])
const tableData = ref([])
const activeName = ref('tab_1')
const isShowBeige = ref(null)
let analogLength = 0;

function tableRowClassName(val) {
  if (isShowBeige.value == 1 && val.row.isAnother) return 'beige-fon'
  if (isShowBeige.value == 2 && val.row.isAnother) return 'beige-fon row-hide'
}

function tabClick(val: any) {
  if (val.props.name === 'tab_2') getGrade()
  if (val.props.name === 'tab_3') getWorkflowHistory()
}

function getWorkflowHistory() {
  dealStore.getWorkflowHistory(dealStore.deal.dealId).then(res => {
    tableDataWorkflow.value = res.data.items
    tableDataWorkflow.value.map(el => { // выделяем в отдельную строку
      if (el.comment && el.comment.includes('Автомобиль запрещен к выкупу')) {
        el.comment = el.comment.replace('Автомобиль запрещен к выкупу, только через согласование руководителя.', '')
        el.commentDanger = true
      }
    })

    console.log('tableDataWorkflow.value', tableDataWorkflow.value);
  })
}

function getSimularDeals() {
  if (isShowBeige.value) isShowBeige.value = isShowBeige.value === 1 ? 2 : 1
  if (isShowBeige.value && !analogLength) ElMessage.warning('Нет данных по аналогичным автомобилям')

  !isShowBeige.value && dealStore.getSimularDeals(dealStore.deal.dealId).then(res => {
    isShowBeige.value = 1
    analogLength = res.data.items.length
    res.data.items.forEach(el => {
      tableDataDeal.value.push({
        createDate: el.createDate,
        locationCity: el.city,
        auto: {categoryAuto: el.categoryAuto.value, autoId: el.autoId},
        id: el.id,
        managerFullName: el.managerFullName,
        maxPriceBought: el.maxPriceBought,
        priceMarket: el.priceMarket,
        additionalAutoInfo: {mileageAuto: el.mileage},
        isAnother: true,
        dealId: el.id
      })
    })

    tableDataDeal.value.sort((a, b) => new Date(a.createDate) > new Date(b.createDate) ? 1 : -1)
  })
}

function open() {
  dealStore.getDealsByVin(dealStore.deal.dealId).then(res => {
    tableDataDeal.value = res.data.items
    tableDataDeal.value.sort((a, b) => new Date(a.createDate) > new Date(b.createDate) ? 1 : -1)
  })

}

function getGrade() {
  dealStore.getBuyEditHistory(dealStore.deal.dealId).then(res => {
    tableData.value = res.items
  })
}

function getAuto() {
  dealStore.getBuyAutoEditHistory(dealStore.deal.dealId).then(res => {
    tableData.value = res.items
  })
}

defineExpose({open})

</script>

