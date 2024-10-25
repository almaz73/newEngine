<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="630"
            :top="40"
            :title="mod.name"
            draggable>
    <div>
        <span class="modal-field">
          <small>
            <div v-if="attentionActive" style="background: pink; padding: 10px; text-align: center;">
                Наценка ниже минимального уровня!
            </div>

            <div class="info-filed">

              <label class="label l_300"> Цена продажи (план) руб.</label>
              <el-input v-model="priceMarket"
                        @input="()=>{priceMarket=numberWithSpaces(priceMarket); changeDatas()}" />
            </div>

            <div class="info-filed" v-if="plannedPreSaleCosts">
              <label class="label l_300"> Предполагаемые расходы</label>
              &nbsp; {{ plannedPreSaleCosts }} руб.
            </div>
            <div class="info-filed" ng-if="!plannedPreSaleCosts" style="background: #ffe; padding-left: 180px;">
              Предполагаемые расходы на заложены
            </div>

            <div class="info-filed">
              <label class="label l_300"> Матрица</label>
               <el-select
                 style="width: 200px"
                 placeholder="Выберите значение"
                 v-model="mod.matrixEl"
                 :filterable="!globalStore.isMobileView"
                 @change="changeDatas()"
                 clearable
               >
              <el-option v-for="(loc, id) in matrix" :key="id" :label="loc" :value="loc" />
            </el-select>  &nbsp; &nbsp;
            <span v-if="matrixPrecent"> &nbsp;{{ matrixPrecent }} %</span>
            <span>&nbsp;{{ dealStore.deal.buyCategoryTitle }}</span>
            </div>

            <div class="info-filed" v-if="mod.normEl">
              <label class="label l_300"> История</label>
              <span style="width: 176px; padding: 12px;">{{ mod.normEl.typeTitle }}</span>
              <span> &nbsp; &nbsp; {{ mod.normEl.rate != undefined ? mod.normEl.rate + '%' : '' }}</span>
                        <div title="ДТП: отсутствует
Расчеты: отсутствует
Страховые выплаты: отсутствует
Собственники: не более одного на 3 года эксплуатации"
                             v-if="exploitationHistoryType===0"
                             style="width: 30px;height:16px; margin-left:19px;background:green;display:inline-block;"></div>
                        <div title="ДТП: отсутствуют красные, не более 2х дтп, не более 3 элементов в общем
Расчеты: Не более 10% от стоимости авто. Отсутствуют силовые элементы
Страховые выплаты: Не более 10% от стоимости авто
Собственники: не более одного на 2 года эксплуатации" v-if="exploitationHistoryType===10"
                             style="width: 30px;height:16px; margin-left:19px;background:yellow;display:inline-block;"></div>
                        <div title="Расчеты:Х
Страховые выплаты: Х
Собственники: Х
Такси, каршеринг, аукцион битых, угон, тотал, ввезенка" v-if="exploitationHistoryType===20"
                             style="width: 30px;height:16px; margin-left:19px;background:red;display:inline-block;"></div>

            </div>

            <div class="info-filed">
              <label class="label l_300"> Оборачиваемость</label>
               <el-select
                 style="width: 200px"
                 placeholder="Выберите значение"
                 v-model="mod.turnEl"
                 @change="changeDatas()"
                 clearable
               >
                <el-option v-for="loc in turnoverRate" :key="loc.id" :label="loc.typeTitle" :value="loc" />
               </el-select>

            <span v-if="mod.turnEl">
              &nbsp; &nbsp; {{ mod.turnEl.rate != undefined ? mod.turnEl.rate + '%' : '' }} </span>
            </div>

            <div class="info-filed" style="height: 40px">
              <label class="label l_300"> Категория</label>
              <CircleCateforyAvtoCtrl :categoryNumber="dealStore.deal.auto.categoryAuto" />
              <span v-if="categoryPrecent"> &nbsp; &nbsp; &nbsp; {{ categoryPrecent }} %</span>
            </div>

            <div class="info-filed">
              <label class="label l_300"> Наценка</label>
                &nbsp; {{ numberWithSpaces(margin) }} руб.
            </div>

            <div class="info-filed">
              <label class="label l_300"> Максимальная цена выкупа</label>
              <el-input v-model="mod.priceHand"
                        @input="()=>{mod.priceHand=numberWithSpaces(mod.priceHand); changeDatas(true)}" />
              <span> &nbsp; &nbsp; &nbsp;{{ allProcent <= 1 ? 1 : allProcent }} %</span>
            </div>

          </small>

            <small class="label-right l_100">Комментарий</small>
            <el-input
              style="width: 480px;float: right;"
              v-model="mod.comment"
              :rows="5"
              type="textarea"
              placeholder="Введите комментарий">
            </el-input>
          <div style="clear: both"></div>

          <UploadSсreenShot ref="uploadSсreenShot"/>

          <span class="modal-buttons-bottom">
          <el-button type="danger" @click="saveButtonClick()" :icon="Plus">Сохранить</el-button>
          <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
        </span>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from '@/components/AppModal.vue'
