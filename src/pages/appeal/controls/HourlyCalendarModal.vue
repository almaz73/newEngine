<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 500"
            :top="5"
            :title="'События : '+days[currentTime.getDay()]"
            draggable>
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px">
      <el-button @click="changeDate(-1)"> ⊲</el-button>
      {{ formatDate(currentTime) }}
      <el-button @click="changeDate(1)"> ⊳</el-button>

      <el-date-picker class="narrow-date" v-model="currentTime" @change="changeDate()" :clearable="false"/>
    </div>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'460px':'600px'">


      <el-table
          size="small"
          :data="tableData"
          @rowClick="setEvent"
          :show-header="false"
          :row-class-name="tableRowClassName"
          class="hourly"
      >
        <el-table-column label="" prop="timePart" width="70px"/>
        <el-table-column label="" prop="value"/>
      </el-table>
    </el-scrollbar>
    <div style="text-align: right">
      <el-button type="danger" @click="save()"
                 :disabled="!isReady"
                 :icon="Plus">Добавить
      </el-button>
      <el-button type="info" @click="closeModal()">Отмена</el-button>
    </div>
  </AppModal>
</template>

<style>

.hourly table > tbody .el-table__cell {
  padding: 0;
}

.el-table .old-events {
  --el-table-tr-bg-color: #fdd;
}

.el-table .new-events {
  --el-table-tr-bg-color: #b0ffbb;
}

.el-table .today-event {
  --el-table-tr-bg-color: #ddf;
}
</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ElMessage, ElTable} from "element-plus";
import {useAppealStore} from "@/stores/appealStore";
import {formatDate} from "@/utils/globalFunctions";
import {Plus} from "@element-plus/icons-vue";

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const isOpen = ref(false)
const tableData = ref([])
const currentTime = ref(new Date())
const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const isReady = ref(false)
let eventsArr = []
let selectedTime = null
let cb;
let userId;

function tableRowClassName({row}) {
  if (row.value === 'Новое событие') return 'new-events'
  if (row.today) return 'today-event'
  if (row.value) return 'old-events'
  return ''
}


function changeDate(val) {
  if (val) {
    currentTime.value.setDate(currentTime.value.getDate() + val)
    currentTime.value = new Date(currentTime.value)
  }

  let filter = {
    month: currentTime.value.getMonth() + 1,
    year: currentTime.value.getFullYear(),
    assignedTo: userId
  }

  useAppealStore().getEvent({filter: JSON.stringify(filter)}).then(res => {
    eventsArr = res.items
    showOldEvents()
  })
}

function showOldEvents() {
  let todayH = new Date().getHours()
  isReady.value = false
  tableData.value.map(el => {
    el.value = ''
    el.today = ''
    if (todayH == el.timePart.split(':')[0] && new Date().getDate() == currentTime.value.getDate()) {
      el.today = 'Сейчас'
    }

  })

  eventsArr.forEach(el => {
    let date = el.dateStart
    if (Math.abs(new Date(currentTime.value) - new Date(date)) < 86400000) {
      let day = new Date(date).getDate()
      if (new Date(currentTime.value).getDate() === day) {
        let h = new Date(date).getHours()
        let m = new Date(date).getMinutes() ? new Date(date).getMinutes() : '0' + new Date(date).getMinutes()
        tableData.value.map(item => {
          let time = item.timePart.split(':')
          if (time[0] == h && m == parseInt(time[1])) item.value = el.description || el.title
          return item
        })
      }
    }
  })
}

function setEvent(value) {
  let thisTime = new Date(currentTime.value)
  thisTime.setHours(value.timePart.split(':')[0])
  thisTime.setMinutes(parseInt(value.timePart.split(':')[1]))
  if (thisTime < new Date()) return ElMessage.warning('Нельзя добавить событие в прошлом')

  tableData.value.map(el => {
    if (el.value === 'Новое событие') el.value = ''
  })
  value.value = 'Новое событие'
  selectedTime = thisTime
  isReady.value = true
}

function init() {
  tableData.value = []
  let minuteStart = parseInt(currentTime.value.getMinutes() / 15)
  let startPeriod = currentTime.value
  startPeriod.setMinutes((minuteStart + 1) * 15)
  startPeriod.setSeconds(0)

  let endPeriod = new Date()
  endPeriod.setSeconds(0)
  endPeriod.setMinutes(0)
  endPeriod.setHours(24)


  for (let time = new Date(startPeriod.setHours(0)); time < endPeriod; time.setMinutes(time.getMinutes() + 15)) {
    if (time.getHours() > 5 && time.getHours() < 22) {
      tableData.value.push({
        timePart: (time.getHours() + ':' + (time.getMinutes() ? time.getMinutes() : '0' + time.getMinutes())) + (!time.getMinutes() ? ' 🕗 ' : ''),
        event: ''
      })
    }
  }
}


function save() {
  cb(selectedTime)
  closeModal()
}

function open(row, cbModal) {
  cb = cbModal
  isOpen.value = true
  init()
  userId = row.userResponsibleId
  changeDate()
}

defineExpose({open});

</script>