<template>
  <ForFullSceen>
    <div class="custom-report-table_bts">
      <button class="bt" @click="toSubSection(1)" title="Скрыть узлы">⭱</button>
      <button class="bt" @click="toSubSection(2)" title="Разделы">⭶</button>
      <button class="bt" @click="toSubSection(4)" title="Все узлы">⭶</button>

      &nbsp; <input v-model="searchTxt"  placeholder="фильтр по ФИО"  @input="init()" />
    </div>
    <table class="custom-report-table">
      <thead>
      <tr>
        <th> ФИО</th>
        <th><a @click="toActive(2)">ОБРАЩЕНИЯ {{ activeColumn === 2 ? '⭐' : ' ✰ ' }}</a></th>
        <th><a @click="toActive(3)">ОЦЕНКИ А/М {{ activeColumn === 3 ? '⭐' : ' ✰ ' }}</a></th>
        <th> ОБРАЩЕНИЯ-ОЦЕНКИ, %</th>
        <th><a @click="toActive(5)">ВЫКУПЛЕНО А/М, % {{ activeColumn === 5 ? '⭐' : ' ✰ ' }}</a></th>
        <th> ОБРАЩЕНИЯ - ВЫКУП, %</th>
      </tr>
      </thead>
      <tbody :key="updateKey">
      <template v-for="(row, i) in tableData" :style="{fontSize:row.level===4?'11px':''}">
        <tr
          @click="toSelectedRow(row, i)"
          style="padding: 0; margin: 0"
          :class="{selected: i === selectedRow }"
          v-if="
          (row.isShow && (!row.active || row.active===activeColumn)) ||
          (row.level<subSections+1
          && (!row.active || (row.active && row.active===activeColumn)))">
          <td>
           <span v-if="row.level===1" class="lev1">
          {{ row.employeeTitle }}
        </span>
            <span v-if="row.level===2" class="lev2">
          {{ row.employeeTitle }}
        </span>
            <span v-if="row.level===3" class="lev3">
          {{ row.employeeTitle }}
        </span>
            <span v-if="row.level===4" class="lev4">
          <a @click="openLink(row)">{{ row.employeeTitle }}</a>
        </span>
          </td>
          <td>{{ row.appealCount }}</td>
          <td>{{ row.buyCount }}</td>
          <td>{{ row.onCommissionCount }}</td>
          <td>{{ row.boughtCount }}</td>
          <td>{{ row.appealBuyProc }}</td>
        </tr>
      </template>
      </tbody>
    </table>

  </ForFullSceen>
</template>
<script setup>
import { ref, watchEffect } from 'vue'
import ForFullSceen from '@/components/ForFullSceen.vue'


const { data, needUpdate } = defineProps(['data', 'needUpdate'])
const tableData = ref([])
const activeColumn = ref(2)
const selectedRow = ref(-1)
const subSections = ref(1)
const updateKey = ref(0)
const searchTxt = ref('')
let oldNeedUpdate = 0

watchEffect(() => {
  if (oldNeedUpdate !== needUpdate) {
    oldNeedUpdate = needUpdate
    subSections.value=1
    tableData.value = []
    init()
  }
})

