<template>
  <small class="label-right" v-if="props.appeal.workflowLeadType === 1">Продавец</small>
  <small class="label-right" v-if="props.appeal.workflowLeadType === 2">Выкупщик</small>
  <small class="label-right" v-if="![1,2].includes(props.appeal.workflowLeadType)">Ответственный</small>

  <span v-if="!isEditManagerName">
            <small v-if="props.appeal.managerName">{{ props.appeal.managerName }}</small>
            <small v-if="!props.appeal.managerName">Прикрепить менеджера</small>
            &nbsp; <img src="@/assets/icons/icon-pencil-gray.png" alt=""
                        @click="toGetManagers()"
                        style="cursor: pointer">
          </span>
  <span v-else>
            <el-select
                style="width: 220px"
                v-model="props.appeal.managerId"
                @change="toChangeManager" filterable>
              <el-option v-for="item in responsibles" :key="item.id" :label="item.title" :value="item.id"/>
            </el-select>
      </span>
  <template v-if="oldResponsibleId && oldResponsibleId !==props.appeal.managerId">
    &nbsp;
    <el-button size="small" :icon="Select" @click="saveResponsible(true)"></el-button>
    <el-button size="small" :icon="Close" @click="saveResponsible(false)"></el-button>
  </template>
</template>

<script setup lang="ts">
import {useAppealStore} from "@/stores/appealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {Close, Select} from "@element-plus/icons-vue";
import {ref} from "vue";

const props = defineProps(['appeal'])
const appealStore = useAppealStore()
const globalStore = useGlobalStore()
const responsibles = ref([])
const oldResponsibleId = ref(null)
const isEditManagerName = ref(false)


function toGetManagers() {
  oldResponsibleId.value = props.appeal.managerId

  globalStore.isWaiting = true
  appealStore.getRoles(props.appeal.workflowLeadType).then(res => {
    responsibles.value = res.data.items;
    isEditManagerName.value = true
    globalStore.isWaiting = false
  })
}

function toChangeManager(row) {
  let item = responsibles.value.find(el => el.id === row)
  if (item) props.appeal.managerName = item.title
  isEditManagerName.value = false
}

function saveResponsible(val: boolean) {
  if (val) appealStore.changeResponsible(props.appeal.id, props.appeal.managerId)
  else toChangeManager(oldResponsibleId.value)

  oldResponsibleId.value = null
}
</script>