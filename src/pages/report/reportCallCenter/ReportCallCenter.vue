<template>
  <main class="reports-buttons">
    <div class="expander" ref="expander">
      <div class="expander-content filter-report ">
        <div v-if="permit('rEmployees', 'reports')">
          <el-button :icon="Avatar" @click="changeType('rEmployees')">По сотрудникам</el-button>
          Количество обращений и оценок по каждому сотруднику
        </div>
        <div v-if="permit('rDays', 'reports')">
          <el-button :icon="Calendar" @click="changeType('rDays')">Обращений по дням</el-button>
          Количество обращений к сотрудникам по дням
        </div>
        <div v-if="permit('rArchive', 'reports')">
          <el-button :icon="Failed" @click="changeType('rArchive')"> Причины архивирования</el-button>
          Отчет по причинам архивирования обращений клиентов
        </div>
        <div  v-if="permit('rCalls', 'reports')">
          <el-button :icon="PhoneFilled" @click="changeType('rCalls')">По звонкам</el-button>
          Отчет по звонкам сотрудника за месяц
        </div>
        <div  v-if="permit('rBuyout', 'reports')">
          <el-button :icon="Select" @click="changeType('rBuyout')">По выкупу а/м</el-button>
          Отчет по выкупу а/м
        </div>
        <div  v-if="permit('rAсtual', 'reports')">
          <el-button :icon="Flag" @click="changeType('rAсtual')"> По актуальности</el-button>
          Отчет актуальности обращений
        </div>
      </div>
    </div>
    <component :is="type_report"/>
  </main>
</template>


<script setup>
import {Avatar, Calendar, Failed, Flag, PhoneFilled, Select} from "@element-plus/icons-vue";
import {markRaw, ref} from "vue";
import rDays from "./rDays.vue";
import rEmployees from "./rEmployees.vue";
import rArchive from "./rArchive.vue"
import rCalls from "./rCalls.vue"
import rBuyout from "./rBuyout.vue"
import rAсtual from "./rAсtual.vue"
import {permit} from "@/utils/permit.js";

const expander = ref(null)
let tab = null
const types = {
  'rEmployees': rEmployees,
  'rDays': rDays,
  'rArchive': rArchive,
  'rCalls': rCalls,
  'rBuyout': rBuyout,
  'rAсtual': rAсtual
}

function changeType(report, memory) {
  expander.value.classList.remove("expanded")
  type_report.value = markRaw(types[report])
  if (!memory) localStorage.setItem('LastReport', JSON.stringify({tab, report}))
}

function open(path) {
  tab = path.tab
  if (!path.report) hideTable()
  else changeType(path.report, true)
}

function hideTable() {
  expander.value.classList.add("expanded")
  type_report.value = null
}


defineExpose({open});

const type_report = ref(null)
</script>