import { computed, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useAppealStoreStatus } from '@/stores/appealStoreStatus'
import { useGlobalStore } from '@/stores/globalStore'
import CircleCateforyAvtoCtrl from '@/controls/CircleCateforyAvtoCtrl.vue'
import { useDealStore } from '@/stores/dealStore'
import { numberWithSpaces, numberNoSpace } from '@/utils/globalFunctions'
import UploadSсreenShot from '@/components/UploadSсreenShot.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dealStore = useDealStore()
const globalStore = useGlobalStore()
const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false)
const priceMarket = ref(null)
const mod = ref({ matrixEl: null, normEl: null, turnEl: null })
const closeModal = () => isOpen.value = false
const plannedPreSaleCosts = ref(0)
const matrix = ['A - Срочно выкуп', 'B - Рекомендуемый выкуп', 'C- Выкуп', 'D- Ограничено', 'S- Запрет выкупа']
const mileageRate = ref([])
const turnoverRate = ref([])
const categoryPrecent = ref(null)
const Kf_root = {
  LocationMatrix: [],
  LocationCategory: [],
  mileageRate: [],
  turnoverRate: []
}
const matrixPrecent = ref(0)
const cashe = {}
const margin = ref(0)
const allProcent = ref(0)
const exploitationHistoryType = ref(0)
const computedPrice = ref(0)
const isMatrix = ref(false)
const minMargin = 40001 // Минимальная наценка, чтобы предупредить оператора
const attentionActive = computed(() => margin.value < minMargin)
const uploadSсreenShot = ref(null)