function init() {
  tableData.value = []
  let idCount = 0
  let count1 = 0
  let count2 = 0
  let count3 = 0
  let count4 = 0
  let count5 = 0
  data && data.forEach(el => {
    el.level = 1
    if(searchTxt.value && searchTxt.value.length>2 &&
      !el.employeeTitle.toUpperCase().includes(searchTxt.value.toUpperCase())) return false
    idCount++
    count1 += el.appealCount
    count2 += el.appealBuyProc
    count3 += el.buyCount
    count4 += el.boughtCount
    count5 += el.onCommissionProc
    el.idCount = idCount
    let el_short = Object.assign({}, el)
    delete el_short.citys
    tableData.value.push(el_short)
    el.citys && el.citys.forEach(item => {
      item.employeeTitle = item.cityName
      item.level = 2
      idCount++
      item.parentId = el.idCount
      item.idCount = idCount
      let item_short = Object.assign({}, item)
      delete item_short.buyoutLocations
      tableData.value.push(item_short)
      item.buyoutLocations && item.buyoutLocations.forEach(it => {
        it.employeeTitle = it.locationTitle
        it.level = 3
        idCount++
        it.parentId = item.idCount
        it.idCount = idCount
        let it_short = Object.assign({}, it)
        delete it_short.listAppeals
        delete it_short.listBoughts
        delete it_short.listBuys
        delete it_short.listOnCommission
        tableData.value.push(it_short)
        let count = 1
        let count3 = 1
        let count5 = 1
        it.listAppeals && it.listAppeals.forEach(a => {
          a.employeeTitle = (count++) + '. ' + a.appealTypeTitle
          a.appealCount = a.appealClientTitle
          a.buyCount = '☎ ' + a.appealClientPhone
          if (a.appealAuto) a.boughtCount = '🚕 ' + a.appealAuto
          a.active = 2
          a.level = 4
          a.parentId = it.idCount
          idCount++
          a.idCount = idCount
          tableData.value.push(a)
        })

        it.listBuys && it.listBuys.forEach(a => {
          a.employeeTitle = (count3++) + '. ' + 'Оценка '
          a.appealCount = a.appealClientTitle
          a.buyCount = '☎ ' + a.appealClientPhone
          if (a.appealAuto) a.boughtCount = '🚕 ' + a.appealAuto
          a.active = 3
          a.level = 4
          a.parentId = it.idCount
          a.link = a.appealId
          idCount++
          a.idCount = idCount
          tableData.value.push(a)
        })

        it.listBoughts && it.listBoughts.forEach(a => {
          a.employeeTitle = (count5++) + '. ' + 'Выкуплено '
          a.appealCount = a.appealClientTitle
          a.buyCount = '☎ ' + a.appealClientPhone
          if (a.appealAuto) a.boughtCount = '🚕 ' + a.appealAuto
          a.active = 5
          a.level = 4
          a.parentId = it.idCount
          a.link = a.appealId
          idCount++
          a.idCount = idCount
          tableData.value.push(a)
        })


      })
    })


  })
  tableData.value.push({
    level: 1,
    employeeTitle: 'ИТОГО',
    appealCount: cutTails(count1),
    appealBuyProc: cutTails(count2),
    buyCount: cutTails(count3),
    boughtCount: cutTails(count4),
    onCommissionProc: cutTails(count5)
  })
}

function forceUpdate() {
  updateKey.value++
}

function clearPoints() {
  tableData.value.map(el => {
    el.isOpen = false
    el.isShow = false
  })
}

function toSubSection(val) {
  if (val === 2 && subSections.value === 2) subSections.value = 3
  else if (val === 2 && subSections.value === 3) subSections.value = 2
  else subSections.value = val
  clearPoints()
  forceUpdate()
}

function toSelectedRow(row, i) {
  selectedRow.value = i
  let listToClose = []

  tableData.value.map(el => {
    if (el.idCount === row.idCount) {
      if (!row.isOpen) row.isOpen = true
      else {
        row.isOpen = false
        listToClose.push(row.idCount)  // находим всех потомков d дальнейшем и будем закрывать
      }
    }
    if (el.parentId === row.idCount) el.isShow = true

    if (listToClose && listToClose.includes(el.parentId)) {
      if (!listToClose.includes(el.idCount)) listToClose.push(el.idCount)
      el.isShow = false
      el.isOpen = false
    }
  })
  forceUpdate()
}

function openLink(row) {
  row.appealId && window.open('/v2/appeal/' + row.appealId, '_blank')
}

function toActive(val) {
  if (activeColumn.value === val) activeColumn.value = ''
  else activeColumn.value = val
}

function cutTails(count) {
  if (count % 1) {
    if (count * 10 % 1) return count.toFixed(2)
    return count.toFixed(1)
  } else return count
}
</script>
