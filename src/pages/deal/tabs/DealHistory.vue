<template>
  <div>
    <h1>История изменений</h1>


    <el-radio-group v-model="radio">
      <el-radio-button @click="getGrade()" label="Оценка" value="10"/>
      <el-radio-button @click="getAuto()" label="Авто" value="20"/>
    </el-radio-group>

    <el-table
        style="margin-top: 24px"
        :data="tableData"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Пользователь">
        <template #default="scope">
          {{ scope.row.userFirstName }} {{ scope.row.userLastName }}
        </template>
      </el-table-column>
      <el-table-column label="Дата" width="100">
        <template #default="scope">
          {{ formatDMY_hm(scope.row.dateOfChanges) }}
        </template>
      </el-table-column>
      <el-table-column label="Параметр">
        <template #default="scope">
          <div v-for="value in scope.row.values">
            {{ value.property }} : &nbsp; &nbsp;
            {{ value.oldValue || '_' }} ➔ {{ value.newValue }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'
import {formatDMY_hm} from '@/utils/globalFunctions'
import {ref} from 'vue'

const dealStore = useDealStore()
const radio = ref(10)
const tableData = ref([])

function open() {
  getGrade()
}

function getGrade() {
  dealStore.getBuyEditHistory(dealStore.deal.dealId).then(res => tableData.value = res.items)
}

function getAuto() {
  dealStore.getBuyAutoEditHistory(dealStore.deal.dealId).then(res => tableData.value = res.items)
}

defineExpose({open})

</script>

