<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="dealStore.deal.useDealCheck?750:360"
            :top="40"
            :title="mod.name"
            draggable>
    <div style="display: flex; gap: 30px">
      <div>
        <span class="modal-field">

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

        </span>
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
        <small v-for="(file, ind) in checklist.files">
          <div class="file-frame">
            <img src="@/assets/img/doc.png" v-if="file.mimeType==='doc'" />
            <img src="@/assets/img/txt.png" v-if="file.mimeType==='txt'" />
            <img src="@/assets/img/pdf.png" v-if="file.mimeType==='pdf'" />
            <img src="@/assets/img/rtf.png" v-if="file.mimeType==='rtf'" />
            <img src="@/assets/img/xls.png" v-if="file.mimeType==='xls'" />
            <img src="@/assets/img/picture.png"
                 v-if="['png','jpg','gif','raw','tiff','bmp','psd'].includes(file.mimeType)" />

            <a v-if="!file.Document" @click="openFile(itemIndex, ind)">{{ file.title }}</a>
            <span v-if="file.Document">{{ file.title }}</span>
            <span size="small" style="cursor: pointer" @click="deleteFile(itemIndex, ind)"> ✖ </span>
          </div>
        </small>

        <br>
        <el-upload
          ref="upload"
          :show-file-list="false"
          style="float: right"
          :http-request="uploadFiles"
          :auto-upload="true"
        >
          <template #trigger>
            <el-button :icon="Plus"> Файл</el-button>
          </template>
        </el-upload>

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

const appealStoreStatus = useAppealStoreStatus()
const globalStore = useGlobalStore()
const dealStore = useDealStore()
const isOpen = ref(false);
const mod = ref({});
const closeModal = () => isOpen.value = false;
const managerPrice = ref(null)
const isCommissionFee = ref(false)
const checklist = ref({files:[]})
const listData = ref([])
let isBuyerManager = globalStore.account.role === 'BuyerManager'
let maxPercentage = 0
let maxPrice = 0
let useMaxPrice = false // галочка "Использовать пороговое значение"


function deleteFile(itemIndex, ind) {
  checklist.value.files.splice(ind, 1)
}
function uploadFiles(obj) {
  if (checkPictureBeforeUpload(obj.file, 10, 'allFiles')) return false
  const f = obj.file

  if (f) {
    const fr = new FileReader()
    fr.onload = () => {
      const fbase64 = fr.result //файл в base64
      if (!checklist.value.files) checklist.value.files = []
      checklist.value.files.push({
        mimeType: setMimeType(obj.file.name),
        Document: fbase64.split('base64,')[1],
        title: obj.file.name
      })

    }
    fr.readAsDataURL(f)
  }
}

function getTextAfterLastDot(str) {
  const lastIndex = str.lastIndexOf('.')
  return lastIndex !== -1 ? str.substring(lastIndex + 1) : ''
}

function setMimeType(fileName) {
  let mimeType = getTextAfterLastDot(fileName)
  if (mimeType.toLowerCase().includes('xls')) mimeType = 'xls'
  if (mimeType.toLowerCase().includes('doc')) mimeType = 'doc'

  if (['exe', 'bat'].includes(mimeType.toLowerCase())) {
    ElMessage.warning('Осторожно! Вы сохраняете запускаемый файл')
    return false
  }

  if (!mimeType || !['txt', 'doc', 'xls', 'pdf', 'rtf', 'png', 'jpg', 'gif', 'raw', 'tiff', 'bmp', 'psd'].includes(mimeType)) {
    mimeType = 'txt'
  }

  return mimeType.toLowerCase()
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