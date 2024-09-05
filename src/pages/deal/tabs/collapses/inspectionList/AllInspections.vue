<template>
  <div class="insp-form" :style="{minWidth: categoryId==110?'100%':''}">
    <ExternalInspection v-if="categoryId==30" />
    <IInternalInspection_Edit v-if="categoryId==40" :listData="listData"/>
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
import IInternalInspection_Edit from '@/pages/deal/tabs/collapses/inspectionList/IInternalInspection_Edit.vue'
import ExternalInspection from '@/pages/deal/tabs/collapses/inspectionList/ExternalInspection.vue'
import IComplectation from '@/pages/deal/tabs/collapses/inspectionList/IComplectation.vue'
import router from '@/router'
import {onMounted, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from "@/stores/dealStore";

const dealStore = useDealStore()
const globalStore = useGlobalStore()
const route = useRoute()
const dealId = ref<string | string[]>('')
const autoId = ref<string | string[]>('')
const inspectionId = ref<string | string[]>('')
const categoryId = ref<string | string[]>('')
const listData = ref([])

// router.beforeEach(to => init(to.params))

// let init = (params) => {
//   // autoId = params ? params.autoId : route.params.autoId
//   // dealId = params ? params.dealId : route.params.dealId
//   // inspectionId = params ? params.inspectionId : route.params.inspectionId
//   // categoryId = params ? params.categoryId : route.params.categoryId
//   document.documentElement.scrollTop = 0
// }
//
// init()

function goNext() {
  router.push(`/auto/${autoId.value}/deal/${dealId.value}/inspection/${inspectionId.value}/edit-category/${+categoryId.value + 10}`)
}

onMounted(() => {
  document.documentElement.scrollTop = 0
  console.log('route.params = ',route.params)
  
  autoId.value = route.params.autoId
  dealId.value= route.params.dealId
  inspectionId.value = route.params.inspection || route.params.inspectionId

  console.log('<><><inspectionId.value = ', inspectionId.value)


  globalStore.setTitle('Внутренний осмотр кузова')
  globalStore.steps = []

  dealStore.getDamages().then(res => {
    // console.log('res = ', res)
  })

  dealStore.getExploitationHistoryTypes().then(res => {
    // console.log('getExploitationHistoryTypes res = ', res)
  })
  
  console.log('inspectionId.value = ',inspectionId.value)

  dealStore.getbyinspectionbycategory(+inspectionId.value, 40).then(res => {
    listData.value = res.data.items
    categoryId.value = route.params.categoryId; // активируем списки после получения данных
  })
})
</script>