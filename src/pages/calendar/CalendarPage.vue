<template>
  <main class="calendar">
    <div style="margin-bottom: 10px">
      <label><small style="cursor: pointer"> Отображать завершенные события </small>&nbsp;
        <el-checkbox @change="changeDate()" v-model="showExpired"/>
      </label> &nbsp; &nbsp; &nbsp; &nbsp;
      <label><small style="cursor: pointer"> Отображать встречи колл-центра</small> &nbsp;
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
        <div v-for="appeal in days[data.day]" :key="appeal.id"
             @click.stop="openAppeal(appeal.id)"
             v-html="appeal.html"/>
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
import {onMounted, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useCalendarStore} from "@/stores/calendarStore";
import type {CalendarDateType, CalendarInstance} from 'element-plus'
import router from "@/router";

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
  getEvents(changedDate.value.getFullYear(), changedDate.value.getMonth())
}

getEvents(new Date().getFullYear(), new Date().getMonth())

function changeDate() {
  getEvents(changedDate.value.getFullYear(), changedDate.value.getMonth())
}

function openAppeal(id: number) {
  router.push({path: '/appeal/' + id})
}

function getEvents(year: number, month: number) {
  days.value = []

  calendarStore.getEvents(year, month, showExpired.value, showVisitEvents.value)
      .then(res => {
        tableData.value = res.items
        tableData.value.forEach(el => {
          let day = new Date(el.dateStart).toLocaleDateString().split('.').reverse().join('-')
          let klass = 'block'
          if (el.appealType == 4) klass += ' grey'
          if (!days.value[day]) days.value[day] = []

          days.value[day].push({
            html: `<div class="${klass}">
              ${el.appealTypeTitle.toUpperCase()}  №  ${el.leadWorkflowId}
              <br> ${el.leadFirstName}
              <br> ☎: ${el.leadPhone}  🏠: ${el.appealCity}
              </div>`, id: el.leadWorkflowId
          })
        })
      })
}

onMounted(() => {
  globalStore.setTitle('Календарь')
  globalStore.steps = []
})
</script>
