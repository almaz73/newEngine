<template>
  <main>
    <div class="canvas">

      <el-button-group v-model="appeal.lead.leadType" class="group-button">
        <div>Клиент</div>
        <br>
        <el-button @click="appeal.lead.leadType=10" :class="{active:appeal.lead.leadType==10}">
          Физ.лицо
        </el-button>
        <el-button @click="appeal.lead.leadType=20" :class="{active:appeal.lead.leadType==20}">
          Юр.лицо
        </el-button>
      </el-button-group>

      <div class="fields">
        <div v-if="appeal.lead.leadType==10">Юридическое лицо</div>
        <div v-if="appeal.lead.leadType==20">Физическое лицо</div>
        <br>
        <el-input placeholder="Основной телефон" v-model="appeal.lead.person.phone"
                  style="position: relative"></el-input>
        <div v-if="appeal.lead.person.phone" class="label">Основной телефон</div>
        <el-input placeholder="Подменный телефон" v-model="appeal.workflow.swapPhone"></el-input>
        <div v-if="appeal.workflow.swapPhone" class="label">Подменный телефон</div>

        <el-input placeholder="Эл.почта" v-model="appeal.lead.person.email"></el-input>
        <el-input placeholder="Имя" v-model="appeal.lead.person.firstName"></el-input>
        <el-input placeholder="Отчество" v-model="appeal.lead.person.middleName"></el-input>
        <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName"></el-input>
      </div>
    </div>

    <div class="canvas">

      <el-button-group v-model="appeal.lead.leadType" class="group-button">
        <div>Обращение</div>
        <br>
        <el-button v-for="workflow in workflows"
                   :key="workflow.id"
                   @click="appeal.workflow.workflowLeadType=workflow.value"
                   :class="{active:workflow.value == appeal.workflow.workflowLeadType}">
          {{ workflow.title }}
        </el-button>
      </el-button-group>

      <div class="fields">
        <div>{{ workflows.find(el => el.value == appeal.workflow.workflowLeadType).title }}</div>
        <br>
        <el-input placeholder="Основной телефон" v-model="appeal.lead.person.phone"
                  style="position: relative"></el-input>
        <el-input placeholder="Подменный телефон" v-model="appeal.workflow.swapPhone"></el-input>
        <el-input placeholder="Эл.почта" v-model="appeal.lead.person.email"></el-input>
        <el-input placeholder="Имя" v-model="appeal.lead.person.firstName"></el-input>
        <el-input placeholder="Отчество" v-model="appeal.lead.person.middleName"></el-input>
        <el-input placeholder="Фамилия" v-model="appeal.lead.person.lastName"></el-input>
      </div>
    </div>

    <el-button @click="save()">Сохранить</el-button>
  </main>
</template>
<style>
.canvas {
  background: white;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dark .canvas {
  background: black;
}

.group-button {
  width: 200px
}

.group-button button {
  width: 180px;
  opacity: 0.4;
}

@media (width < 500px) {
  .group-button {
    width: 130px;
    margin-left: -10px;
  }

  .group-button button {
    width: 130px;
    opacity: 0.4;
  }
}

.fields {
  width: 180px;
}

.group-button button.active {
  color: white !important;
  opacity: 1;
  background: #6d6d6d !important;
  position: relative;
}

.group-button button.active::after {
  content: '';
  position: absolute;
  right: -7px;
  top: 9px;
  border-top: 7px solid transparent;
  border-left: 7px solid #6d6d6d;
  border-bottom: 7px solid transparent;
}

</style>
<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";

const globalStore = useGlobalStore()
const workflows = [
  {id: 2, value: 2, title: 'Выкуп'},
  {id: 1, value: 1, title: 'Продажа'},
  {id: 3, value: 3, title: 'Сервис'},
  {id: 4, value: 4, title: 'КСО'},
  {id: 5, value: 5, title: 'Fleet'},
  {id: 7, value: 7, title: 'Доп.оборуд.'},
  {id: 8, value: 8, title: 'Комиссия'},
  {id: 9, value: 9, title: 'Подбор авто'},
  {id: 10, value: 10, title: 'Сделка через салон'},
]

let appeal = ref({
  lead: {
    leadType: 10,
    person: {phone: '', email: '', firstName: '', lastName: '', middleName: ''}
  },
  workflow: {swapPhone: '', workflowLeadType: 2},
  communication: {}
})

function save() {
  console.log('appeal', appeal.value)
}

globalStore.setTitle('Новое обращение')
globalStore.steps = []
</script>