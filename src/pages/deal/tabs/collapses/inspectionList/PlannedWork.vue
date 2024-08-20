<template>
  {{plannedWorkTotalSum}}
</template>
<script setup lang="ts">


import {ref} from "vue";
import { useDealStore } from '@/stores/dealStore'

const dealStore = useDealStore()
const plannedWorkTotalSum = ref(0)
const damageItems = ref([])


function setPlainWork(data) {

  console.log('d=ata = ',data)

  var totalSum = 0;
  data.map(item=>{

    if (item.workName == undefined || item.workName == null) {
      item.workName = 'Работа не выбрана';
    }
    if (item.price == undefined || item.price == null) {
      item.price = 0;
    }

    if (item.damageType != null && item.damageType != undefined) {
      item.damageText = getDamageText(item.damageType);
    }
    totalSum += item.price;
  });

  console.log('++ data = ',data)

  plannedWorkTotalSum.value = totalSum;
}


function getDamageText(damageType: string) {
  var text = '';
  var splitted = damageType.split(',');
  if (splitted.length > 0) {
    for (var i = 0; splitted.length > i; i++) {
      var res = damageItems.value.find(item => {
        console.log('item = ',item)
        return item.id == splitted[i];
      });
      if (i != splitted.length - 1) {
        text += res.damageName + ' ,';
      } else {
        text += res ? res.damageName : '';
      }
    }
  }
  console.log('text = ',text)
  return text;
}


dealStore.getDamages().then(res => {
  console.log('damageItems r>>>? es', res)
  damageItems.value = res.data.items

  console.log('damageItems.value = ',damageItems.value)

  // запланированные работы
  dealStore.getPlannedWork(dealStore.deal.dealId).then(res => setPlainWork(res.data.items))
})


</script>