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
              :neckColor="neckColor"
              :hiderText="hiderText"
              @goNext="goNext" @hider="hider"/>

    <AllInspectionTMP ref="ins_tmp" v-show="categoryId!=='90'" :categoryId="categoryId" @listChanged="listChanged"/>
    <Inspection40 :categoryId="categoryId" v-if="categoryId==='40'"/>
    <Inspection90 ref="ins_90" :categoryId="categoryId" v-show="categoryId==='90'"/>

    <h3 style="color:#d34338; text-align: center" v-if="stateClearButton===1">
      Заполнено не полностью!<br><br>
      <small>Нужно указать хотя бы одно повреждение, в пустом чекбоксе</small>
      <br><br>
    </h3>


    <div style="display: flex; justify-content: space-around; gap: 4px; flex-wrap: wrap">
      <el-button
          type="danger"
          @click="clear()"
          v-if="stateClearButton">
        Очистить лист осмотра
      </el-button>


      <el-button
          type="success"
          :disabled="stateClearButton===1"
          @click="save()"
          v-if="categoryId<100">
        Подтвердить и продолжить
      </el-button>
    </div>

    <el-divider/>
    <div style="text-align: center" v-if="categoryId==='30'">
      <br>
      {{ err_counter ? ' Внеш. Осмотр кузова выявил:' : 'Внеш. Осмотр кузова замечаний не выявил?' }}<br>
      <small v-if="defects.red">{{ defects.red }} дефект{{ Declension(defects.red, ['', 'а', 'ов']) }}<br>
        <span v-if="defects.yellow">{{ defects.yellow }} менянные детали</span>
      </small>
    </div>

    <div style="text-align: center" v-if="categoryId==='40' && (defects.red || defects.yellow)">
      Внутренний осмотр выявил:<br>
      <small v-if="defects.red">{{ defects.red }} дефект{{ Declension(defects.red, ['', 'а', 'ов']) }}<br>
        <span v-if="defects.yellow">{{ defects.yellow }} замечани{{ Declension(defects.yellow, ['е', 'я', 'й']) }}</span>
      </small>
    </div>

    <div style="text-align: center" v-if="categoryId==='20'">
      {{ err_counter ? 'Комплектация включает:' : 'Комплектация голая?' }}<br>
      <small v-if=" err_counter">{{ err_counter }} элемент{{ Declension(err_counter, ['', 'а', 'ов']) }}</small>
    </div>

    <div style="text-align: center" v-if="categoryId==='50'">
      {{ err_counter ? 'Под копотом обнаружено:' : 'Под копотом замечаний нет?' }}<br>
      <small v-if="err_counter">{{ err_counter }} дефект{{ Declension(err_counter, ['', 'а', 'ов']) }}</small>
    </div>

    <div style="text-align: center" v-if="categoryId==='60'">
      {{ err_counter ? 'Тест драйв выявил:' : 'Тест-драйв без замечаний?' }}<br>
      <small v-if="err_counter">{{ err_counter }} дефект{{ Declension(err_counter, ['', 'а', 'ов']) }}</small>
    </div>

    <div style="text-align: center" v-if="categoryId==='70'">
      {{ err_counter ? 'Подъёмник выявил:' : 'Подъёмник замечаний не выявил?' }}<br>
      <small v-if="err_counter">{{ err_counter }} дефект{{ Declension(err_counter, ['', 'а', 'ов']) }}</small>
    </div>

    <div style="text-align: center" v-if="categoryId==='10'">
      {{ err_counter ? 'Комплектность включает:' : 'Комплектность отсутствует?' }}<br>
      <small v-if="err_counter">{{ err_counter }} элемент{{ Declension(err_counter, ['', 'а', 'ов']) }}</small>
    </div>

    <div style="text-align: center" v-if="categoryId==='80'">
      {{ err_counter ? 'Прочие работы требуют:' : 'Прочие работы не требуются?' }}<br>
      <small v-if="err_counter">{{ err_counter }} дороботк{{ Declension(err_counter, ['а', 'и', 'ов']) }}</small>
    </div>

    <div style="text-align: center" v-if="categoryId==='90'">
      {{ err_counter ? 'Юридическая проверка выявила:' : 'Юридическая проверка нарушений не выявила?' }}<br>
      <small v-if="err_counter">{{ err_counter }} нарушени{{ Declension(err_counter, ['а', 'я', 'ий']) }}</small>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useRoute} from 'vue-router'
import router from '@/router'
import {onMounted, ref} from 'vue'
import {useGlobalStore} from '@/stores/globalStore'
import {useDealStore} from '@/stores/dealStore'
import {Declension} from '@/utils/globalFunctions'
import AllInspectionTMP from '@/pages/deal/tabs/collapses/inspectionList/AllInspectionTMP.vue'
import NeckPart from '@/pages/deal/tabs/collapses/inspectionList/NeckPart.vue'
import Inspection40 from '@/pages/deal/tabs/collapses/inspectionList/Inspection40.vue'
import Inspection90 from "@/pages/deal/tabs/collapses/inspectionList/Inspection90.vue"

