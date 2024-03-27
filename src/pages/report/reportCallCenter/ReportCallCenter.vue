<template>
  <main class="reports-buttons">
    <div class="expander" ref="expander">
      <div class="expander-content filter-report ">
        <div>
          <el-button :icon="Avatar" @click="changeType('employees')">По сотрудникам</el-button>
          Количество обращений и оценок по каждому сотруднику
        </div>
        <div>
          <el-button :icon="Calendar" @click="changeType('days')">Обращений по дням</el-button>
          Количество обращений к сотрудникам по дням
        </div>
        <div>
          <el-button :icon="Failed" @click="changeType('archive')"> Причины архивирования</el-button>
          Отчет по причинам архивирования обращений клиентов
        </div>
        <div>
          <el-button :icon="PhoneFilled">По звонкам</el-button>
          Отчет по звонкам сотрудника за месяц
        </div>
        <div>
          <el-button :icon="Select">По выкупу а/м</el-button>
          Отчет по выкупу а/м
        </div>
        <div>
          <el-button :icon="Flag"> По актуальности</el-button>
          Отчет актуальности обращений
        </div>
      </div>
    </div>
    <component :is="type_report"/>
  </main>
</template>
<style>
.expander {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows .7s;
}

.expander-content {
  min-height: 0;
  transition: visibility .3s ease-out;
  visibility: hidden;
}

.expander.expanded {
  grid-template-rows: 1fr;
}

.expander.expanded .expander-content {
  visibility: visible;
}

.reports-buttons .expander-content .el-button {
  background: var(--main-color);
  color: white;
  margin-right: 30px;
  min-width: 280px;
}

.reports-buttons .expander-content > div {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}
</style>


<script setup>
import {Avatar, Calendar, Failed, Flag, PhoneFilled, Select} from "@element-plus/icons-vue";
import {markRaw, ref} from "vue";
import rDays from "./rDays.vue";
import rEmployees from "./rEmployees.vue";
import rArchive from "./rArchive.vue"

const expander = ref(null)
let tab = null
const types = {
  'employees': rEmployees,
  'days': rDays,
  'archive': rArchive
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

