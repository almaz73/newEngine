<template>
  <div class="insp-form" :style="{minWidth: categoryId==='110'?'100%':''}">

    <div style="font-size: 25px">Осмотр а/м</div>
    <p style="font-size: larger">
      {{ auto.brandTitle }}
      {{ auto.modelTitle }}
      {{ auto.year }} г.в.
      VIN: {{ auto.vin }}
    </p>
    <NeckPart :title="Titles[categoryId]"
              :categoryId="categoryId"
              @goNext="goNext" @hider="hider" />

    <AllInspectionTMP ref="ins_tmp" :categoryId="categoryId" />

    <div style="display: flex; justify-content: space-between">
      <el-button
        type="danger"
        @click="clear()"
        v-if="categoryId<90">
        Очистить лист осмотра
      </el-button>

      <span v-else>&nbsp;</span>

      <el-button
        type="success"
        @click="save()"
        v-if="categoryId<100">
        Подтвердить и продолжить
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import AllInspectionTMP from '@/pages/deal/tabs/collapses/inspectionList/AllInspectionTMP.vue'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import NeckPart from '@/pages/deal/tabs/collapses/inspectionList/NeckPart.vue'

const dealStore = useDealStore()
const globalStore = useGlobalStore()
const route = useRoute()
const dealId = ref<string | string[]>('')
const autoId = ref<string | string[]>('')
const inspectionId = ref<string | string[]>('')
const categoryId = ref<string | string[]>('')
const listData = ref([])
const auto = ref({})
const ins_tmp = ref(null)
const Titles = {
  30: 'Внешний осмотр кузова',
  40: 'Внутренний осмотр',
  20: 'Комплектация',
  50: 'Под капотом',
  60: 'Тест-драйв',
  70: 'Подъёмник',
  10: 'Комплектность',
  80: 'Прочие работы',
  90: 'Юридическая проверка'
}


function hider() {
  globalStore.showOnlyErrors = !globalStore.showOnlyErrors
}


function getData(nextCategory: number) {
  listData.value = []
  dealStore.getbyinspectionbycategory(+route.params.inspectionId, nextCategory).then(res => {
    listData.value = res.data.items
    auto.value = res.data.inspection.auto
    // eval('ins_' + nextCategory).value.open(listData.value)

    ins_tmp.value.open(listData.value)

    categoryId.value = route.params.categoryId
    document.documentElement.scrollTop = 0
    globalStore.setTitle(Titles[nextCategory])
  })
}


function clear() {
  if (categoryId.value == 40 && !dealStore.deal.additionalAutoInfo.isMileageOriginal)
    dealStore.deal.additionalAutoInfo.isMileageOriginal = true

  listData.value.forEach(item => {
    switch (item.inspectionItemCategory) {
      case 10:
      case 20:
        item.isStock = false
        break
      case 30:
        item.isRepaired = false
      case 40:
      case 50:
      case 60:
      case 70:
        item.isNorm = true
        break
      case 80:
        item.isRequired = false
        break
      case 90:
        item.isStock = true
        break
    }
    item.photos = []
    item.damageType = null
    delete item.damageTypeArray
  })

  ins_tmp.value.open(listData.value)
}

function save() {
  listData.value.map(el => {
    if (el.damageTypeArray) el.damageTypeArray = el.damageTypeArray.map(item => ({ id: item }))
    return el
  })
  dealStore.saveInspection(listData.value).then(() => goNext())
}

function goNext() {

  categoryId.value = route.params.categoryId

  let nextCategory = 10
  if (dealId.value !== undefined) {
    switch (+categoryId.value) {
      case 30:
        nextCategory = 40
        break
      case 40:
        nextCategory = 20
        break
      case 20:
        nextCategory = 50
        break
      case 50:
        nextCategory = 60
        break
      case 60:
        nextCategory = 70
        break
      case 70:
        nextCategory = 10
        break
      case 10:
        nextCategory = 80
        break
      case 80:
        nextCategory = 90
        break
    }

    router.push(`/auto/${route.params.autoId}/deal/${route.params.dealId}/inspection/${
      route.params.inspectionId}/edit-category/${nextCategory}`)

  }

}

router.beforeEach(res => {  // качаем данные, если пришли со ссыолки
  getData(+res.params.categoryId)
})

onMounted(() => {  // качаем данные, если обновили броузер
  getData(+route.params.categoryId)
})
</script>