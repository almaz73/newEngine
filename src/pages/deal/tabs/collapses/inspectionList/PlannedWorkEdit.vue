<template>

  <div style="padding: 12px 30px">
    <PlannedWorkAddModal ref="modal" />
    <h1>Запланированные работы
      <el-button size="large" type="danger" @click="openModal()"
                 style="float: right" :icon="Plus">Добавить работу
      </el-button>
    </h1>

    <el-table
      class="big-table"
      :data="tableData"
      highlight-current-row
    >
      <el-table-column label="Элемент" prop="elementName" />

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
          <el-button title="Удалить" @click="deleteRow(scope.row.id)" :icon="Delete" />
        </template>
      </el-table-column>
    </el-table>

    <br>
    <el-button size="large" type="success" @click="save()">Сохранить</el-button>
    <el-button size="large" type="info" @click="$router.back()">Отменить</el-button>

    <span style="float: right; margin-right: 130px;" v-if="summ"> ИТОГО: {{ summ }} руб.</span>
  </div>
</template>

<script setup lang="ts">

import { useGlobalStore } from '@/stores/globalStore'
import { useDealStore } from '@/stores/dealStore'
import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElTable } from 'element-plus'
import { useRoute } from 'vue-router'
import { Delete, Plus } from '@element-plus/icons-vue'
import PlannedWorkAddModal from '@/pages/deal/tabs/collapses/inspectionList/PlannedWorkAddModal.vue'


const globalStore = useGlobalStore()
const dealStore = useDealStore()
const tableData = ref([])
const damages = ref([])
const works = ref([])
const route = useRoute()
const { autoId, dealId } = route.params

const modal = ref(null)
const summ = computed(() => {
  let k = 0
  tableData.value.forEach(el => k += +el.price)
  return k
})
let ind = 0

function changeWork(row) {
  row.id = row.workId
  let typeW = works.value.find(el => el.id === row.workId)
  if (typeW) row.type = typeW.type
}


function deleteRow(id: number) {
  dealStore.deletePlannedWork(id).then(res => res.status === 200 && getData())
}

function prepareSave() {
  let empty = false
  tableData.value = tableData.value.filter(el => el)
  tableData.value.map(el => {

    el.damageType = ''
    el.damageTypeArray = []
    if (el.damagesArr && el.damagesArr.length) {
      el.damagesArr.forEach(number => {
        let damageItem = damages.value.find(item => item.id == number)
        el.damageTypeArray.push(damageItem)
      })

      if (el.damagesArr) el.damageType = el.damagesArr.join(',')
    }
  })
  return empty
}

function save() {
  prepareSave()
  dealStore.savePlannedWork(tableData.value).then(res => {
    if (res.status === 200) ElMessage.success('Список запланированных работ успешно сохранен')
  })
}

function openModal() {
  modal.value.open(getData)
}

function getData() {
  dealStore.getPlannedWork(+dealId).then(res => {
    tableData.value = res.data ? res.data.items : []
    tableData.value.map(el => {
      if (el.workId === 0) el.workId = null
      if (el.price === 0) el.price = null
      el.ind = ind++
      if (el.damageType) el.damagesArr = el.damageType.split(',').map(Number)
      else el.damageType = []
    })
  })
}

onMounted(() => {
  globalStore.setTitle('Запланированные работы')
  globalStore.steps = []

  getData()

  dealStore.getDamageitem().then(res => damages.value = res.data.items)
  dealStore.getWorks().then(res => works.value = res.data.items)

  document.documentElement.scrollTop = 0
  globalStore.steps = dealStore.deal.workflowsChain
})

</script>