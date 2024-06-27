<template>
  <small class="label-right">Статус</small>
  <el-dropdown style="margin-bottom: 4px">
    <el-button type="primary">
      {{ appeal.statusTitle }}
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
            @click="makeChoice(item)"
            v-for="(item, ind) in AppealStatusTypes" :key="ind">{{ item.name }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <br>
  <MStatusModalStart ref="mStatusModalStart"/>
</template>

<script setup lang="ts">
import {useAppealStore} from "@/stores/appealStore";
import {ref, watchEffect} from "vue";
import {AppealStatusTable} from "@/utils/globalConstants";
import MStatusModalStart from "@/pages/appeal/appealEditFields/MStatusModalStart.vue";


const props = defineProps(['appeal'])
const appealStore = useAppealStore()
const AppealStatusTypes = ref([])
const appealAvailableStatuses = ref([])
const mStatusModalStart = ref(null)
const oldStatus = ref({})

watchEffect(() => {
  props.appeal.id && appealStore.getStatuses(props.appeal.id).then(res => {
    appealAvailableStatuses.value = res.items
    res.items.forEach(el => {
      let item = AppealStatusTable.find(item => item.id === el)
      item && AppealStatusTypes.value.push(item)
    })
  })
})

function makeChoice(val) {
  oldStatus.value = {id: props.appeal.status, name: props.appeal.statusTitle}
  props.appeal.status = val.id
  props.appeal.statusTitle = val.name

  mStatusModalStart.value.open(val, props.appeal.id, reset)
}

function reset() {
  props.appeal.status = oldStatus.value.id
  props.appeal.statusTitle = oldStatus.value.name
}


</script>


