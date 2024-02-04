<template>
  <main>
    <div class="admin">
      <el-button-group class="left-admin group-button">
        <el-button v-for="el in lastUsedDirectories"
                   :key="el"
                   @click="clickBotton(el)"
                   :style="{width: globalStore.isMobileView?'203px':'222px'}"
                   :class="{active:el === directory}">
          {{ el }}
        </el-button>

        <el-select
            placeholder="Выбери справочник"
            @change="found"
            clearable
            filterable>
          <el-option v-for="(item, ind) in directories"
                     :key="ind" :label="item"
                     :value="item"/>
        </el-select>
      </el-button-group>


      <div class="admin__Filed">
        <component :is="tab"></component>
      </div>
    </div>

  </main>
</template>


<script setup lang="ts">

import {markRaw, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import ClientsDir from "@/pages/admin/ClientsDir.vue";
import UsersDir from "@/pages/admin/UsersDir.vue";
import MarksDir from "@/pages/admin/MarksDir.vue";

const globalStore = useGlobalStore()
const tab = ref(null)

const AdminDirectories = {
  'Пользователи': UsersDir,
  'Орг. структура': UsersDir,
  'Марки': MarksDir,
  'Марки по ПТС': ClientsDir,
  'Цвета кузова': ClientsDir,
  'Цвета кузова по ПТС': ClientsDir,
  'Лист осмотра': ClientsDir,
  'Виды работ': ClientsDir,
  'Ремонтируемые элементы': ClientsDir,
  'Запчасти': ClientsDir,
  'Место хранения': ClientsDir,
  'Шины': ClientsDir,
  'Банки': ClientsDir,
  'Кредитные программы': ClientsDir,
  'Тарифы': ClientsDir,
  'Акции': ClientsDir,
  'Тарифы страховых компаний': ClientsDir,
  'Доп. оборудование': ClientsDir,
  'Агентские услуги': ClientsDir,
  'Источник': ClientsDir,
  'СМС шаблоны': ClientsDir,
  'Политики': ClientsDir,
  'Шаблоны причин': ClientsDir,
  'Подпись документов': ClientsDir,
  'Договора': ClientsDir,
  'Шаблоны документов': ClientsDir,
  'Клиенты': ClientsDir,
  'Программы сертификации': ClientsDir,
  'Возможные неисправности': ClientsDir
}


const directories = Object.keys(AdminDirectories)

let lastUsedDirectories = ref(JSON.parse(localStorage.getItem('LastUsedDirectories')) || [])
const directory = ref(lastUsedDirectories.value[0])

function found(val) {
  let count = globalStore.isMobileView ? 3 : 5;
  lastUsedDirectories.value = lastUsedDirectories.value && lastUsedDirectories.value.filter(el => el != val)
  lastUsedDirectories.value.unshift(val)
  if (lastUsedDirectories.value.length > count) lastUsedDirectories.value.length = count
  localStorage.setItem('LastUsedDirectories', JSON.stringify(lastUsedDirectories.value))

  clickBotton(val)
}

function clickBotton(val) {
  directory.value = val
  tab.value = markRaw(AdminDirectories[val])
}


</script>