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
              <el-input v-model="priceMarket" @input="()=>priceMarket=numberWithSpaces(priceMarket)" />
            </div>

            <div class="info-filed" v-if="plannedPreSaleCosts">
              <label class="label l_300"> Предполагаемые расходы</label>
              &nbsp; &nbsp; {{ plannedPreSaleCosts }} руб.
            </div>

            <div class="info-filed">
              <label class="label l_300"> Матрица</label>
               <el-select
                 style="width: 200px"
                 placeholder="Выберите значение"
                 v-model="mod.carBrandId"
                 :filterable="!globalStore.isMobileView"
                 @change="changeBrand(mod.carBrandId)"
                 clearable
               >
              <el-option v-for="(loc, id) in matrix" :key="id" :label="loc" :value="loc" />
            </el-select>

            </div>

            <div class="info-filed">
              <label class="label l_300"> История</label>
               <el-select
                 style="width: 200px"
                 placeholder="Выберите значение"
                 v-model="mod.normEl"
                 @change="changeBrand(mod.normEl)"
                 clearable
               >
                <el-option v-for="loc in mileageRate" :key="loc.id" :label="loc.typeTitle" :value="loc.id" />
               </el-select>

            </div>

            <div class="info-filed">
              <label class="label l_300"> Оборачиваемость</label>
               <el-select
                 style="width: 200px"
                 placeholder="Выберите значение"
                 v-model="mod.turnEl"
                 @change="changeBrand(mod.turnEl)"
                 clearable
               >
                <el-option v-for="loc in turnoverRate" :key="loc.id" :label="loc.typeTitle" :value="loc.id" />
               </el-select>
            </div>

            <div class="info-filed">
              <label class="label l_300"> Категория</label>
                &nbsp; &nbsp; {{ autoCategoryName }}
              <span v-if="categoryPrecent"> &nbsp; &nbsp; &nbsp; {{ categoryPrecent }} %</span>
            </div>

            <div class="info-filed">
              <label class="label l_300"> Наценка</label>
              <el-input v-model="mod.comment" />
            </div>

            <div class="info-filed">
              <label class="label l_300"> Максимальная цена выкупа</label>
              <el-input v-model="mod.comment" />
            </div>

          </small>

            <small class="label-right l_100">Комментарий</small>
            <el-input
              style="width: 380px;float: right;"
              v-model="mod.comment"
              type="textarea"
              placeholder="Введите комментарий">
            </el-input>
          <div style="clear: both"></div>

            <el-upload
              class="upload-demo"
              drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              multiple
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                Перетащите файл сюда или <em>нажмите, чтобы загрузить</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  jpg/png files with a size less than 500kb
                </div>
              </template>
             </el-upload>

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
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { useAppealStoreStatus } from '@/stores/appealStoreStatus'
import { useGlobalStore } from '@/stores/globalStore'
import { UploadFilled } from '@element-plus/icons-vue'
import { useDealStore } from '@/stores/dealStore'
import { numberWithSpaces } from '@/utils/globalFunctions'

const dealStore = useDealStore()
const globalStore = useGlobalStore()
const appealStoreStatus = useAppealStoreStatus()
const isOpen = ref(false)
const priceMarket = ref(null)
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


function changeSum () {
  if (!priceMarket.value) return false

  let fullSumm = priceMarket.value.replace(/ /g, '')
  priceMarket.value = String(fullSumm).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  console.log('fullSumm = ',fullSumm)

  categoryPrecent.value = 0
  matrixPrecent.value = 0
  mod.value.matrixEl = null
  mod.value.normEl = null
  mod.value.turnEl = null



  const promise1 = new Promise(resolve => {
    if (cashe['MarkupMatrix_' + fullSumm] != undefined) {
      Kf_root.LocationMatrix = cashe['MarkupMatrix_' + fullSumm]
      scope.isMatrix = !!cashe['MarkupMatrix_' + fullSumm]
      resolve()
    } else $http.get(config.apiUrl + '/MarkupMatrix/GetByLocation?locationId=' + scope.locationId + '&priceMarket=' + fullSumm).then(res => {
      if (res && res.data != undefined) {
        Kf_root.LocationMatrix = res.data
        cashe['MarkupMatrix_' + fullSumm] = res.data
        scope.isMatrix = !!res.data
      }
      resolve()
    })
  })


  const promise2 = new Promise(resolve => {
    if (cashe['MarkupCategory_' + fullSumm] != undefined) {
      Kf_root.LocationCategory = cashe['MarkupCategory_' + fullSumm]
      resolve()
    } else $http.get(config.apiUrl + '/MarkupCategory/GetByLocation?locationId=' + scope.locationId + '&priceMarket=' + fullSumm).then(res => {
      if (res && res.data != undefined) Kf_root.LocationCategory = res.data
      cashe['MarkupCategory_' + fullSumm] = res.data
      resolve()
    })
  })

  const promise3 = new Promise(resolve => {
    if (cashe['TurnoverRate_'] != undefined) {
      scope.turnoverRate = cashe['TurnoverRate_'].models
      resolve()
    } else $http.get(config.apiUrl + '/TurnoverRate/GetByLocation?locationId=' + scope.locationId)
      .then(res => {
        if (res && res.data != undefined) {
          cashe['TurnoverRate_'] = res.data
          scope.turnoverRate = res.data.models //localeTurnoverRate
        }
        if (res && res.data) scope.turnoverRate = res.data.models //localeTurnoverRate
        resolve()
      })
  })

  const promise4 = new Promise(resolve => {
    if (cashe['MileageRate_'] != undefined) {
      scope.mileageRate = cashe['MileageRate_'].models
      resolve()
    } else $http.get(config.apiUrl + '/MileageRate/GetByLocation?locationId=' + scope.locationId)
      .then(res => {
        if (res && res.data != undefined) {
          scope.mileageRate = res.data.models
          cashe['MileageRate_'] = res.data
        }
        resolve()
      })
  })

  Promise.all([promise1, promise2, promise3, promise4])
    .then(values => scope.changeDatas())
}
changeSum()




if (Kf_root.LocationCategory) {
  categoryPrecent.value = Kf_root.LocationCategory['category' + autoCategoryName.value]
}

function changeBrand() {
  console.log(' changeBrand = ',)
}

function open(val, deal) {
  console.log('deal = ', deal)

  priceMarket.value = numberWithSpaces(deal.priceMarket)

  mod.value = val
  isOpen.value = true

  // Предполагаемые расходы (Перегон, Мойка, химчиска, полировка, подготовка...)
  plannedPreSaleCosts.value = 0
  dealStore.getPlannedWork(deal.dealId).then(res => {
    res.data.items.forEach(res => plannedPreSaleCosts.value += res.price)
    plannedPreSaleCosts.value = numberWithSpaces(plannedPreSaleCosts.value)
    // scope.changeDatas()
  })


  dealStore.GetMileageRate(dealStore.deal.locationId).then(res => mileageRate.value = res.data.models)
  dealStore.GetTurnoverRate(dealStore.deal.locationId).then(res => turnoverRate.value = res.data.models)

  //turnoverRate

}

function save() {
  console.log(mod.value)
  //  let params = {
  //    comment: mod.value.comment,
  //    id: mod.value.dealId,
  //    newStatus: mod.value.id
  //  }
  // globalStore.isWaiting = true
  //  appealStoreStatus.setStatus(params).then(res => {
  //   globalStore.isWaiting = false
  //    if (res.status === 200) location.reload()
  //  })
}


defineExpose({ open })


</script>