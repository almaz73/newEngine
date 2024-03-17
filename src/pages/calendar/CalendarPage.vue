<template>
  <main class="calendar">
    <div style="margin-bottom: 10px">
      <label><small> Отображать завершенные события </small>&nbsp;
        <el-checkbox @change="changeDate()" v-model="showExpired"/>
      </label> &nbsp; &nbsp; &nbsp; &nbsp;
      <label><small> Отображать встречи колл-центра</small> &nbsp;
        <el-checkbox @change="changeDate()" v-model="showVisitEvents"
        />
      </label>
    </div>

    <el-calendar ref="calendar" v-model="changedDate" @click="changeDate()">
      <template #header="{ date }">
        <span>Календарь</span>
        <span>{{ date }}</span>
        <el-button-group>
          <el-button size="small" @click="selectDate('prev-year')">
            Предыдущий год
          </el-button>
          <el-button size="small" @click="selectDate('prev-month')">
            Предыдущий месяц
          </el-button>
          <el-button size="small" @click="selectDate('today')">Сегодня</el-button>
          <el-button size="small" @click="selectDate('next-month')">
            Следующий месяц
          </el-button>
          <el-button size="small" @click="selectDate('next-year')">
            Следующий год
          </el-button>
        </el-button-group>
      </template>
      <template #date-cell="{ data }">
        <small class="date_cell">{{ parseInt(data.day.split('-')[2]) }}</small><br>

        <div style="float: right" v-html="days[data.day]"/>
      </template>
    </el-calendar>
  </main>
</template>

<style>
.calendar .el-calendar-day {
  min-height: 80px;
  height: auto !important;
  float: left;
}

.calendar .date_cell {
  color: var(--main-color);
}

.calendar .block {
  padding: 8px;
  margin: 4px 0;
  background: #a12d24;
  color: white;
  font-size: 12px;
}

.calendar .block.grey {
  background: #999;
}
</style>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useCalendarStore} from "@/stores/calendarStore";
import type {CalendarDateType, CalendarInstance} from 'element-plus'

const globalStore = useGlobalStore()
const calendarStore = useCalendarStore()
const tableData = ref([])
const changedDate = ref(new Date())
const calendar = ref<CalendarInstance>()
const showExpired = ref(false)
const showVisitEvents = ref(false)
const days = ref({})
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

getEvents(new Date().getFullYear(), new Date().getMonth())

function changeDate() {
  console.log('leadWorkflowId = = = changedDate=', changedDate.value)
  getEvents(changedDate.value.getFullYear(), changedDate.value.getMonth())
}

function getEvents(year, month) {
  console.log('year, month', year, month)
  days.value = {}

  calendarStore.getEvents(year, month, showExpired.value, showVisitEvents.value)
      .then(res => {
        console.log('res', res)
        tableData.value = res.items
        tableData.value.forEach(el => {
          let zzz = new Date(el.dateStart).toLocaleDateString().split('.').reverse().join('-')
          console.log(' = = el=', el.appealType)

          let klass = 'block'
          if (el.appealType == 4) klass += ' grey'
          if (!days.value[zzz]) days.value[zzz] = ''


          days.value[zzz] += `<div class="${klass}">
              ${el.appealTypeTitle.toUpperCase()}
              <br> №  ${el.leadWorkflowId}
              <br> ${el.leadFirstName}
              <br> ☎: ${el.leadPhone}
              <br> 🏠: ${el.appealCity}
              </div>`
        })

        console.log('days', days)
      })
}

// function getFiled(day) {
//   console.log('day', day)
//   if(new Date().toLocaleDateString() === new Date(day).toLocaleDateString()) return '+++'
//   console.log('tableData.value', tableData.value)
//
//
//
//   return '999'
// }

onMounted(() => {
  globalStore.setTitle('Календарь')
  globalStore.steps = []
})
</script>
