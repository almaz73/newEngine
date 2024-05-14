<template>
  <main class="reports-buttons">
    <div class="expander" ref="expander">
      <div class="expander-content filter-report ">
        <div v-if="permit('rSellAutoDays', 'reports')">
          <el-button :icon="Microphone" @click="changeType('rSellAutoDays')">Источний обращений</el-button>
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
import {permit} from "@/utils/permit.js";

const expander = ref(null)
let tab = null
const types = {
  'rSellAutoDays': rSellAutoDays,
  'rAppeals':rAppeals
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