const dealStore = useDealStore()
const globalStore = useGlobalStore()
const route = useRoute()
const dealId = ref<string | string[]>('')
const categoryId = ref<any>()
const listData = ref<any>()
const auto = ref<any>()
const ins_tmp = ref(null)
const ins_90 = ref(null)
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
const defects = ref<any>()
const err_counter = ref(0) // количество ошибок + предупреждений
let showOnlyErrors = false
const hiderText = ref('скрыть исправные')
const neckColor = ref('red')
const stateClearButton = ref(2); // 0 - скрываем, 1 - предупреждаем, 2-показываем

function hider() {
  // скрывать показывать только ошибки + предупреждения
  showOnlyErrors = !showOnlyErrors

  if (showOnlyErrors) {
    listData.value.map((el:any) => {
      if (!defects.value.redYellowIds.includes(el.id)) el.isHidden = true
    })
  } else listData.value.map((el:any) => el.isHidden = false)

  hiderText.value = showOnlyErrors ? 'показать все' : 'cкрыть исправные'

  if (['10', '20'].includes(categoryId.value)) {
    if (showOnlyErrors) listData.value.map((el:any) => el.isHidden = !el.isStock)
    else listData.value.map((el:any) => el.isHidden = false)
    hiderText.value = showOnlyErrors ? 'показать все' : 'показать комплектацию'
  }

}

function listChanged() {
  // поймать не заполненные поля
  let elem = listData.value.find((el:any) => {
    if (!el.isNorm && el.damageItems && el.damageItems.length && (!el.damageTypeArr || !el.damageTypeArr.length)) return el
    else false
  })
  stateClearButton.value = elem ? 1 : 2
}


function getData(nextCategory: number) {
  listData.value = []
  dealStore.getbyinspectionbycategory(+route.params.inspectionId, nextCategory).then(res => {
    listData.value = res.data.items
    auto.value = res.data.inspection.auto
    categoryId.value = route.params.categoryId
    document.documentElement.scrollTop = 0
    globalStore.setTitle(Titles[nextCategory])

    if (categoryId.value !== '90') ins_tmp.value.open(listData.value)
    else ins_90.value.open(listData.value, res.data.inspection)

    countDefects()
  })
  showOnlyErrors = false
  stateClearButton.value = 2
}


function clear() {
  if (categoryId.value == 40 && !dealStore.deal.additionalAutoInfo.isMileageOriginal)
    dealStore.deal.additionalAutoInfo.isMileageOriginal = true

  listData.value.forEach((item:any) => {
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

  err_counter.value = 0
  stateClearButton.value = 0
  defects.value = {red: 0, yellow: 0, redYellowIds: []}
  ins_tmp.value.open(listData.value)
}

function save() {
  listData.value.map((el:any) => {
    if (el.damageTypeArray) el.damageTypeArray = el.damageTypeArray.map((item:number) => ({id: item}))
    return el
  })
  dealStore.saveInspection(listData.value).then(() => goNext())

  if (categoryId.value === '40') {
    dealStore.saveInspection40({
      additionalAutoInfo: {
        isMileageOriginal: dealStore.deal.additionalAutoInfo.isMileageOriginal,
        mileageAuto: dealStore.deal.additionalAutoInfo.mileageAuto
      },
      auto: {categoryAuto: dealStore.deal.auto.categoryAuto},
      dealId: dealStore.deal.id
    })
  }

  // сохраняем квадратики отдельно, если были изменения
  if (categoryId.value === '90') {
    let exploitationHistoryType = ins_90.value.getExploitationHistoryType()
    exploitationHistoryType!==undefined && dealStore.savePostExploitationHistoryType({
      autoId: route.params.autoId,type: exploitationHistoryType
    })
  }
}


function countDefects() {
  defects.value.red = 0
  defects.value.yellow = 0
  defects.value.redYellowIds = []
  let formErrors = {notchosen: [], other: []}

  if (categoryId.value == 40 && !dealStore.deal.additionalAutoInfo.isMileageOriginal) countErrIds(-1, 'yellow')

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
            formErrors.notchosen.push({anchor: item.nav, name: item.name})
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
      // text.items = 'элемент' + Declension(defects.value.total, ['', 'а', 'ов'])
      // text.defectsRedText = Declension(defects.value.total, text.defectsRed)
      break
      // case 30:
      // case 40:
      //   text.defectsYellowText = Declension(defects.value.yellow, text.defectsYellow)
    default:
      defects.value.total = defects.value.red + defects.value.yellow
      // text.items =
      //     'замечан' + Declension(defects.value.total, ['ие', 'ия', 'ий'])
      // text.defectsRedText = Declension(defects.value.red, text.defectsRed)
      break
  }

  if (formErrors.notchosen) text.sectionsText = Declension(formErrors.notchosen.length, text.sections)

  // console.warn('text = ', text)
  console.warn('defects.value = ', defects.value)
  // console.warn('formErrors = ', formErrors)

  err_counter.value = defects.value.red + defects.value.yellow
  if (['10', '20'].includes(categoryId.value)) err_counter.value = defects.value.total

  if (['10', '20'].includes(categoryId.value)) {
    hiderText.value = 'показать комплектацию'
    if (categoryId.value === '10') hiderText.value = 'показать комплектность'
    neckColor.value = 'green'
  } else neckColor.value = 'red'
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
      case 90:
        return router.push(`/auto/${route.params.autoId}/deal/${route.params.dealId}/inspections/${
            route.params.inspectionId}/plainwork`)
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
  if (!dealStore.deal.id) dealStore.getDeal(route.params.dealId, false).then(res => dealStore.deal = res)
})
</script>