<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabChange">
    <el-tab-pane :label="'События '+(countEvents?`(${countEvents})`:'')" name="eventsTab">


      <el-table :data="events"
                highlight-current-row
                :size="'small'">
        <!--              <el-table-column>-->
        <!--                <template #default="scope">-->
        <!--                  <span style="">{{ scope.row.action }}: <b>{{ scope.row.comment }}</b></span>-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <el-table-column prop="title"/>
        <el-table-column prop="dateStart"/>
        <el-table-column prop="person.lastName"/>
      </el-table>

    </el-tab-pane>
    <el-tab-pane :label="'SMS '+(countSms?`(${countSms})`:'')" name="smsTab">
      <el-scrollbar maxHeight="180px">
        <div v-for="sms in listSMS" :key="sms.id" class="collapse-blocks sms">
          <span class="label-red label-right">Текст:</span> {{ sms.smsText }}<br>
          <span class="label-red label-right">Дата:</span> {{ formatDMY_hm(sms.sendDate) }}<br>
          <span class="label-red label-right">Статус:</span> {{ sms.statusText }}<br>
          <span class="label-red label-right">Комментарий:</span> {{ sms.comment }}<br>
        </div>
      </el-scrollbar>

    </el-tab-pane>

    <el-tab-pane :label="'История '+(countHistory?`(${countHistory})`:'')" name="historyTab">
      <el-timeline>
        <el-timeline-item

            v-for="(hist, index) in history"
            :key="index"
            :hollow="true"
            :timestamp="hist.createDate"
        >
          {{ hist.action }}: <b>{{ hist.comment }}</b> <span style="float: right">{{ hist.userTitle }}</span>
        </el-timeline-item>
      </el-timeline>

    </el-tab-pane>
    <el-tab-pane :label="'Комментарии '+(countComments?`(${countComments})`:'')" name="commentsTab">
      <div v-for="com in comments" :key="com.id" class="collapse-blocks">
        <div><span class="label-red">{{com.userName}} </span>
          <span style="float: right">{{ formatDMY_hm(com.createDate) }}</span></div>
        <div>{{com.text}}</div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import {formatDMY_hm} from "@/utils/globalFunctions";
import {ElTable} from "element-plus";
import {ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";


const {appealId} = defineProps(['appealId'])

const appealStore = useAppealStore()
const activeName = ref('eventsTab')
const listSMS = ref([])
const countSms = ref(0)
const history = ref([])
const countHistory = ref(0)
const events = ref([])
const countEvents = ref(0)
const comments = ref([])
const countComments = ref(0)

getEvents()

function getEvents() {
  appealStore.getEventAppeal(appealId).then(res => {
    console.log('events', res)
    events.value = res.items
    countEvents.value = res.items.length
  })
}

function getSms() {
  appealStore.getSMS(appealId).then(res => {
    listSMS.value = res.items
    countSms.value = res.items.length
  })
}

function getHistory() {
  appealStore.getHistory(appealId).then(res => {
    history.value = res.models
    countHistory.value = res.models.length
  })
}

function getComments() {
  appealStore.getComments(appealId).then(res => {
    comments.value = res.items
    countComments.value = res.count
  })
}


function tabChange(val) {
  if (val === 'eventsTab') getEvents()
  if (val === 'smsTab') getSms()
  if (val === 'historyTab') getHistory()
  if (val === 'commentsTab') getComments()
  console.log('tabChange', val)
}

</script>