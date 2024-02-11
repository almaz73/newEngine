<template>
  <main>
    <div class="admin ">
      <el-button-group class="left-admin group-button custom">
        <el-button v-for="el in lastUsedDirectories"
                   :key="el"
                   @click="found(el)"
                   :style="{width: globalStore.isMobileView?'243px':'212px'}"
                   :class="{active:el === currentDirectory}">
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
import UsersDir from "@/pages/admin/dirs/UsersDir.vue";
import BrendsDir from "@/pages/admin/dirs/BrendsDir.vue";
import ColorsDir from "@/pages/admin/dirs/ColorsDir.vue";
import OrgsDir from "@/pages/admin/dirs/OrgsDir.vue";
import InspectionDir from "@/pages/admin/dirs/InspectionDir.vue";


const globalStore = useGlobalStore()
const tab = ref(null)

const AdminDirectories = {
  'Пользователи': UsersDir,
  'Орг. структура': OrgsDir,
  'Марки': BrendsDir,
  '🚧Марки по ПТС': ClientsDir,
  'Цвета кузова': ColorsDir,
  '🚧Цвета кузова по ПТС': ClientsDir,
  'Лист осмотра': InspectionDir,
  '🚧Виды работ': ClientsDir,
  '🚧Ремонтируемые элементы': ClientsDir,
  '🚧Запчасти': ClientsDir,
  '🚧Место хранения': ClientsDir,
  '🚧Шины': ClientsDir,
  '🚧Банки': ClientsDir,
  '🚧Кредитные программы': ClientsDir,
  '🚧Тарифы': ClientsDir,
  '🚧Акции': ClientsDir,
  '🚧Тарифы страховых компаний': ClientsDir,
  '🚧Доп. оборудование': ClientsDir,
  '🚧Агентские услуги': ClientsDir,
  '🚧Источник': ClientsDir,
  '🚧СМС шаблоны': ClientsDir,
  '🚧Политики': ClientsDir,
  '🚧Шаблоны причин': ClientsDir,
  '🚧Подпись документов': ClientsDir,
  '🚧Договора': ClientsDir,
  '🚧Шаблоны документов': ClientsDir,
  '🚧Клиенты': ClientsDir,
  '🚧Программы сертификации': ClientsDir,
  '🚧Возможные неисправности': ClientsDir
}
const directories = Object.keys(AdminDirectories)

let lastUsedDirectories = ref(JSON.parse(localStorage.getItem('LastUsedDirectories')) || [])
if (!lastUsedDirectories.value.length) lastUsedDirectories.value.push('Пользователи')
const currentDirectory = ref(lastUsedDirectories.value[0])
selectDir(currentDirectory.value)

function found(val: string) {
  let count = globalStore.isMobileView ? 3 : 5;
  lastUsedDirectories.value = lastUsedDirectories.value && lastUsedDirectories.value.filter(el => el != val)
  lastUsedDirectories.value.unshift(val)
  if (lastUsedDirectories.value.length > count) lastUsedDirectories.value.length = count
  localStorage.setItem('LastUsedDirectories', JSON.stringify(lastUsedDirectories.value))
  selectDir(val)
}


function selectDir(val: string) {
  currentDirectory.value = val
  if (AdminDirectories[val]) tab.value = markRaw(AdminDirectories[val])
}


</script>