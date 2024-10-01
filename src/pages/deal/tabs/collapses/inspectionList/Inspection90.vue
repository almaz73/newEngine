<template>
  <div>
    <div v-for="item in listData">
      <div v-if="!item.isHidden">
        <div style="float: left" :style="{'max-width':categoryId!=='30'?'350px':'273px'}">

          <span>
            <el-icon style="color: green" v-if="!dangerField[item.id].isStock">
             <CircleCheck/>
            </el-icon>
            <el-icon style="color: #f99" v-if="dangerField[item.id].isStock">
             <CircleClose/>
            </el-icon>
          </span>

          {{ item.name }}
        </div>

        <div v-if="globalStore.isMobileView" style="clear: both; padding: 4px"></div>

        <div
            style="float: right; cursor: pointer"
            @click="changeItem(item, 'isStock')"
            @mouseover="item.isStock=!item.isStock"
            @mouseleave="toMouseLeave(item, 'isStock')"
        >
          <el-button
              :style="{background :!item.isStock?'#f56c6c':'#c6e0cc', color:item.isStock?'':'white'}"
              style="width: 150px; pointer-events:none">
            <span>  {{ item.isStock ? 'Без нарушений' : 'Есть нарушения !' }}</span>
          </el-button>
        </div>


        <div style="clear: both"></div>

        <div
            style="cursor: pointer; display: flex; gap:4px"
            v-if="inspectionAvtotec && item.name=='Автотека'">
          <div>История эксплуатации &nbsp; &nbsp;</div>

          <div class="quadro green"
               title="ДТП: отсутствует
Расчеты: отсутствует
Страховые выплаты: отсутствует
Собственники: не более одного на 3 года эксплуатации"
               @click="switchColor(item, 'Зеленый')"
               :class="{'active':!exploitationHistoryType}">З
          </div>
          <div class="quadro yellow"
               title="ДТП: отсутствуют красные, не более 2х дтп, не более 3 элементов в общем
Расчеты: Не более 10% от стоимости авто. Отсутствуют силовые элементы
Страховые выплаты: Не более 10% от стоимости авто
Собственники: не более одного на 2 года эксплуатации"
               @click="switchColor(item, 'Желтый')"
               :class="{'active':exploitationHistoryType==10}">Ж
          </div>
          <div class="quadro red"
               title="Расчеты:Х
Страховые выплаты: Х
Собственники: Х
Такси, каршеринг, аукцион битых, угон, тотал, ввезенка"
               @click="switchColor(item, 'Красный')"
               :class="{'active':exploitationHistoryType==20}">К
          </div>
        </div>


        <div style="clear: both"></div>
        <small style="color:#999"> Комментарий: <br>
          <el-input v-model="item.comment" type="textarea" :rows="2" placeholder="добавить"></el-input>
        </small>

        <el-divider/>
      </div>
    </div>


  </div>

</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from '@/stores/dealStore'
import {CircleCheck, CircleClose} from '@element-plus/icons-vue'
import {ref} from 'vue'

const globalStore = useGlobalStore()
const listData = ref([])
const dealStore = useDealStore()
const chapok = ref(false)
const item = ref({})
const dangerField = ref({})
const {categoryId} = defineProps(['categoryId'])
const emits = defineEmits(['listChanged'])
const exploitationHistoryType = ref(null)
const inspectionAvtotec = ref(false)
let quardColor = []

// берем типы цветов бакенда, остальные параметры зашиты в клиентский код, решили переходить тихонечко
dealStore.getExploitationHistoryTypes().then(res => quardColor = res.data)

item.value = dealStore.deal


// узнаем есть ли галочка автотеки
function getCheck(inspection) {
  dealStore.getbycategories(90).then(res => {
    let element = res.data.items.find(el => el.name === 'Автотека')

    if (element) inspectionAvtotec.value = element.workId === 65
    if (inspectionAvtotec.value) {
      // получаем цвет квадрата, если автотека включена
      if (inspection && inspection.auto) exploitationHistoryType.value = inspection.auto.exploitationHistoryType
    }
  })
}

function getExploitationHistoryType() {
  return exploitationHistoryType.value
}


function open(_listData: any, inspection: any) {
  listData.value = _listData

  listData.value.map(el => {
    el.nav = el.id
    if (!dangerField.value[el.id]) dangerField.value[el.id] = {}
    dangerField.value[el.id].isNorm = !el.isNorm // раскрываем поля с ошибками
    dangerField.value[el.id].isStock = !el.isStock // раскрываем поля с ошибками
    return el
  })
  getCheck(inspection)
}

function switchColor(item, color) {
  switch (color) {
    case 'red':
      item.isStock = false
      item.isNorm = false
      break;
    case 'yellow':
      item.isStock = false
      item.isNorm = true
      break;
    case 'green':
      item.isStock = true
      item.isNorm = true
      break;
  }
  exploitationHistoryType.value = quardColor.find(el => el.title === color).value
}


function changeItem(item: any, type: string) {
  if (chapok.value && type === 'isStock') item.isStock = !item.isStock
  if (type === 'isStock') dangerField.value[item.id].isStock = !item.isStock

  chapok.value = true
  emits('listChanged')
}

function toMouseLeave(item: any, type: string) {
  if (!chapok.value) {
    if (type === 'isStock') item.isStock = !item.isStock
  }
  chapok.value = false
}

defineExpose({open, getExploitationHistoryType})

</script>