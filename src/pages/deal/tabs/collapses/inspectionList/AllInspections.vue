<template>
  <div class="insp-form"
       :style="{minWidth: categoryId==='110'?'100%':'', 'max-width':globalStore.isMobileView?'380px':'100%'}"
       >
    <div style="font-size: 25px">Осмотр а/м</div>
    <p style="font-size: larger">
      {{ auto.brandTitle }}
      {{ auto.modelTitle }}
      {{ auto.year }} г.в.
      VIN: {{ auto.vin }}
    </p>
    <NeckPart :title="Titles[categoryId]"
              :categoryId="categoryId"
              :err_counter="err_counter"
              :hiderText="hiderText"
              @goNext="goNext" @hider="hider" />

    <AllInspectionTMP ref="ins_tmp" :categoryId="categoryId" />

    <div style="display: flex; justify-content: space-around; gap: 4px; flex-wrap: wrap">
      <el-button
        type="danger"
        @click="clear()"
        v-if="categoryId<90">
        Очистить лист осмотра
      </el-button>


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
import { Declension } from '@/utils/globalFunctions'

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
const defects = ref({})
const err_counter = ref(0) // количество ошибок + предупреждений
let showOnlyErrors = false
const hiderText = ref('скрыть исправные')

function hider() {
  // скрывать показывать только ошибки + предупреждения
  showOnlyErrors = !showOnlyErrors

  if (showOnlyErrors) {
    listData.value.map(el => {
      if (!defects.value.redYellowIds.includes(el.id)) el.isHidden = true
    })
  } else listData.value.map(el => el.isHidden = false)

  hiderText.value = showOnlyErrors ? 'показать все' : 'cкрыть исправные'
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

    countDefects()
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


function countDefects() {
  defects.value.red = 0
  defects.value.yellow = 0
  defects.value.redYellowIds = []
  let formErrors = { notchosen: [], other: [] }

  if (dealStore.deal.additionalAutoInfo)
    if (categoryId.value == 40 && !dealStore.deal.additionalAutoInfo.isMileageOriginal) {
      console.log('>todo>>>>>>dealStore.deal = ', dealStore.deal)
      countErrIds(21561702, 'yellow')
    }

  listData.value.forEach(item => {
    item.errors = {}
    switch (+item.inspectionUiType) {
      case 10:
        if (!item.isStock) countErrIds(item.id, 'red')
        break
      case 20:
        if (item.isRepaired) countErrIds(item.id, 'yellow')
      case 30:
        if (!item.isNorm) {
          countErrIds(item.id, 'red')
          if (!item.damageTypeArray) {
            formErrors.notchosen.push({ anchor: item.nav, name: item.name })
            item.errors.notchosen = true
          }
        }
        break
      case 40:
        if (item.isRequired) countErrIds(item.id, 'red')
        break
    }
  })

  function countErrIds(id, color) {
    if (color === 'red') defects.value.red++
    else defects.value.yellow++
    defects.value.redYellowIds.push(id)
  }

  let text = {}

  switch (+categoryId.value) {
    case 10:
    case 20:
      defects.value.total = listData.value.length - defects.value.red
      text.items = 'элемент' + Declension(defects.value.total, ['', 'а', 'ов'])
      text.defectsRedText = Declension(defects.value.total, text.defectsRed)
      break
    case 30:
    case 40:
      text.defectsYellowText = Declension(defects.value.yellow, text.defectsYellow)
    default:
      defects.value.total = defects.value.red + defects.value.yellow
      text.items =
        'замечан' + Declension(defects.value.total, ['ие', 'ия', 'ий'])
      text.defectsRedText = Declension(defects.value.red, text.defectsRed)
      break
  }

  if (formErrors.notchosen) text.sectionsText = Declension(formErrors.notchosen.length, text.sections)

  console.warn('text = ', text)
  console.warn('defects.value = ', defects.value)
  console.warn('formErrors = ', formErrors)

  err_counter.value = defects.value.red + defects.value.yellow

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