<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 500"
            :top="5"
            :title="'Почасовой календарь'"
            draggable>
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
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ElMessage, ElTable} from "element-plus";

const closeModal = () => isOpen.value = false
const globalStore = useGlobalStore()
const isOpen = ref(false)
const tableData = ref([])
let selectedTime = null
let cb;


function init() {
  let currentTime = new Date()
  let minuteStart = parseInt(currentTime.getMinutes() / 15)
  let startPeriod = currentTime
  startPeriod.setMinutes((minuteStart + 1) * 15)
  startPeriod.setSeconds(0)

  let endPeriod = new Date()
  endPeriod.setSeconds(0)
  endPeriod.setMinutes(0)
  endPeriod.setHours(24)

  for (let time = startPeriod; time < endPeriod; time.setMinutes(time.getMinutes() + 15)) {
    tableData.value.push({
      time: startPeriod,
      timePart: (time.getHours() + ':' + (time.getMinutes() ? time.getMinutes() : '0' + time.getMinutes())) + (!time.getMinutes() ? ' ⌚ ' : ''),
      event: ''
    })

  }
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
  console.log('row', row)
  cb = cbModal
  isOpen.value = true
  init()
}

defineExpose({open});

</script>