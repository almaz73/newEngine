<template>
  <div>
    <div v-for="item in listData">
      <div v-if="!(globalStore.showOnlyErrors && item.isNorm)">
        <div style="max-width: 350px ;float: left">{{ item.name }}</div>

        <div style="float: right; cursor: pointer"
             @click="changeItem(item)"
             @mouseover="item.isNorm=!item.isNorm"
             @mouseleave="toMouseLeave(item)"
        >
          <el-button
              :type="!item.isNorm?'danger':'success'" style="width: 150px; pointer-events:none">
            <span>  {{ item.isNorm ? 'Норма' : 'Не норма!' }}</span>

          </el-button>
        </div>

        <div style="clear: both"></div>

        <div v-if="dangerField[item.id]">
          777777<br>777<br>77
        </div>
        <el-divider/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/stores/globalStore";
import { ref} from "vue";

const globalStore = useGlobalStore()
const auto = ref({})
const dangerField = ref({})
const chapok = ref(false)
const dealId = ref(null)
const autoId = ref(null)
const inspectionId = ref(null)
const defects = ref({  red: 0,  yellow: 0,  total: 0});
const listData = ref([])


function toMouseLeave(item) {
  if (!chapok.value) item.isNorm = !item.isNorm
  chapok.value = false
}


function changeItem(item) {
  if(chapok.value) item.isNorm = !item.isNorm
  dangerField.value[item.id] = !item.isNorm
  chapok.value = true
}

function open(_listData) {
  console.log('40 открыли ВНУТРЕННИЙ  осмотр  ')
  globalStore.setTitle('Внутренний осмотр')

  listData.value = _listData
  listData.value.forEach(el => dangerField.value[el.id] = !el.isNorm) // раскрываем поля с ошибками
}

defineExpose({open})
</script>