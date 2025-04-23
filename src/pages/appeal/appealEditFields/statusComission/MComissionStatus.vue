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
let comissId:any = null
let archiveReasons:any = null
const comissStatusModal = ref()

console.log('props.appeal = ',props.appeal)
console.log('props.appeal.archiveRequestReasons = ',props.appeal.archiveRequestReasons )

watchEffect(() => {
  props.appeal.id && getStatuses(props.appeal.id)
})

function getStatuses(appealId: number) {
  appealStoreStatus.getComission(appealId).then(res => {
    // этот метод вызывается только дяя того, чтобы забрать comissId и archiveReasons
    comissId = res.view.id
    archiveReasons = res.view.archiveReasons


    appealStoreStatus.getComissionStatuses(comissId).then(res => {
      ComissionStatusTypes.value = res.statuses
    })
  })
}

function makeChoice(val: any) {
  if (archiveReasons) val.archiveRequestReasons = archiveReasons
  comissStatusModal.value.open(val, comissId)
}

</script>


