<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 500"
            :top="5"
            :title="'События : '+days[currentTime.getDay()]"
            draggable>
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px">
      <el-button @click="changeDate(-1)"> ⊲ </el-button>
      {{ formatDate(currentTime) }}
      <el-button @click="changeDate(1)"> ⊳ </el-button>

      <el-date-picker class="narrow-date" v-model="currentTime" @change="changeDate()" :clearable="false"/>
    </div>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'460px':'680px'">


      <el-table
          size="small"
          :data="tableData"
          @rowClick="setEvent"
          :show-header="false"
          highlight-current-row
          style="cursor:pointer;"
      >
        <el-table-column label="" prop="timePart" width="70px"/>
        <el-table-column label="" prop="value"/>
        <el-table-column label="" prop=""/>
      </el-table>
    </el-scrollbar>
    <div style="text-align: right">
      <el-button type="danger" @click="save()">Сохранить</el-button>
      <el-button type="info" @click="closeModal()">Отмена</el-button>
    </div>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {getCurrentInstance, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ElMessage, ElTable} from "element-plus";
import {useAppealStore} from "@/stores/appealStore";
import {formatDate} from "@/utils/globalFunctions";

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const isOpen = ref(false)
const tableData = ref([])
const currentTime = ref(new Date())
const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
let selectedTime = null
let cb;
let userId;


function init() {
  let minuteStart = parseInt(currentTime.value.getMinutes() / 15)
  let startPeriod = currentTime.value
  startPeriod.setMinutes((minuteStart + 1) * 15)
  startPeriod.setSeconds(0)

  let endPeriod = new Date()
  endPeriod.setSeconds(0)
  endPeriod.setMinutes(0)
  endPeriod.setHours(24)

  for (let time = startPeriod; time < endPeriod; time.setMinutes(time.getMinutes() + 15)) {
    tableData.value.push({
      time: startPeriod,
      timePart: (time.getHours() + ':' + (time.getMinutes() ? time.getMinutes() : '0' + time.getMinutes())) + (!time.getMinutes() ? ' 🕗 ' : ''),
      event: ''
    })

  }
}

function changeDate(val) {
  if (val) {
    currentTime.value.setDate(currentTime.value.getDate() + val)
    currentTime.value = new Date(currentTime.value)
  }

  const instance = getCurrentInstance();
  instance?.proxy?.$forceUpdate();

  let filter = {
    month: currentTime.value.getMonth() + 1,
    year: currentTime.value.getFullYear(),
    assignedTo: userId
  }

  useAppealStore().getEvent({filter: JSON.stringify(filter)}).then(res => {
    console.log(' = = res', res)
  })
}

function setEvent(value) {
  tableData.value.map(el => el.value = '')
  value.value = 'Новое событие'
  selectedTime = value.time

}

function checkDate() {
  if (smsDate.value < new Date()) return ElMessage({message: 'Выбранная дата меньше текущей', type: 'warning'})
}

function save() {
  if (checkDate()) return false

  cb(selectedTime)
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