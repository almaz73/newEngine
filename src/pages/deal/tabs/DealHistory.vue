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
          <el-table-column label="Пользователь">
            <template #default="scope">
              {{ scope.row.userFirstName }} {{ scope.row.userLastName }}
            </template>
          </el-table-column>
          <el-table-column label="Дата" width="200">
            <template #default="scope">
              {{ formatDMY_hm(scope.row.dateOfChanges) }}
            </template>
          </el-table-column>
          <el-table-column label="Параметр">
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
        История изменений статуса
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
  background: blue;
}


</style>

<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'
import {formatDMY_hm} from '@/utils/globalFunctions'
import {ref} from 'vue'
import CircleCateforyAvtoCtrl from '@/controls/CircleCateforyAvtoCtrl.vue'

const dealStore = useDealStore()
const radio = ref(10)
const tableDataDeal = ref([])
const tableData = ref([])
const activeName = ref('tab_1')
const isShowBeige = ref(null)

function tableRowClassName(val) {
  if (isShowBeige.value == 1 && val.row.isAnother) return 'beige-fon'
  if (isShowBeige.value == 2 && val.row.isAnother) return 'beige-fon row-hide'
}

function tabClick(val: any) {
  if (val.props.name === 'tab_2') getGrade()
}

function getSimularDeals() {

  if (isShowBeige.value) isShowBeige.value = isShowBeige.value === 1 ? 2 : 1
  !isShowBeige.value && dealStore.getSimularDeals(dealStore.deal.dealId).then(res => {
    res.items.forEach(el => {
      isShowBeige.value = 1
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

