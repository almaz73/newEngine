<template>

  <div>
    <el-collapse v-model="activeCollapse">

      <el-collapse-item
          :title="'&nbsp; Автомобиль'+(appeal.carBrandModel?': &nbsp; '+appeal.carBrandModel:'')"
          name="1">
        <div style="display: flex; flex-wrap: wrap">

          <table class="sell_table" style="flex-grow: 2">
            <tbody>
            <tr>
              <td style="width: 50% ">
                <div class="head">
                  <div v-if="!selectedCar">
                    <div class="cell_plus green">+</div>
                    Выбрать автомобиль
                  </div>
                  <div v-else>
                    {{ selectedCar.workflow.auto.carBrand }} {{ selectedCar.workflow.auto.carModel }}
                    ({{ selectedCar.workflow.auto.vin }})

                    <DeleteCtrl @click="deleteSellInAppeal()"/>
                  </div>

                </div>

                Цена: {{ selectedCar && selectedCar.workflow.priceMarketOnSale || 0 }} руб.
              </td>

              <td>
                <div class="head">
                  <div class="cell_plus green">+</div>
                  Автомобиль в зачет
                </div>
                Отсутствует выбранный автомобиль
              </td>
            </tr>

            <tr>
              <td>
                <div class="head">
                  <div class="cell_plus green">+</div>
                  Доп оборудование
                </div>
                Отсутствует доп. оборудование
              </td>

              <td>
                <div class="head">
                  <div class="cell_plus green">+</div>
                  Финансовые условия
                </div>
                Отсутствует кредитная заявка
              </td>
            </tr>
            <tr>
              <td colspan="2" style="text-align: center; border: none">
                <el-button type="info" style="width: 100%">Добавить реализацию</el-button>
              </td>

            </tr>
            </tbody>
          </table>

          <div style="text-align: center; flex-grow: 1">
            <h3>Предпочтения клиента
              <el-button size="small" :icon="Plus"></el-button>
            </h3>
            0000000 000000000000 00000000000000 000000000000000<br> 000000000000000000000 000000000000000000000
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<style>
.cell_plus {
  width: 20px;
  padding: 0 4px;
  font-size: 35px;
  display: inline-block;
  line-height: 25px;
  vertical-align: top;
  font-weight: bolder;
  cursor: pointer;
}

.cell_plus.green {
  color: green;
}

.sell_table {
  border-spacing: 10px;
}


.sell_table tr, .sell_table tr {
  margin: 0 30px;
}

.sell_table .head {
  color: #555;
}

.sell_table td {
  border: 3px solid #bbb;
  padding: 4px 12px;
  color: var(--main-color)

}
</style>

<script setup lang="ts">
import {ref} from 'vue'
import {useAppealStore} from "@/stores/appealStore";
import {Plus} from "@element-plus/icons-vue";
import DeleteCtrl from "@/controls/DeleteCtrl.vue";

const activeCollapse = ref('1')
const appealStore = useAppealStore()
const {appeal} = defineProps(['appeal'])
const selectedCar = ref<any>(null)

function deleteSellInAppeal() {
  // appealId      :      "392944"
  // sellId      :      1655
  // type      :      20
  appealStore.deleteSellInAppeal(appeal.id, selectedCar.value.id, selectedCar.value.type).then(res => {
    console.log('res = ', res)
    selectedCar.value = null
  })

  //  ng-click="sellInAppealClick(blocks.selectedCar, sellInAppealEnum.SellSelected, 'delete');"
}

appealStore.getSellInAppeal(appeal.id).then(res => {
  console.log('res = ', res)
  selectedCar.value = res.data.items[0]

  console.log('selectedCar.value = ', selectedCar.value)
})

// https://dev.autonet.pro/api/sellinappeal/getSellInAppeal?appealId=392944&id=

// https://dev.autonet.pro/api/sellinappeal/getSellInAppeal?appealId=392944&id=
// https://dev.autonet.pro/api/sellinappeal/getSellInAppeal?appealId=392944&id=

</script>

