<template>
  <main class="reports-buttons">
    <div class="expander" ref="expander">
      <div class="expander-content filter-report ">
        <div v-if="permit('reports','rAppealDays')">
          <el-button :icon="Microphone" @click="changeType('rAppealDays')">Количество обращений по дням</el-button>
          Количество обращений к сотрудникам за один месяц
        </div>

        <div v-if="permit('reports','rSellAutoDays')">
          <el-button :icon="Microphone" @click="changeType('rSellAutoDays')">Продажи по можелям</el-button>
          Отчет по источнику обращений, по категориям создавших обращение
        </div>

        <div v-if="permit('reports','rAppeals')">
          <el-button :icon="Microphone" @click="changeType('rAppeals')">Обращения продаж</el-button>
          Отчет обращений продаж по месяцам
        </div>

        <div v-if="permit('reports','rEfficienceCell')">
          <el-button :icon="Microphone" @click="changeType('rEfficienceCell')">Эффективность</el-button>
          Эффективность
        </div>

        <div v-if="permit('reports','rCallCenterCalls')">
          <el-button :icon="Microphone" @click="changeType('rCallCenterCalls')">Отчет по специалистам контакт-центра</el-button>
          Отчет по специалистам контакт-центра Звонки
        </div>

        <div v-if="permit('reports','rCreditFunnel')">
          <el-button :icon="Microphone" @click="changeType('rCreditFunnel')">Отчет по менеджерам КСО</el-button>
          Отчет по менеджерам КСО
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
import {Microphone} from "@element-plus/icons-vue";
import {markRaw, ref} from "vue";
import rSellAutoDays from "./rSellAutoDays.vue";
import rAppeals from "./rAppeals.vue";
import rAppealDays from "./rAppealDays.vue"
import rEfficienceCell from "./rEfficienceCell.vue"
import rCallCenterCalls from "./rCallCenterCalls.vue"
import rCreditFunnel from "./rCreditFunnel.vue"
import {permit} from "@/utils/permit.js";

const expander = ref(null)
let tab = null
const types = {
  "rSellAutoDays": rSellAutoDays,
  "rAppeals": rAppeals,
  "rAppealDays": rAppealDays,
  "rEfficienceCell": rEfficienceCell,
  "rCallCenterCalls": rCallCenterCalls,
  "rCreditFunnel": rCreditFunnel
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

