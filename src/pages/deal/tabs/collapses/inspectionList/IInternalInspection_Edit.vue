<template>
  <div>
    <div style="font-size: 25px">Осмотр а/м</div>
    <p style="font-size: larger">
      {{ auto.brandTitle }}
      {{ auto.modelTitle }}
      {{ auto.year }} г.в.
      VIN: {{ auto.vin }}
    </p>

    <NeckPart :title="'ВНУТРЕННИЙ ОСМОТР'" :categoryId="categoryId" @locationF="locationF" @hider="hider"/>


    <div v-for="item in listData">
      <div v-if="!(isHideNorm && item.isNorm)">
        <div style="max-width: 350px ;float: left">{{ item.name }}</div>


        <div style="float: right; cursor: pointer"
             @click="changeItem(item)"
             @mouseover="item.isNorm=!item.isNorm"
             @mouseleave="toMouseLeave(item)"
        >
          <el-button
              :type="!item.isNorm?'danger':'success'" style="width: 150px; pointer-events:none">
            <span>  {{ item.isNorm ? 'Норма' : 'Не норма!' }}</span>

          </el-button>
        </div>

        <div style="clear: both"></div>

        <div v-if="dangerField[item.id]">
          777777<br>777<br>77
        </div>
        <el-divider/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useGlobalStore} from "@/stores/globalStore";
import {onMounted, ref} from "vue";
import {useDealStore} from "@/stores/dealStore";
import {useRoute} from 'vue-router'
import NeckPart from "@/pages/deal/tabs/collapses/inspectionList/NeckPart.vue";
import router from "@/router";

const route = useRoute()
const dealStore = useDealStore()
const globalStore = useGlobalStore()
const listData = ref([])
const auto = ref({})
const dangerField = ref({})
const chapok = ref(false)
const categoryId = ref(null)
const dealId = ref(null)
const autoId = ref(null)
const inspectionId = ref(null)
const isHideNorm = ref(false)
const defects = ref({  red: 0,  yellow: 0,  total: 0});



function locationF() {
  alert()


  console.log('categoryId = ',categoryId)

  var nextCategory = 10;
  if (dealId.value != undefined) {
    switch (categoryId) {
      case 30:
        nextCategory = 40;
        break;
      case 40:
        nextCategory = 20;
        break;
      case 20:
        nextCategory = 50;
        break;
      case 50:
        nextCategory = 60;
        break;
      case 60:
        nextCategory = 70;
        break;
      case 70:
        nextCategory = 10;
        break;
      case 10:
        nextCategory = 80;
        break;
      case 80:
        nextCategory = 90;
        break;
    }
    router.push(
        '/auto/' +
        autoId.value +
        '/deal/' +
        dealId.value +
        '/inspection/' +
        inspectionId.value +
        '/edit-category/' +
        nextCategory,
    );

    if (categoryId == 90) {
      router.push(
          '/auto/' +
          autoId.value +
          '/deal/' +
          dealId.value +
          '/inspections/' +
          inspectionId.value +
          '/plainwork',
      );
    }
  }
  /*
  todo
  else if ($routeParams.commissionId != undefined) {
    if (categoryId == 90) {
      $location.path('appeal/commission/' + $routeParams.commissionId);
    } else {
      $location.path(
          'appeal/commission/' +
          $routeParams.commissionId +
          '/inspection/' +
          inspectionId.value +
          '/' +
          (categoryId + 10),
      );
    }
  }
  */
};

function toMouseLeave(item) {
  if (!chapok.value) item.isNorm = !item.isNorm
  chapok.value = false
}

function hider(val) {
  console.log('val = ', val)
  isHideNorm.value=!isHideNorm.value
}

function changeItem(item) {
  if(chapok.value) item.isNorm = !item.isNorm
  dangerField.value[item.id] = !item.isNorm
  chapok.value = true
}

onMounted(() => {
  inspectionId.value = route.params.inspectionId
  autoId.value = route.params.autoId
  dealId.value= route.params.dealId
  categoryId.value = route.params.categoryId

  globalStore.setTitle('Внутренний осмотр кузова')
  globalStore.steps = []

  dealStore.getDamages().then(res => {
    // console.log('res = ', res)
  })

  dealStore.getExploitationHistoryTypes().then(res => {
    // console.log('getExploitationHistoryTypes res = ', res)
  })

  dealStore.getbyinspectionbycategory(inspectionId.value, 40).then(res => {
    listData.value = res.data.items
    auto.value = res.data.inspection.auto

    dangerField.value
    listData.value.forEach(el => dangerField.value[el.id] = !el.isNorm)

    console.log('listData.value = ',listData.value)

  })
})

</script>