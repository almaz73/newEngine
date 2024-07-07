<template>

  <div >
    9999999999999 {{inspection}}
<!--    <a class="uk-button a-button-inspection-active">-->
<!--      <span class="a-inspection-date">{{::inspection.createDate | date: "dd.MM.yyyy H:mm" }}</span>-->
<!--      <br />-->
<!--      {{::inspection.createdUserLastName}} {{::inspection.createdUserFistName}}-->
<!--    </a>-->

<!--    <a class="uk-button a-button-inspection-success">-->
<!--      <span class="a-inspection-date">{{::inspection.lastUpdateDate | date: "dd.MM.yyyy H:mm" }}</span>-->
<!--      <br />-->
<!--      {{::inspection.lastUpdateUserLastName}} {{::inspection.lastUpdateUserFistName}}-->
<!--    </a>-->
<!--    <span ng-if="deal.malfunctions" style="font-size: large"><a data-uk-modal="{target:'#damages', center:true}">Возможные неисправнсти</a></span>-->

<!--    <div>-->
<!--      <span class="a-dealAvto_Div"><span class="a-dealAvto_UserCreated"></span>Создан</span>-->
<!--      <span class="a-dealAvto_Div"><span class="a-dealAvto_UserModified"></span>Изменен</span>-->
<!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import {useDealStore} from '@/stores/dealStore'
import { ref, watchEffect } from 'vue'
import { DealStatusTable } from '@/utils/globalConstants'

const dealStore = useDealStore()
const inspection = ref([])


watchEffect(() => {
//  console.log('deal',deal)

  // deal.dealId && dealStore.getStatuses(deal.dealId).then(res => {
  //   availableStatuses.value = res.items
  //   res.items.forEach((el:any) => {
  //     let item = DealStatusTable.find(item => item.id === el)
  //     item && StatusTypes.value.push(item)
  //   })
  //   sortFunction()
  // })
})


function open(deal:any) {
  console.log('dealStore.deal',dealStore.deal)
  deal && dealStore.getInspection(deal.inspectionId).then(function (data) {
    console.log('data',data)
    inspection.value = data;
  });


}

defineExpose({open})

</script>
