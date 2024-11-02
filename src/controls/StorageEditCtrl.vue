<template>

  <div v-if="deal.workflowLeadType===11">
    <label class="label l_200">Место выкупа</label>

    <div v-if="!isEdit" style="display: inline-block">
      &nbsp;{{ deal.storageName }}

      <EditPensilCtrl @click="toEdit()" />
    </div>

    <el-select
      v-if="isEdit"
      placeholder="Выберите место выкупа"
      style="width: 220px"
      v-model="deal.storageId"
      @change="changeStorage()"
      filterable>
      <el-option v-for="item in storages" :key="item.id" :label="item.title" :value="item.id" />
    </el-select>

  </div>

</template>
<script setup lang="ts">

import { ref } from "vue";
import { useDealStore } from "@/stores/dealStore";
import EditPensilCtrl from "@/controls/EditPensilCtrl.vue";

const { deal } = defineProps(["deal"]);
const isEdit = ref(false);
const dealStore = useDealStore();
const storages = ref([]);

function changeStorage() {
  dealStore.setLocations(deal.dealId, deal.storageId).then(res => {
    if (res.status === 200) location.reload();
  });
}

function toEdit() {
  let buyTypeId = deal.buyCategory;
  if (!buyTypeId) {
    if (deal.tradeInDirectionType === 10) buyTypeId = 50;
    if (deal.tradeInDirectionType === 20) buyTypeId = 60;
  }

  dealStore.getLocations(null, buyTypeId, deal.dealStatus, deal.responsibleUserId).then(res => {
    storages.value = res.data.items;
  });

  isEdit.value = true;
}
</script>