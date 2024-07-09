<template>
  <div>
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

  </div>
<!--  <SendEventModal ref="sendModal"/>-->
  <SendEventModal ref="sendModal"/>
</template>

<script setup lang="ts">

import {ref} from "vue";
import SendEventModal from "@/controls/SendEventModal.vue";
import {Plus} from "@element-plus/icons-vue";
import {useDealStore} from "@/stores/dealStore";
import {useAppealStore} from "@/stores/appealStore";
import { getPeriods } from '@/utils/globalFunctions'

const appealStore = useAppealStore()
const dealStore = useDealStore()
const sendModal = ref(null)
const events = ref([])

function openModalEvent() {
  console.log('dealStore.deal = ',dealStore.deal)

  sendModal.value.open(dealStore.deal, getEvents)
}
// console.log('dealStore.deal',dealStore.deal, events.value.length && events.value[0].type)

getEvents('nocach')

function getEvents(noCach: string) {


  appealStore.getEvents(dealStore.deal.parentEntityId, noCach).then(res => {
    events.value = res.items
    console.log(' res.items', res.items)
    // countEvents.value = res.items.length
  })
}


</script>