<template>
  <small class="label-right"> Статус</small>
  <el-dropdown style="margin: -6px 0 6px">
    <el-button type="primary">
      {{ appeal.statusTitle }}
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
            @click="makeChoice(item)"
            v-for="(item, ind) in ComissionStatusTypes" :key="ind">{{ item.title }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <br>
<!--  <StatusStart ref="statusStart"/>-->
<!--  <StatusArchive ref="statusArchive"/>-->
<!--  <StatusComission ref="statusComission"/>-->
<!--  <StatusTradeIn ref="statusTradeIn"/>-->
<!--  <StatusBuyout ref="statusBuyout"/>-->
<!--  <StatusToArchive ref="statusToArchive"/>-->
<!--  <StatusDecor ref="statusDecor"/>-->
<!--  <CreateTypeSell ref="createTypeSell"/>-->
</template>

<script setup lang="ts">
import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from '@/stores/dealStore'
import {ref, watchEffect} from 'vue'
import {AppealStatusTable} from "@/utils/globalConstants";
import StatusStart from "@/pages/appeal/appealEditFields/status/StatusStart.vue";
import StatusArchive from "@/pages/appeal/appealEditFields/status/StatusArchive.vue";
import StatusComission from "@/pages/appeal/appealEditFields/status/StatusComission.vue";
import StatusTradeIn from "@/pages/appeal/appealEditFields/status/StatusTradeIn.vue";
import StatusBuyout from "@/pages/appeal/appealEditFields/status/StatusBuyout.vue";
import StatusToArchive from "@/pages/appeal/appealEditFields/status/StatusToArchive.vue";
import StatusDecor from "@/pages/appeal/appealEditFields/status/StatusDecor.vue";
import CreateTypeSell from '@/pages/appeal/appealEditFields/status/CreateTypeSell.vue'

const props = defineProps(['appeal'])
const globalStore = useGlobalStore()
const dealStore = useDealStore()
const ComissionStatusTypes = ref([])
const appealAvailableStatuses = ref([])
const statusStart = ref<any>()
const statusArchive = ref<any>()
const statusComission = ref<any>()
const statusTradeIn = ref<any>()
const statusBuyout = ref<any>()
const statusToArchive = ref<any>()
const statusDecor = ref<any>()
const createTypeSell = ref<any>()

watchEffect(() => {
  props.appeal.id && getStatuses(props.appeal.id)
})

function getStatuses(appealId: number) {
  dealStore.getComission(appealId).then(res => {
    console.log('res.items = ',res.statuses)
    // appealAvailableStatuses.value = res.items

    ComissionStatusTypes.value = res.statuses

    console.log('ComissionStatusTypes.value = ',ComissionStatusTypes.value)
  })
}

function makeChoice(val: any) {


}

</script>


