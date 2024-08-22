<template>
  <div style="padding: 12px 30px">
    <p>Сервисные работы</p>

    <el-table
      class="big-table"
      :data="tableData"
      highlight-current-row
    >
      <el-table-column label="Работа" width="220">
        <template #default="scope">
          <el-select v-model="scope.row.workId"
                     @change="changeWork(scope.row)"
                     filterable placeholder="Выберите значение">
            <el-option v-for="(item, ind) in works"
                       :key="ind"
                       :label="item.name"
                       :value="item.id" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Тип работы" prop="typeTitle">
        <template #default="scope">
          {{ WorkTypeEnum[scope.row.type] }}
        </template>
      </el-table-column>


      <el-table-column label="Элемент" width="90" />

      <el-table-column label="Повреждения">
        <template #default="scope">
          <el-select v-model="scope.row.damagesArr"
                     style="min-width: 220px"
                     multiple filterable placeholder="Добавить">
            <el-option v-for="item in damages"
                       :key="item.id"
                       :label="item.damageName"
                       :value="item.id" />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="Стоимость">
        <template #default="scope">
          <el-input v-model="scope.row.price" />
        </template>
      </el-table-column>

      <el-table-column label="Комментарий">
        <template #default="scope">
          <el-input type="textarea" v-model="scope.row.comment" />
        </template>
      </el-table-column>

      <el-table-column label="" width="80">
        <template #default="scope">
          <el-button @click="deleteRow(scope.row.ind)" :icon="Delete" />
        </template>
      </el-table-column>
    </el-table>

    <br>
    <el-button size="large" type="danger" @click="add()">Добавить</el-button>
    <el-button size="large" type="success" @click="save()">Сохранить</el-button>
    <el-button size="large" type="info" @click="$router.back()">Отменить</el-button>
  </div>
</template>

<script setup lang="ts">

import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import { onMounted, ref } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { useRoute } from 'vue-router'
import { WorkTypeEnum } from '@/utils/globalConstants'
import { Delete } from '@element-plus/icons-vue'


const globalStore = useGlobalStore()
const dealStore = useDealStore()
const tableData = ref([])
const damages = ref([])
const works = ref([])
const route = useRoute()

const { autoId, dealId } = route.params
let ind = 0

function changeWork(row) {
  row.id = row.workId
  let typeW = works.value.find(el => el.id === row.workId)
  if (typeW) row.type = typeW.type
}

function add() {
  console.log(' add')
  tableData.value.push({
    comment: null,
    damages: null,
    damagesText: null,
    id: 0,
    price: 0,
    repairElementId: 0,
    type: 0,
    workflowId: 0
  })
}

function deleteRow(ind: number) {
  delete tableData.value[ind]
}

function prepareSave() {
  let empty = false
  tableData.value = tableData.value.filter(el => el)
  tableData.value.map(el => {
    el.damagesText = ''
    el.damages = []
    if (el.damagesArr.length) {
      el.damagesText = (el.damagesArr.join(';') + ';')
      el.damagesArr.forEach(number => {
        let damageItem = damages.value.find(item => item.id == number)
        el.damages.push(damageItem)
      })
    }
    if (el.id === 0) empty = true
  })
  return empty
}

function save() {
  let isEmpty = prepareSave()
  if (isEmpty) return ElMessage.warning('Пполе "Работа" обязательна для заполнения')


  dealStore.saveServiceworks(tableData.value).then(res => {
    if (res.status === 200) ElMessage.success('Успешно')
  })
}

onMounted(() => {
  globalStore.setTitle('Сервисные работы')
  globalStore.steps = []

  dealStore.getDamageitem().then(res => damages.value = res.data.items)
  dealStore.getWorks().then(res => works.value = res.data.items)
  dealStore.getservicework(dealId).then(res => {
    tableData.value = res.data.items
    tableData.value.map(el => el.damagesArr = el.damages && el.damages.map(item => item.id))
    tableData.value.map(el => el.workId = el.id || null)
    tableData.value.map(el => el.workflowId = dealId)
    tableData.value.map(el => el.ind = ind++)
  })


  document.documentElement.scrollTop = 0
})

</script>