<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="520"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
          <small>
            <div class="info-filed">
              <label class="label l_300"> Цена продажи (план) руб.</label>
              <el-input
                  v-model="priceMarket"
                  @input="()=>{priceMarket=numberWithSpaces(priceMarket);calcMargin()}"/>
            </div>

            <div class="info-filed">
              <label class="label l_300"> Максимальная цена выкупа</label>
              <el-input v-model="mod.maxPriceBought"
                        @change="calcMargin()"
                        @input="()=>{mod.maxPriceBought=numberWithSpaces(mod.maxPriceBought);calcMargin()}"/>
            </div>

            <div class="info-filed">
              <label class="label l_300"> Наценка, руб</label>
              <el-input v-model="mod.margin" readonly/>
            </div>

            <div class="info-filed" v-if="plannedPreSaleCosts">
              <label class="label l_300"> Предполагаемые расходы</label>
              &nbsp; &nbsp{{ plannedPreSaleCosts }} руб.
            </div>



            <div class="info-filed">
              <label class="label l_300"> Шаблон комментария</label>

              <el-select
                  v-model="mod.comment"
                  style="width: 190px"
              >
              <el-option
                  v-for="item in AnalystCommentTemplates"
                  :key="item.id"
                  style="width: 360px;"
                  :label="item.value"
                  :value="item.value"
                  :title="item.value"

              />
              </el-select>
            </div>



          </small>

            <small class="label-right l_100">Комментарий</small>
            <el-input
                style="width: 380px;float: right;"
                v-model="mod.comment"
                type="textarea"
                placeholder="Введите комментарий">
            </el-input>

          <br><br>
          <el-divider/>

          <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
          </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/AppModal.vue'
import {ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'
import {useAppealStoreStatus} from '@/stores/appealStoreStatus'
import {useGlobalStore} from '@/stores/globalStore'
import {useDealStore} from '@/stores/dealStore'
import {numberNoSpace, numberWithSpaces} from '@/utils/globalFunctions'

const dealStore = useDealStore()
const globalStore = useGlobalStore()
const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false)
const priceMarket = ref('')
const mod = ref({})
const closeModal = () => isOpen.value = false
const plannedPreSaleCosts = ref(0)
const matrix = ['A - Срочно выкуп', 'B - Рекомендуемый выкуп', 'C- Выкуп', 'D- Ограничено', 'S- Запрет выкупа']
const mileageRate = ref([])
const turnoverRate = ref([])
const categoryPrecent = ref(null)
const autoCategoryName = ref('')
const Kf_root = ref({
  LocationMatrix: [],
  LocationCategory: [],
  localeMileageRate: [],
  localeTurnoverRate: []
})
const minMargin = ref(40001);

const AnalystCommentTemplates = [
  {
    id: 10,
    value: 'Расчёт выполнен предварительно, окончательный расчёт после комплексной диагностики и осмотра в чистом виде.'
  },
  {
    id: 2010,
    value: 'Расчёт выполнен предварительно с наценкой'
  },
  {
    id: 3010,
    value: 'Автомобиль высоколиквидный, возможно согласование специальных условий. При отрицательных результатах переговоров, связаться с руководителем.'
  }
]


if (Kf_root.LocationCategory) {
  categoryPrecent.value = Kf_root.LocationCategory['category' + autoCategoryName.value]
}


function calcMargin() {
  var placeM = numberNoSpace(priceMarket.value);
  var maxPriceBought = mod.value.maxPriceBought && numberNoSpace(mod.value.maxPriceBought);

  if (placeM > 0 && maxPriceBought > 0) {
    mod.value.margin = numberWithSpaces(placeM - maxPriceBought - plannedPreSaleCosts.value);
  } else mod.value.margin = '';
}


function open(val, deal) {
  priceMarket.value = numberWithSpaces(deal.priceMarket)
  mod.value = val
  mod.value.dealId = deal.dealId
  isOpen.value = true

  // Предполагаемые расходы (Перегон, Мойка, химчиска, полировка, подготовка...)
  plannedPreSaleCosts.value = 0
  dealStore.getPlannedWork(deal.dealId).then(res => {
    res.data.items.forEach(res => plannedPreSaleCosts.value += res.price)
    plannedPreSaleCosts.value = numberWithSpaces(plannedPreSaleCosts.value)
    calcMargin()
  })


  dealStore.GetMileageRate(dealStore.deal.locationId).then(res => mileageRate.value = res.data.models)
  dealStore.GetTurnoverRate(dealStore.deal.locationId).then(res => turnoverRate.value = res.data.models)

  mod.value.maxPriceBought = numberWithSpaces(dealStore.deal.maxPriceBought)
}

function save() {
  let params = {
    comment: mod.value.comment,
    id: mod.value.dealId,
    newStatus: mod.value.id,
    priceMarket: numberNoSpace(priceMarket.value),
    MaxPriceBought: numberNoSpace(mod.value.maxPriceBought)
  }


  globalStore.isWaiting = true
  appealStoreStatus.setStatus(params).then(res => {
    globalStore.isWaiting = false
    if (res.status === 200) location.reload()
  })
}


defineExpose({open})


</script>