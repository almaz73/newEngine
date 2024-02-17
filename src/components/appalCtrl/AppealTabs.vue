<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabChange">
    <el-tab-pane :label="'События '+(countEvents?`( ${countEvents} )`:'')" name="eventsTab">
      <el-scrollbar maxHeight="220px">
        <el-button :icon="Plus" @click="openModalEvent()" style="margin: 0 8px">Создать событие</el-button>

        <div v-for="ev in events" :key="ev.id" class="collapse-blocks">
          <div><span style="font-size: large">{{ ev.title }} </span> &nbsp; &nbsp;
            <u><a @click="closeEvent(ev)" v-if="canCloseEvent(ev)">
              ❌ Закрыть
            </a></u>
            <div style="float: right" v-html="getPeriods(ev)"/>
          </div>
          <div><span class="label-right">Описание:</span> {{ ev.description }}</div>
          <div><span class="label-right">Ответственный:</span> {{ ev.responsible.person.lastName }}
            {{ ev.responsible.person.firstName }}
          </div>
          <div><span class="label-right">Составитель:</span> {{ ev.createdUser.person.lastName }}
            {{ ev.createdUser.person.firstName }}
          </div>
          <!--          <div><span class="label-right">Создано:</span> {{ formatDMY_hm(ev.createDate) }}</div>-->
          <div><span class="label-right">Статус:</span> {{ ev.statusTitle }}</div>
          <div>{{ ev.text }}</div>
        </div>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane :label="'SMS '+(countSms?`( ${countSms} )`:'')" name="smsTab">
      <el-scrollbar maxHeight="220px">
        <el-button @click="openModalSms()" :icon="Plus">Отправить СМС-сообщение клиенту</el-button>
        <div v-for="sms in listSMS" :key="sms.id" class="collapse-blocks sms">
          <span class="label-red label-right">Текст:</span> {{ sms.smsText }}<br>
          <span class="label-red label-right">Дата:</span> {{ formatDMY_hm(sms.sendDate) }}<br>
          <span class="label-red label-right">Статус:</span> {{ sms.statusText }}<br>
          <span class="label-red label-right">Комментарий:</span> {{ sms.comment }}<br>
        </div>
      </el-scrollbar>

    </el-tab-pane>

    <el-tab-pane :label="'История '+(countHistory?`( ${countHistory} )`:'')" name="historyTab">
      <el-scrollbar maxHeight="220px">
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
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane :label="'Комментарии '+(countComments?`( ${countComments} )`:'')" name="commentsTab">

      <el-scrollbar maxHeight="220px">
        <div>
          <el-input type="textarea" rows="1" style="width: 600px; margin:0 8px"
                    placeholder="Добавьте комментарий"
                    v-model="commentTxt"/>
          <el-button @click="sendComment()" :icon="Plus" v-if="commentTxt">Добавить комментарий</el-button>
        </div>
        <div v-for="com in comments" :key="com.id" class="collapse-blocks">
          <div><span class="label-red">{{ com.userName }} </span>
            <span style="float: right">{{ formatDMY_hm(com.createDate) }}</span></div>
          <div>{{ com.text }}</div>
        </div>
      </el-scrollbar>
    </el-tab-pane>
    <el-tab-pane label="Фото автомобиля" name="photoTab" v-if="carPhoto">
      <img style="width:500px; padding-left: calc(50% - 250px)" :src="carPhoto" alt=""/>
    </el-tab-pane>
  </el-tabs>
  <SendEventModal ref="sendEventModal"/>
  <SendSmsModal ref="sendSmsModal"/>
</template>
<script setup>
import {formatDateDDMMYYYY, formatDMY_hm} from "@/utils/globalFunctions";
import {ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {Plus} from "@element-plus/icons-vue";
import SendEventModal from "@/components/appalCtrl/SendEventModal.vue";
import SendSmsModal from "@/components/appalCtrl/SendSmsModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {EventStatusEnums} from "@/utils/globalConstants";


const globalStore = useGlobalStore()
const {carPhoto} = defineProps(['carPhoto'])
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
const sendEventModal = ref(null)
const sendSmsModal = ref(null)
const appeal = ref(null)
const commentTxt = ref('')


function getPeriods(ev) {
  let startTime = new Date(ev.dateStart).getHours() + ':' + new Date(ev.dateStart).getMinutes()
  let endTime = new Date(ev.dateEnd).getHours() + ':' + new Date(ev.dateEnd).getMinutes()

  return formatDateDDMMYYYY(ev.createDate) + '  c  <b class="label-red">' + startTime + '</b> до <b class="label-red">' + endTime + '</b>'
}

function getEvents(noCach) {
  appealStore.getEvents(appeal.value.id, noCach).then(res => {
    events.value = res.items
    countEvents.value = res.items.length
  })
}


function closeEvent() {
  appealStore.closeComment(event.id)
}

function canCloseEvent(event) {
  if ((event.status !== EventStatusEnums['Закрыта'] && appeal.value.status !== 17 &&
          event.responsible.id === globalStore.account.id && globalStore.account.id !== appeal.value.responsibleUser.id) ||
      (event.status !== EventStatusEnums['Закрыта'] && globalStore.account.role === 'Admin')) return true
}

function openModalSms() {
  sendSmsModal.value.open(appeal.value, getSms)
}

function sendComment() {
  let params = {
    EntityId: appeal.value.id,
    entityType: 20,
    text: commentTxt.value
  }
  appealStore.saveComment(params).then(() => {
    commentTxt.value = ''
    getComments()
  })
}

function openModalEvent() {
  sendEventModal.value.open(appeal.value, getEvents, events.value[0])
  getEvents(appeal.value.id, 'noCach')
}

function getSms(noCach) {
  appealStore.getSMS(appeal.value.id, noCach).then(res => {
    listSMS.value = res.items.reverse()
    countSms.value = res.items.length
  })
}

function getHistory() {
  appealStore.getHistory(appeal.value.id).then(res => {
    history.value = res.models
    countHistory.value = res.models.length
  })
}

function getComments() {
  appealStore.getComments(appeal.value.id).then(res => {
    comments.value = res.items.reverse()
    countComments.value = res.count
  })
}


function tabChange(val) {
  if (val === 'eventsTab') getEvents()
  if (val === 'smsTab') getSms()
  if (val === 'historyTab') getHistory()
  if (val === 'commentsTab') getComments()
}

function open(val) {
  appeal.value = val
  getEvents()
}

defineExpose({open})
</script>