<template>
  <main class="reports-buttons">
    <div class="expander" ref="expander">
      <div class="expander-content filter-report ">
        <div v-if="permit('rSourceRequests', 'reports')">
          <el-button :icon="Microphone" @click="changeType('rSourceRequests')">Источний обращений</el-button>
          Отчет по источнику обращений, по категориям создавших обращение
        </div>
        <div v-if="permit('rCredit', 'reports')">
          <el-button :icon="CreditCard" @click="changeType('rCredit')">Кредит</el-button>
          Отчет по заявкам на кредит
        </div>
        <div v-if="permit('rDeals', 'reports')">
          <el-button :icon="Box" @click="changeType('rDeals')">Информация по сделкам</el-button>
          Отчёт, содержащий информацию о сделках за указанный период
        </div>
      </div>
    </div>
    <component :is="type_report"/>
  </main>
</template>


<script setup>
import {Microphone, Box, CreditCard} from "@element-plus/icons-vue";
import {markRaw, ref} from "vue";
import rSourceRequests from "./rSourceRequests.vue";
import rCredit from "./rCredit.vue"
import rDeals from "./rDeals.vue";
import {permit} from "@/utils/permit.js";

const expander = ref(null)
let tab = null
const types = {
  'rSourceRequests': rSourceRequests,
  'rDeals':rDeals,
  'rCredit':rCredit
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

