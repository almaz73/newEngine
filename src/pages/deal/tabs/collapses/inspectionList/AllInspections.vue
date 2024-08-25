<template>
  <div class="insp-form" :style="{minWidth: categoryId==110?'100%':''}">
    <ExternalInspection v-if="categoryId==30" />
    <IInternalInspection v-if="categoryId==40" />
    <IComplectation v-if="categoryId==50" />

    <div style="display: flex; justify-content: space-between">
      <el-button
        type="danger"
        v-if="categoryId<90">
        Очистить лист осмотра
      </el-button>

      <span v-else>&nbsp;</span>

      <el-button
        type="success"
        @click="goNext()"
        v-if="categoryId<100">
        Подтвердить и продолжить
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import IInternalInspection from '@/pages/deal/tabs/collapses/inspectionList/IInternalInspection.vue'
import ExternalInspection from '@/pages/deal/tabs/collapses/inspectionList/ExternalInspection.vue'
import IComplectation from '@/pages/deal/tabs/collapses/inspectionList/IComplectation.vue'
import router from '@/router'

const route = useRoute()
let autoId, dealId, inspectionId, categoryId

router.beforeEach(to => init(to.params))

let init = (params) => {
  autoId = params ? params.autoId : route.params.autoId
  dealId = params ? params.dealId : route.params.dealId
  inspectionId = params ? params.inspectionId : route.params.inspectionId
  categoryId = params ? params.categoryId : route.params.categoryId
  document.documentElement.scrollTop = 0
}

init()

function goNext() {
  router.push(`/auto/${autoId}/deal/${dealId}/inspection/${inspectionId}/edit-category/${+categoryId + 10}`)
}
</script>