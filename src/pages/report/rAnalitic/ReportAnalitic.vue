<template>
  <main class="reports-buttons">
    <div class="expander" ref="expander">
      <div class="expander-content filter-report ">
        <div v-if="permit('rEfficiency', 'reports')">
          <el-button :icon="Microphone" @click="changeType('rEfficiency')">Эффективность</el-button>
          Эффективность работы сотрудников аналитического центра
        </div>
      </div>
    </div>
    <component :is="type_report"/>
  </main>
</template>

<script setup>
import {Microphone} from "@element-plus/icons-vue";
import {markRaw, ref} from "vue";
import rEfficiency from "./rEfficiency.vue";
import {permit} from "@/utils/permit.js";

const expander = ref(null)
let tab = null
const types = {
  'rEfficiency': rEfficiency,
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

