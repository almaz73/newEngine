<template>
  <main class="reports-buttons">
    <div class="expander" ref="expander">
      <div class="expander-content filter-report ">
        <div v-if="permit('rAppealDays', 'reports')">
          <el-button :icon="Microphone" @click="changeType('rAppealDays')">Количество обращений по дням</el-button>
          Количество обращений к сотрудникам за один месяц
        </div>

        <div v-if="permit('rSellAutoDays', 'reports')">
          <el-button :icon="Microphone" @click="changeType('rSellAutoDays')">Продажи по можелям</el-button>
          Отчет по источнику обращений, по категориям создавших обращение
        </div>

        <div v-if="permit('rAppeals', 'reports')">
          <el-button :icon="Microphone" @click="changeType('rAppeals')">Обращения продаж</el-button>
          Отчет обращений продаж по месяцам
        </div>
      </div>
    </div>
    <component :is="type_report"/>
  </main>
</template>

<script setup>
import {Microphone} from "@element-plus/icons-vue";
import {markRaw, ref} from "vue";
import rSellAutoDays from "./rSellAutoDays.vue";
import rAppeals from "./rAppeals.vue";
import rAppealDays from "./rAppealDays.vue"
import {permit} from "@/utils/permit.js";

const expander = ref(null)
let tab = null
const types = {
  'rSellAutoDays': rSellAutoDays,
  'rAppeals':rAppeals,
  'rAppealDays':rAppealDays
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

