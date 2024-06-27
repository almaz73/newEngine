<template>
  <main>
    <div class="admin ">
      <el-button-group class="left-admin group-button custom gray-buttons">
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
import ClientsDir from "@/pages/admin/dirs/ClientsDir.vue";
import ThresholdDir from "@/pages/admin/dirs/ThresholdDir.vue";
import EstimateTabs from "@/pages/admin/dirs/estimate/EstimateTabs.vue";
import UsersDir from "@/pages/admin/dirs/UsersDir.vue";
import BrendsDir from "@/pages/admin/dirs/BrendsDir.vue";
import ColorsDir from "@/pages/admin/dirs/ColorsDir.vue";
import OrgsDir from "@/pages/admin/dirs/OrgsDir.vue";
import InspectionTabs from "@/pages/admin/dirs/inspection/InspectionTabs.vue"
import WorksDir from "@/pages/admin/dirs/WorksDir.vue";
import PossibleDamages from "@/pages/admin/dirs/PossibleDamages.vue";
import TiresDir from "@/pages/admin/dirs/TiresDir.vue"
import BanksDir from "@/pages/admin/dirs/BanksDir.vue"
import ColorsPTSDir from "@/pages/admin/dirs/ColorsPTSDir.vue"
import BrendsPTSDir from "@/pages/admin/dirs/BrendsPTSDir.vue";
import StorageDir from "@/pages/admin/dirs/StorageDir.vue"
import CreditProgramDir from "@/pages/admin/dirs/CreditProgramDir.vue"
const globalStore = useGlobalStore()
const tab = ref(null)

const AdminDirectories = {
  'Пользователи': UsersDir,
  'Орг. структура': OrgsDir,
  'Марки': BrendsDir,
  'Марки по ПТС': BrendsPTSDir,
  'Цвета кузова': ColorsDir,
  'Цвета кузова по ПТС': ColorsPTSDir,
  'Лист осмотра': InspectionTabs,
  'Виды работ': WorksDir,
  // '🚧Ремонтируемые элементы': ClientsDir,
  // '🚧Запчасти': ClientsDir,
  'Место хранения': StorageDir,
  'Шины': TiresDir,
  'V🚧Банки(Сохранение поправить)': BanksDir,
  'Кредитные программы': CreditProgramDir,
  // '🚧Тарифы': ClientsDir,
  // '🚧Акции': ClientsDir,
  // '🚧Тарифы страховых компаний': ClientsDir,
  // '🚧Доп. оборудование': ClientsDir,
  // '🚧Агентские услуги': ClientsDir,
  'V🚧Источник': ClientsDir,
  'V🚧СМС шаблоны': ClientsDir,
  'V🚧Политики': ClientsDir,
  'V🚧Шаблоны причин': ClientsDir,
  'V🚧Подпись документов': ClientsDir,
  // '🚧Договора': ClientsDir,
  // '🚧Шаблоны документов': ClientsDir,
  'V🚧Клиенты(Раздел юрлица доделать)': ClientsDir,
  'V🚧Программы сертификации': ClientsDir,
  'Возможные неисправности': PossibleDamages,
  'Пороговое значение': ThresholdDir,
  'Оценки': EstimateTabs,
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