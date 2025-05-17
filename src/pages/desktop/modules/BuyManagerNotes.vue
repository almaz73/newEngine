<template>
  <div>
    <div class="notes" v-for="appeal in appeals">
      <small class="date">{{ formatDMY_hm(appeal.createDate) }}</small>
      <div class="red-text">{{ appeal.leadName }}</div>
      <div v-if="appeal.leadPhone">☎: {{ formattingPhone(appeal.leadPhone) }}</div>
      <div v-if="appeal.carBrandModel">🚗 {{ appeal.carBrandModel }}</div>
      <el-button size="small" class="opener" @click="openAppeal(appeal.id)">Открыть</el-button>
    </div>

    <template v-if="total>2">
      <el-pagination
          size="small"
          v-model:page-size="rowsPerPage"
          :page-sizes="[5, 10, 20, 50]"
          layout="prev, pager, next, sizes"
          @current-change="changePage"
          @size-change="changePageSize"
          :total="total"
      />
    </template>
  </div>
</template>

<style>
.desk-panels .el-select--small {
  width: 73px;
}
</style>

<script setup lang="ts">
import {formatDMY_hm, formattingPhone} from "@/utils/globalFunctions";
import {ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useDesktopStore} from "@/stores/desktopStore";

const emits = defineEmits(['returnNoteCount'])

const desktopStore = useDesktopStore()
const globalStore = useGlobalStore()
const appeals = ref([])
const rowsPerPage = ref(7)
const total = ref(0)
const currentType = ref(null)
let filter = {"status": 10, "statuses": [10, 11], limit: 7, offset: 0}

function changePage(val: number) {
  filter.offset = (val - 1) * rowsPerPage.value
  getNews(currentType.value)
}


function changePageSize(val: number) {
  rowsPerPage.value = val
  filter.offset = 0
  filter.limit = rowsPerPage.value
  getNews(currentType.value)
}


function getNews(val: number = 10) {
  filter.status = currentType.value = val
  globalStore.isWaiting = true
  let f = JSON.stringify({status: filter.status, statuses: filter.statuses})
  desktopStore.getLeadWorkflowsByStatus(f, filter.limit, filter.offset).then(res => {
    globalStore.isWaiting = false
    appeals.value = res.appeals
    total.value = res.appealsCount
    emits('returnNoteCount', {type: currentType.value, value: total.value})
  })
}

function openAppeal(id: number) {
  window.open('/v2/appeal/' + id)
}

defineExpose({getNews})
</script>