function changeSum() {
  if (!priceMarket.value) return false

  let fullSumm = priceMarket.value.replace(/ /g, '')
  priceMarket.value = String(fullSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')

  categoryPrecent.value = 0
  matrixPrecent.value = 0


  const promise1 = new Promise(resolve => {
    if (cashe['MarkupMatrix_' + fullSumm + dealStore.deal.buyCategory] != undefined) {
      Kf_root.LocationMatrix = cashe['MarkupMatrix_' + fullSumm + dealStore.deal.buyCategory]
      isMatrix.value = !!cashe['MarkupMatrix_' + fullSumm + dealStore.deal.buyCategory]
      resolve()
    } else {
      dealStore.GetMarkupMatrix(dealStore.deal.storageId, fullSumm, dealStore.deal.buyCategory).then(res => {
        if (res !== undefined) {
          Kf_root.LocationMatrix = res
          cashe['MarkupMatrix_' + fullSumm + dealStore.deal.buyCategory] = res
          isMatrix.value = !!res
        }
        resolve()
      })
    }

  })


  const promise2 = new Promise(resolve => {
    if (cashe['MarkupCategory_' + fullSumm] != undefined) {
      Kf_root.LocationCategory = cashe['MarkupCategory_' + fullSumm]
      resolve()
    } else {
      dealStore.GetMarkupCategory(dealStore.deal.locationId, fullSumm).then(res => {
        if (res) Kf_root.LocationCategory = res
        cashe['MarkupCategory_' + fullSumm] = res
        resolve()
      })
    }
  })

  const promise3 = new Promise(resolve => {
    if (cashe['TurnoverRate_'] != undefined) {
      turnoverRate.value = cashe['TurnoverRate_'].models
      resolve()
    } else {
      dealStore.GetTurnoverRate(dealStore.deal.locationId).then(res => {
        if (res && res.data != undefined) {
          cashe['TurnoverRate_'] = res.data
          turnoverRate.value = res.data.models //localeTurnoverRate
        }
        if (res && res.data) turnoverRate.value = res.data.models //localeTurnoverRate
        resolve()
      })
    }
  })

  const promise4 = new Promise(resolve => {
    if (cashe['MileageRate_'] != undefined) {
      mileageRate.value = cashe['MileageRate_'].models
      resolve()
    } else {
      dealStore.GetMileageRate(dealStore.deal.locationId).then(res => {
        if (res && res.data != undefined) {
          mileageRate.value = res.data.models
          cashe['MileageRate_'] = res.data
        }
        resolve()
      })
    }
  })

  Promise.all([promise1, promise2, promise3, promise4]).then(() => {
    changeDatas()
    isOpen.value = true
  })
}


function getCategoryAuto() {
  return ['_', 'A', 'B', 'C', 'D', 'S'][dealStore.deal.auto.categoryAuto]
}


// расчеты при изменениях
function changeDatas(isPriceHand) {
  if (!priceMarket.value) return false
  if (!isPriceHand) mod.value.priceHand = null

  let fullSumm = priceMarket.value.replace(/ /g, '')
  allProcent.value = 0

  if (Kf_root.LocationCategory) {
    categoryPrecent.value = Kf_root.LocationCategory['category' + getCategoryAuto()]
  }

  allProcent.value += categoryPrecent.value

  if (mod.value.matrixEl && Kf_root.LocationMatrix) {
    matrixPrecent.value = Kf_root.LocationMatrix['category' + mod.value.matrixEl.slice(0, 1)]
    allProcent.value += matrixPrecent.value
  }

  //  выбираем нужную позицию истории, чтобы вставить в расчеты
  if (mileageRate.value && mileageRate.value.length) {
    mod.value.normEl = mileageRate.value.find(el => el.type === exploitationHistoryType.value)

    if (!mod.value.normEl) {
      console.warn('exploitationHistoryType=' + exploitationHistoryType.value + ' Нет данных для данной организации, не заполнена таблица Истоирия эксплауатации в настройках')
    }
  }

  if (mod.value.normEl) allProcent.value += mod.value.normEl.rate
  if (mod.value.turnEl) allProcent.value += mod.value.turnEl.rate

  if (allProcent.value <= 1) {
    computedPrice.value = parseInt(fullSumm / 1.01)
  } else {
    computedPrice.value = Math.round(Number(fullSumm) / (1 + allProcent.value / 100)) - numberNoSpace(plannedPreSaleCosts.value)
  }

  mod.value.priceHand = numberWithSpaces(mod.value.priceHand !== null ? mod.value.priceHand : parseInt(computedPrice.value))
  margin.value = priceMarket.value.replace(/ /g, '') - computedPrice.value
  setComment()
}


function setComment() {
  mod.value.comment = `👉 Предполагаемые расходы : ${numberWithSpaces(plannedPreSaleCosts.value)} руб.`
  mod.value.comment += `\n👉 Категория автомобиля (${getCategoryAuto()}):  ${categoryPrecent.value} %`
  if (mod.value.matrixEl) mod.value.comment += `\n👉 Матрица (${mod.value.matrixEl}):  ${matrixPrecent.value} %.`
  if (mod.value.normEl) mod.value.comment += `\n👉 История (${mod.value.normEl.typeTitle}):  ${mod.value.normEl.rate} %.`
  if (mod.value.turnEl) mod.value.comment += `\n👉 Норма оборачиваемости (${mod.value.turnEl.typeTitle}):  ${mod.value.turnEl.rate} %.`
  if (allProcent.value <= 1) mod.value.comment += `\n👉 Наценка:  1 %.`
  if (allProcent.value > 1) mod.value.comment += `\n👉 Общая наценка:  ${allProcent.value} %.`

  if (numberNoSpace(mod.value.priceHand) !== parseInt(computedPrice.value)) mod.value.comment += `\n👉 👆 Максимальная цена выкупа отредактирована`
}

function open(val, deal) {
  mod.value = val
  priceMarket.value = numberWithSpaces(deal.priceMarket)
  exploitationHistoryType.value = dealStore.deal.auto.exploitationHistoryType || 0
  plannedPreSaleCosts.value = 0// Предполагаемые расходы (Перегон, Мойка, химчиска, полировка, подготовка...)
  dealStore.getPlannedWork(deal.dealId).then(res => {
    res.data.items.forEach(res => plannedPreSaleCosts.value += res.price)
    plannedPreSaleCosts.value = numberWithSpaces(plannedPreSaleCosts.value)
    changeSum()
  })
}

function checkBeforeSave() {
  if (Kf_root.LocationMatrix.id && !mod.value.matrixEl) return ElMessage.warning('Поле "Матрица" обязателен для заполнения')
  if (mileageRate.value && mileageRate.value.length && !mod.value.normEl) return ElMessage.warning('Поле "История" обязателен для заполнения')
  if (turnoverRate.value && turnoverRate.value.length && !mod.value.turnEl) return ElMessage.warning('Поле "Оборачиваемость" обязателен для заполнения')
}

function save() {
  if(checkBeforeSave()) return false
  uploadSсreenShot.value.saveScreens()

   let params = {
     comment: mod.value.comment,
     maxPriceBought: numberNoSpace(mod.value.priceHand),
     priceMarket: numberNoSpace(priceMarket.value),
     id: dealStore.deal.id,
     newStatus: mod.value.id
   }
  
  globalStore.isWaiting = true
   appealStoreStatus.setStatus(params).then(res => {
    globalStore.isWaiting = false
    if (res.status === 200) location.reload()
   })
}


function saveButtonClick() {
  if (margin.value < minMargin) {
    ElMessageBox.confirm('Наценка ниже минимального уровня, вы хотите продолжить?', 'Внимание', {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет'
    })
      .then(res => res && save())
  } else save()
}


defineExpose({ open })


</script>