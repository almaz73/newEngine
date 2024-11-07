<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="dealStore.deal.useDealCheck?750:360"
            :top="40"
            :title="mod.name"
            draggable>
    <div style="display: flex; gap: 30px">
      <div>
        <div class="modal-field">

          <el-tooltip
            v-if="dealStore.deal.malfunctions" :content="dealStore.deal.malfunctions">
            <div  style="background: yellow; text-align: center" >
            <span v-if=" dealStore.deal.malfunctions && !dealStore.deal.isBuyBlocked "><a>Возможные неисправности</a></span>
            <span v-if="dealStore.deal.isBuyBlocked"><a>Ограничение выкупа</a></span>
            </div>
            <br/><br/>
          </el-tooltip>

          <br>
          <div class="info-filed">
            <label class="label ">Цена руководителя</label>
            <el-input v-model="managerPrice"
                      @input="()=>{managerPrice=numberWithSpaces(managerPrice); changeManagerPrice()}"
                      placeholder="Введите цену"/>
          </div>

          <br>
          <div>
            <el-input
                v-model="mod.comment"
                type="textarea"
                placeholder="Введите комментарий">
            </el-input>
          </div>

          <br>
          <div>
            <label class="label l_300">Цена, установленная аналитиком</label>
          {{ numberWithSpaces(mod.maxPriceBought) }} ₽
          </div>

          <br>
          <div class="info-filed" v-if="isCommissionFee">
            <label class="label">Комиссионное вознаграждение</label>
            <el-input
                   type="number"
                   @input="()=>{mod.commissionFee=parseInt(mod.commissionFee)}"
                   style="width: 180px;"
                   v-model="mod.commissionFee"
                   placeholder="Введите комиссию">
            </el-input>
          </div>

        </div>
      </div>

      <div v-if="dealStore.deal.useDealCheck">
        <div>Проверено :</div>
        <label class="label l_200">Кузов:</label>
        <el-switch v-model="checklist.isBodyChecked"
                   :active-text="checklist.isBodyChecked?'Подтверждено':''"
        />

        <br>
        <label class="label l_200">Техническая часть</label>
        <el-switch v-model="checklist.isTechChecked"
                   :active-text="checklist.isTechChecked?'Подтверждено':''"/>

        <br>
        <label class="label l_200">Диагностика</label>
        <el-switch v-model="checklist.isDiagnosticsChecked"
                   :active-text="checklist.isDiagnosticsChecked?'Подтверждено':''"/>

        <br>
        <label class="label l_200">Юр. проверка</label>
        <el-switch v-model="checklist.isLegalCheccked"
                   :active-text="checklist.isLegalCheccked?'Подтверждено':''"/>

        <br>

        <UploadDocFiles @setFiles="setFiles" :files="checklist.files" />

      </div>

    </div>
    <div>

      <span class="modal-buttons-bottom">
            <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
            <el-button type="info" @click="isOpen = false">Отмена</el-button>
        </span>
    </div>

  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from "@/stores/dealStore";
import {useAppealStoreStatus} from "@/stores/appealStoreStatus";
import { checkPictureBeforeUpload, numberNoSpace, numberWithSpaces } from "@/utils/globalFunctions";
import {useAdminStore} from "@/stores/adminStore";
import {ElMessage} from "element-plus";
import UploadDocFiles from "@/components/UploadDocFiles.vue";


const appealStoreStatus = useAppealStoreStatus()
const globalStore = useGlobalStore()
const dealStore = useDealStore()
const isOpen = ref(false);
const mod = ref({});
const closeModal = () => isOpen.value = false;
const managerPrice = ref(null)
const isCommissionFee = ref(false)
const checklist = ref({files:[]})
let isBuyerManager = globalStore.account.role === 'BuyerManager'
let maxPercentage = 0
let maxPrice = 0
let useMaxPrice = false // галочка "Использовать пороговое значение"


function setFiles(val) {
  checklist.value.files = val
}

function changeManagerPrice() {
  //managerPrice.value - цена руководителя
  //mod.value.maxPriceBought  - цена аналитика
  let price = managerPrice.value.replace(/ /g, '')
  if (!useMaxPrice || maxPercentage === undefined || maxPrice === undefined) return false
  let porogProcent = Math.round(mod.value.maxPriceBought * (1 + maxPercentage / 100))
  let predel = mod.value.maxPriceBought + maxPrice;

  if (porogProcent >= predel && price > porogProcent) {
    setTimeout(() => managerPrice.value = numberWithSpaces(price.toString().slice(0, -1)), 730)
    return ElMessage({
      showClose: true,
      message: 'Цена не должна превышать порог ' + maxPercentage + '%. Это ' + numberWithSpaces(porogProcent) + ' руб.',
      type: 'error',
    })
  } else if (porogProcent < predel && price > predel) {
    setTimeout(() => managerPrice.value = numberWithSpaces(price.toString().slice(0, -1)), 730)
    return ElMessage({
      showClose: true,
      message: 'Цена не должна превышать максимальный порог ' + numberWithSpaces(predel) + ' руб.',
      type: 'error',
    })
  }

}

function open(val, deal) {
  mod.value = val
  mod.value.commissionFee = mod.value.commissionFee | 0;
  mod.value.storageId = deal.storageId
  mod.value.maxPriceBought = deal.maxPriceBought
  mod.value.useDealCheck = deal.useDealCheck
  mod.value.dealId = deal.dealId

  isOpen.value = true;


  dealStore.getCommissionFee().then(res => isCommissionFee.value = res.data.available)


  if (isBuyerManager) {
    globalStore.getOrganization(dealStore.deal.storageId).then(res => {
      if (res.data === '') {
        maxPercentage = undefined
        maxPrice = undefined
      } else {
        maxPercentage = res.data.maxPercentage || 0
        maxPrice = res.data.maxPrice || 0
      }
    })
  }


  useAdminStore().getOrganization(globalStore.account.orgElementId).then(res => {
    if (res && res.view) useMaxPrice = res.view.useMaxPrice
  })
}

function save() {
  let params = {
    comment: mod.value.comment,
    commissionFee: mod.value.commissionFee,
    id: mod.value.dealId,
    managerPrice: numberNoSpace(managerPrice.value),
    newStatus: mod.value.id,
  }


  globalStore.isWaiting = true
  appealStoreStatus.setStatus(params).then(res => {
    globalStore.isWaiting = false
    isOpen.value = false
    if (res.status === 200) location.reload()
  })

}


defineExpose({open});


</script>