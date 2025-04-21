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
  <ComissStatusModal ref="comissStatusModal"/>
</template>

<script setup lang="ts">
import {useAppealStoreStatus} from "@/stores/appealStoreStatus.ts";
import {ref, watchEffect} from 'vue'
import ComissStatusModal from "@/pages/appeal/appealEditFields/statusComission/ComissStatusModal.vue";

const appealStoreStatus = useAppealStoreStatus()
const props = defineProps(['appeal'])
const ComissionStatusTypes = ref([])
let comissId = null
const comissStatusModal = ref()

watchEffect(() => {
  props.appeal.id && getStatuses(props.appeal.id)
})

function getStatuses(appealId: number) {
  appealStoreStatus.getComission(appealId).then(res => {
    console.log('res = ',res)
    comissId = res.view.id

    appealStoreStatus.getComissionStatuses(comissId).then(res => {
      console.log('22res = ',res)
      ComissionStatusTypes.value = res.statuses
    })
  })
}

function makeChoice(val: any) {
  comissStatusModal.value.open(val, comissId)
}

</script>


