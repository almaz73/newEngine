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
  <MStatusModalArchive ref="mStatusModalArchive"/>
  <MStatusModaComission ref="mStatusModaComission"/>
</template>

<script setup lang="ts">
import {useAppealStore} from "@/stores/appealStore";
import {ref, watchEffect} from "vue";
import {AppealStatusTable} from "@/utils/globalConstants";
import MStatusModalStart from "@/pages/appeal/appealEditFields/status/MStatusModalStart.vue";
import MStatusModalArchive from "@/pages/appeal/appealEditFields/status/MStatusModalArchive.vue";
import MStatusModaComission from "@/pages/appeal/appealEditFields/status/MStatusModaComission.vue";

const props = defineProps(['appeal'])
const appealStore = useAppealStore()
const AppealStatusTypes = ref([])
const appealAvailableStatuses = ref([])
const oldStatus = ref({})
const mStatusModalStart = ref(null)
const mStatusModalArchive = ref(null)
const mStatusModaComission = ref(null)

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
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.status = val.id
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.statusTitle = val.name

  console.log('val', val)
  if (val.id === 11) mStatusModalStart.value.open(val, props.appeal.id, reset) //'Обращение. В работу'
  if (val.id === 17) mStatusModalArchive.value.open(val, props.appeal, reset) //'Обращение. Запрос архивирования'
  if (val.id === 263) mStatusModaComission.value.open(val, props.appeal, reset) //'Передать на комиссию'
}

function reset() {
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.status = oldStatus.value.id
  // eslint-disable-next-line vue/no-mutating-props
  props.appeal.statusTitle = oldStatus.value.name
}


</script>


