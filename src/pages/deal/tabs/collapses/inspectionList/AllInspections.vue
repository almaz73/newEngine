<template>
  <div class="insp-form" :style="{minWidth: categoryId==110?'100%':''}">
    <IExternalInspection v-if="categoryId==30"/>
    <IInternalInspection v-if="categoryId==40"/>
    <IComplectation v-if="categoryId==50"/>
    <IPlannedWork v-if="categoryId==100"/>
    <IServiceWorks v-if="categoryId==110"/>

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
    <el-button v-if="categoryId==110" type="danger">Добавить</el-button>
    <el-button v-if="categoryId>90" type="success">Сохранить</el-button>
    <el-button v-if="categoryId>90" type="info">Отменить</el-button>
  </div>
</template>
<script setup lang="ts">
import IServiceWorks from "@/pages/deal/tabs/collapses/inspectionList/IServiceWorks.vue";
import {useRoute} from 'vue-router'
import IInternalInspection from "@/pages/deal/tabs/collapses/inspectionList/IInternalInspection.vue";
import IExternalInspection from "@/pages/deal/tabs/collapses/inspectionList/IExternalInspection.vue";
import IComplectation from "@/pages/deal/tabs/collapses/inspectionList/IComplectation.vue";
import router from "@/router";
import IPlannedWork from "@/pages/deal/tabs/collapses/inspectionList/IPlannedWork.vue";

const route = useRoute()
let autoId, categoryId, dealId, inspectionId

router.beforeEach(to => init(to.params))

let init = (params) => {
  autoId = params ? params.autoId : route.params.autoId
  categoryId = params ? params.categoryId : route.params.categoryId
  dealId = params ? params.dealId : route.params.dealId
  inspectionId = params ? params.inspectionId : route.params.inspectionId
  document.documentElement.scrollTop = 0
}

init()

function goNext() {
  router.push(`/auto/${autoId}/deal/${dealId}/inspection/${inspectionId}/edit-category/${+categoryId + 10}`)
}
</script>