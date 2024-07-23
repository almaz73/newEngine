<template>

  <div v-if="deal.workflowLeadType===11">
    <label class="label l_200">Тип направления</label>

    <div v-if="!isEdit" style="display: inline-block">
      &nbsp;{{ deal.tradeInDirectionTypeTitle }}

      <EditPensilCtrl  @click="toEdit()"/>
    </div>

    <el-select
        title="тип направления"
        v-if="isEdit"
        placeholder="Выберите тип направления"
        style="width: 220px"
        v-model="deal.tradeInDirectionType"
        @change="setBuyCategory()"
        filterable>
      <el-option v-for="item in tradeinDirectionTypes" :key="item.value" :label="item.title" :value="item.value"/>
    </el-select>

  </div>


  <div v-if="deal.workflowLeadType===2">
    <label class="label l_200">Вид выкупа</label>

    <div v-if="!isEdit" style="display: inline-block">
      &nbsp;{{ deal.buyCategoryTitle }}

      <EditPensilCtrl @click="isEdit=true"/>
    </div>
    <el-select
        v-if="isEdit"
        style="width: 220px"
        title="вид выкупа"
        placeholder="Выберите вид выкупа"
        v-model="deal.buyCategory"
        @change="setBuyCategory()"
        filterable>
      <el-option v-for="item in BuyCategoryTypes" :key="item.id" :label="item.title" :value="item.id"/>
    </el-select>
  </div>
</template>
<script setup lang="ts">

import {BuyCategoryTypes} from "@/utils/globalConstants";
import {ref} from "vue";
import {useDealStore} from "@/stores/dealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ElMessage} from "element-plus";
import EditPensilCtrl from "@/controls/EditPensilCtrl.vue";

const {deal} = defineProps(['deal'])
const isEdit = ref(false)
const dealStore = useDealStore()
const globalStore = useGlobalStore()
const tradeinDirectionTypes = ref(null)

function toEdit() {
  if (deal.workflowLeadType === 11) {
    globalStore.getTradeinDirectionTypes().then(res => {
      tradeinDirectionTypes.value = res.data
    })
  }
  isEdit.value = true
}

function setBuyCategory() {
  if (deal.workflowLeadType === 2) {
    dealStore.setBuyCategory(deal.dealId, deal.buyCategory).then(res => {
      if (res.status == 200) ElMessage.success('Вид выкупа успешно сменился')
      isEdit.value = false
    })
  }
  if (deal.workflowLeadType === 11) {
    dealStore.changeTradeInDirectionType(deal.dealId, deal.tradeInDirectionType).then(res => {
      if (res.status == 200) ElMessage.success('Тип направления успешно сменился')
      isEdit.value = false
    })
  }


}

</script>