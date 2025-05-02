<template>
  <div class="vitrina">
    <ShowCaseFilters @getRecord="getRecord" @toDirty="toDirty"/>
    <ShowCase_Viewer ref="showCase_Viewer" />
    <ShowCaseMenu @lookElement="lookElement" ref="showCaseMenu" :filter2 @toDirty="toDirty" />
  </div>
</template>
<style>
.vitrina {
  display: flex;
  margin: auto;
  max-width: 1400px;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.vitrina_l_frame div {
  white-space: nowrap
}

.vitrina_l_frame div span:first-child {
  float: left;
  width: 273px
}

.vitrina_l_frame div span:nth-child(2) {
  width: 50px;
  border-bottom: 1px dotted black;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import ShowCaseFilters from '@/pages/showcase/ShowCaseFilters.vue'
import ShowCaseMenu from '@/pages/showcase/ShowCaseMenu.vue'
import { formatDateDDMMYYYY } from '@/utils/globalFunctions'
import ShowCase_Viewer from '@/pages/showcase/ShowCase_Viewer.vue'

let bigData: any = []
const filter2 = ref({ SecondDateFrom: null, highCreateDatePeriod: null })
const globalStore = useGlobalStore()
const showCase_Viewer = ref<any>(null)
const showCaseMenu = ref<any>(null)
const gotAlready = ref(false)

function toDirty() {
  gotAlready.value = false
}

function lookElement(link: string) {
  showCase_Viewer.value.showData(bigData, link)
}

function getRecord(val: any) {
  let params = {
    OrganizationIds: val.OrganizationIds,
    DepartmentIds: val.DepartmentIds,
    UserIds: val.UserIds,
    WorkflowLeadTypes: val.leadTypes,
    DateFrom: formatDateDDMMYYYY(val.lowCreateDatePeriod),
    DateTo: formatDateDDMMYYYY(val.highCreateDatePeriod),
    Users: true,
    SecondDateFrom: formatDateDDMMYYYY(filter2.value.SecondDateFrom || ''),
    highCreateDatePeriod: formatDateDDMMYYYY(filter2.value.highCreateDatePeriod || '')
  }

  if(gotAlready.value) {
    showCaseMenu.value.showData(bigData)
    showCase_Viewer.value.showData(bigData)
    return false
  }

  globalStore.isWaiting = true
  globalStore.getDataMart(params, val.categories).then(res => {
    globalStore.isWaiting = false
    if (res.commissionCallCenterData) res.commissionCallCenterData.conversionByUser.map((el: any) => el.count = el.conversion)
    if (res.buyCallCenterData) {
      res.buyCallCenterData.buyConversionByUser.map((el: any) => el.count = el.conversion)
      res.buyCallCenterData.evaluationConversionByUser.map((el: any) => el.count = el.conversion)
    }

    bigData = res
    gotAlready.value = true

    showCase_Viewer.value.showData(bigData)
    showCaseMenu.value.showData(bigData)
  })
}


</script>


