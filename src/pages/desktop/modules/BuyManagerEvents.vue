<template>
  <div>
    <div class="notes" v-for="event in events">
      <small class="date">{{ formatDMY_hm(event.dateStart) }}</small>
      <div class="red-text">{{ event.title }}</div>
      <small style="color: #4682b4"v-if="event.clientTitle">☻: {{ event.clientTitle }}
        <small v-if="event.clientPhone"> &nbsp; &nbsp; &nbsp;☎: {{ formattingPhone(event.clientPhone) }}</small>
      </small><br>
      <small>{{event.description}}</small>
      <div v-if="event.autoTitle">🚗 {{ event.autoTitle }}</div>
      <div  class="opener" >
        <el-button size="small" @click="openAppeal(event.entityId)">Открыть</el-button>
        <el-button size="small" :icon="Plus" @click="openModalEvent()">Событие</el-button>
      </div>
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
  <SendEventModal
      ref="sendEventModal"
      :entityType="20"
      :lastTaskId="''"
      :lastTaskType="NaN"
  />
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
import {Plus} from "@element-plus/icons-vue";
import SendEventModal from "@/controls/SendEventModal.vue";

const emits = defineEmits(['returnEventCount'])

const desktopStore = useDesktopStore()
const globalStore = useGlobalStore()
const events = ref([])
const rowsPerPage = ref(5)
const total = ref(0)
const currentType = ref(null)
const sendEventModal = ref(null)
let filter = {"status": 10, limit: 5, offset: 0}

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
  let f = JSON.stringify({category: filter.status})
  desktopStore.getEventsByStatus(f, filter.limit, filter.offset).then(res => {
    globalStore.isWaiting = false
    events.value = res.events

    if (currentType.value === '20') total.value = res.eventsExpiredCount
    if (currentType.value === '10') total.value = res.eventsTodayCount
    if (currentType.value === '30') total.value = res.eventsAllCount

    emits('returnEventCount', [
      {type: 20, value: res.eventsExpiredCount},
      {type: 10, value: res.eventsTodayCount},
      {type: 30, value: res.eventsAllCount},
    ])
  })
}

function openModalEvent() {
  sendEventModal.value.open(getNews)
}

function openAppeal(id: number) {
  window.open('/v2/appeal/' + id)
}

defineExpose({getNews})
</script>
