<template>
  <el-tabs v-model="activeTab" style="padding-right: 8px">
    <el-tab-pane :label="'События - '+events.length" name="eventsTab">
      <el-scrollbar maxHeight="400px">
        <el-button :icon="Plus" @click="openModalEvent()"
                   type="success" style="margin: 0 8px">
          Запланировать следующее событие
        </el-button>

        <div v-for="ev in events" :key="ev.id" class="collapse-blocks">
          <div><span style="font-size: large">{{ ev.title }} </span> &nbsp; &nbsp;
            <div style="float: right" v-html="getPeriods(ev)"/>
          </div>
          <div><span class="label-right">Описание:</span> {{ ev.description }}</div>
          <div><span class="label-right">Ответственный:</span> {{ ev.responsible.person.lastName }}
            {{ ev.responsible.person.firstName }}
          </div>
          <div><span class="label-right">Создал(а):</span> {{ ev.createdUser.person.lastName }}
            {{ ev.createdUser.person.firstName }}
          </div>

        </div>


      </el-scrollbar>
    </el-tab-pane>
  </el-tabs>
  <SendEventModal
      ref="sendEventModal"
      v-if="dealStore.deal"
      :currentResponsible="dealStore.deal.responsibleUserId"
      :currentResponsibleTitle="dealStore.deal.responsibleUserName"
      :leadlId="dealStore.deal.leadId"
      :entityType="20"
      :parentEntityId="dealStore.deal.parentEntityId"
      :lastTaskId="''"
      :lastTaskType="NaN"
      :dealStatus="dealStore.deal.statusDeal"
      :dealType="dealStore.deal.dealType"
  />
</template>

<script setup lang="ts">

import {ref} from "vue";
import SendEventModal from "@/controls/SendEventModal.vue";
import {Plus} from "@element-plus/icons-vue";
import {useDealStore} from "@/stores/dealStore";
import {useAppealStore} from "@/stores/appealStore";
import {getPeriods} from '@/utils/globalFunctions'

const appealStore = useAppealStore()
const dealStore = useDealStore()
const sendEventModal = ref(null)
const events = ref([])
const activeTab = ref('eventsTab')

function openModalEvent() {
  sendEventModal.value.open(getEvents)
}

getEvents('nocach')

function getEvents(noCach: string) {


  appealStore.getEvents(dealStore.deal.parentEntityId, noCach).then(res => {
    events.value = res.items
  })
}


</script>