<template>
  <main class="reports-buttons">
    <div class="buttons">
      <div>
        <el-button :icon="Avatar" @click="changeType('employees')">По сотрудникам</el-button>
        Количество обращений и оценок по каждому сотруднику
      </div>
      <div>
        <el-button :icon="Calendar" @click="changeType('days')">Обращений по дням</el-button>
        Количество обращений к сотрудникам по дням
      </div>
      <div>
        <el-button :icon="Failed"> Причины архивирования</el-button>
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

    <component :is="type_report"/>
  </main>
</template>
<style>
.reports-buttons {
  margin: 0 30px;
}

.reports-buttons .el-button {
  background: var(--main-color);
  color: white;
  margin-right: 30px;
  min-width: 250px;
}
.reports-buttons .buttons{
  max-height: 50px;
  transition: max-height 1s ease-in;
  border: 1px solid blue;
  overflow: hidden;
}

.reports-buttons .buttons > div {
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
}
</style>

<script setup>
import {Avatar, Calendar, Failed, Flag, PhoneFilled, Select} from "@element-plus/icons-vue";
import {markRaw, onUnmounted, ref} from "vue";
import DaysReport from "./DaysReport.vue";
import EmployeesReport from "./EmployeesReport.vue";

const types = {
  'employees': DaysReport,
  'days': EmployeesReport
}

function changeType(val) {
  type_report.value = markRaw(types[val])
}

function open() {
  console.log('open')
  document.querySelector('.buttons').style.maxHeight='auto'
}


defineExpose({open});

const type_report = ref(null)
</script>

