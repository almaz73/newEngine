<template>
  <el-tabs v-model="activeName" @tab-change="tabChange" style="padding-right: 8px">
    <el-tab-pane :label="'Активность'" name="eventsTab">
      <el-scrollbar>
        <el-button :icon="Plus" @click="openModalEvent()"
                   type="success" style="margin: 0 8px">
          Создать событие
        </el-button>

        <el-button @click="isOnlyEvents=!isOnlyEvents"
                   v-if="events.length"
                   type="info" style="margin: 0 8px">
          Cобытия - {{ events.length }}
        </el-button>


        <div v-if="!isOnlyEvents">
          <div v-for="sth in statusHistory" :key="sth.userId"
               style="padding: 4px 24px; background: #fff5f5; margin: 18px 20px">
            🏠 {{ sth.lastName }} {{ sth.firstName }}. <b> Смена статуса обращения:
            {{ statuses.find(el => el.id === sth.status).name }}</b><br>
            {{ formatDMY_hm(sth.createDate) }} &nbsp; &nbsp; {{ sth.comment ? ' Комментарий:' + sth.comment : '' }}

          </div>

          <el-timeline style="background: #ddd; margin: 8px 50px; padding-top: 12px">
            <el-timeline-item

                v-for="(hist, index) in history"
                :key="index"
                :hollow="true"
                :timestamp="hist.createDate"
            >
              {{ hist.action }}: <b>{{ hist.comment }}</b> <span>{{ hist.userTitle }}</span>
            </el-timeline-item>
          </el-timeline>
        </div>


        <div v-for="ev in events" :key="ev.id" class="collapse-blocks" style="background: #ddd">
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
    <el-tab-pane :label="'SMS '+(countSms?` - ${countSms} `:'')" name="smsTab">
      <el-scrollbar>
        <el-button @click="openModalSms()" :icon="Plus" style="margin: 0 8px">Отправить СМС-сообщение клиенту
        </el-button>
        <el-button @click="printDocSms()"> ✍ Скачать "Согласие на обработку персональных данных и получения смс"
        </el-button>
        <div v-for="sms in listSMS" :key="sms.id" class="collapse-blocks sms">
          <span class="label-red label-right">Текст:</span> {{ sms.smsText }}<br>
          <span class="label-red label-right">Дата:</span> {{ formatDMY_hm(sms.sendDate) }}<br>
          <span class="label-red label-right">Статус:</span> {{ sms.statusText }}<br>
          <span class="label-red label-right">Комментарий:</span> {{ sms.comment }}<br>
        </div>
      </el-scrollbar>

    </el-tab-pane>

    <el-tab-pane :label="'История '+(countHistory?` - ${countHistory}`:'')" name="historyTab">
      <el-scrollbar>
        <el-timeline style="background: #ddd; margin: 8px 50px; padding: 12px 12px 0 12px">
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
    <el-tab-pane :label="'Комментарии '+(countComments?` - ${countComments}`:'')" name="commentsTab">

      <el-scrollbar>
        <div>
          <el-input type="textarea" style="width: 600px; margin:0 8px"
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
  <SendEventModal
      ref="sendEventModal"
      v-if="appeal && lastTask"
      :leadlId="appeal.leadId"
      :entityType="20"
      :parentEntityId="appeal.id"
      :currentResponsible="appeal.managerId"
      :currentResponsibleTitle="appeal.managerName"
      :lastTaskId="lastTask.id"
      :lastTaskType="lastTask.type"
  />

  <SendSmsModal ref="sendSmsModal"/>
</template>
<script setup>
import {formatDMY_hm, getPeriods} from "@/utils/globalFunctions";
import {ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {Plus} from "@element-plus/icons-vue";
import SendEventModal from "@/controls/SendEventModal.vue";
import SendSmsModal from "@/pages/appeal/controls/SendSmsModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {EventStatusEnums, statuses} from "@/utils/globalConstants";


const globalStore = useGlobalStore()
const {carPhoto} = defineProps(['carPhoto'])
const appealStore = useAppealStore()
const activeName = ref('eventsTab')
const listSMS = ref([])
const countSms = ref(0)
const history = ref([])
const countHistory = ref(0)
const events = ref([])
const comments = ref([])
const countComments = ref(0)
const sendEventModal = ref(null)
const sendSmsModal = ref(null)
const appeal = ref(null)
const commentTxt = ref('')
const isOnlyEvents = ref(false)
const statusHistory = ref([])
const lastTask = ref(null)


function getEvents(noCach) {
  appealStore.getEvents(appeal.value.id, noCach).then(res => {
    events.value = res.items

    events.value.forEach(value => {
      if (value.status != 30 && lastTask.value == null) lastTask.value = value;
    })
  })

  appealStore.getHistory(appeal.value.id).then(res => {
    history.value = res.models
    countHistory.value = res.models.length
  })
  appealStore.getStatusHistory(appeal.value.id).then(res => {
    statusHistory.value = res.items
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

function printDocSms() {
  appeal.value && window.location.assign('/api/print/appeal/personal-data-consent/' + appeal.value.id);
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

  sendEventModal.value.open(getEvents)
  getEvents(appeal.value.id, 'noCach')
}

function getSms(noCach) {
  appealStore.getSMS(appeal.value.id, noCach).then(res => {
    listSMS.value = res.items.reverse()
    if (res.items) countSms.value = res.items.length
  })
}


function getComments() {
  globalStore.getComments(20, appeal.value.id).then(res => {
    comments.value = res.items.reverse()
    countComments.value = res.count
  })
}


function tabChange(val) {
  if (val === 'eventsTab') getEvents()
  if (val === 'smsTab') getSms()
  if (val === 'commentsTab') getComments()
}

function open(val) {
  appeal.value = val
  getEvents()
}

defineExpose({open})
</script>