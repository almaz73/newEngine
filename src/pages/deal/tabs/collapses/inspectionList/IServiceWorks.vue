<template>
  <div>
    <p>Сервисные работы</p>

    <el-table
        class="big-table"
        :data="tableData"
        highlight-current-row
    >
      <el-table-column label="Работа" width="180">
        <template #default="scope">
          <el-select v-model="scope.row.workId" filterable placeholder="Выберите значение">
            <el-option v-for="item in works"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"/>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Тип работы"/>
      <el-table-column label="Элемент"/>

      <el-table-column label="Повреждения" minWidth="120">
        <template #default="scope">
          <el-select v-model="scope.row.damagesArr" multiple filterable>
            <el-option v-for="item in damages"
                       :key="item.id"
                       :label="item.damageName"
                       :value="item.id"/>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Стоимость">
        <template #default="scope">
          <el-input v-model="scope.row.price"/>
        </template>
      </el-table-column>

      <el-table-column label="Комментарий">
        <template #default="scope">
          <el-input type="textarea" v-model="scope.row.comment"/>
        </template>
      </el-table-column>

      <el-table-column label=""/>
    </el-table>

  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from "@/stores/dealStore";
import {onMounted, ref} from "vue";
import {ElTable} from "element-plus"
import {useRoute} from "vue-router";

const globalStore = useGlobalStore()
const dealStore = useDealStore()
const tableData = ref([])
const damages = ref([])
const works = ref([])
const route = useRoute()

const {autoId, dealId} = route.params


onMounted(() => {
  globalStore.setTitle('Сервисные работы')
  globalStore.steps = []

  dealStore.getDamageitem().then(res => damages.value = res.data.items)

  dealStore.getservicework(dealId).then(res => {
    tableData.value = res.data.items
    tableData.value.map(el => el.damagesArr = el.damages.map(item => item.id))
    tableData.value.map(el => el.workId = el.id || null)
  })

  dealStore.getWorks().then(res =>  works.value = res.data.items)


})

</script>