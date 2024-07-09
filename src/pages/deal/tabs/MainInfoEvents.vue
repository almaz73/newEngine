<template>
  <div>
    <el-button :icon="Plus" @click="openModalEvent()"
               type="success" style="margin: 0 8px">
      Создать событие
    </el-button>
=={{events}}=
  </div>
  <SendEventModal ref="sendModal"/>
</template>

<script setup lang="ts">

import {ref} from "vue";
import SendEventModal from "@/pages/appeal/controls/SendEventModal.vue";
import {Plus} from "@element-plus/icons-vue";
import {useDealStore} from "@/stores/dealStore";
import {useAppealStore} from "@/stores/appealStore";

const appealStore = useAppealStore()
const dealStore = useDealStore()
const sendModal = ref(null)
const events = ref([])

function openModalEvent() {
  // sendModal.value.open(dealStore.deal.value, getEvents, events.value[0])
  // getEvents(appeal.value.id, 'noCach')
}

function getEvents(noCach) {
  appealStore.getEvents(dealStore.deal.id, noCach).then(res => {
    events.value = res.items
    // countEvents.value = res.items.length
  })
}

</script>