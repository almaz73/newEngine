<template>
  <div class="insp-form" :style="{minWidth: categoryId==110?'100%':''}">

    <div style="font-size: 25px">Осмотр а/м</div>
    <p style="font-size: larger">
      {{ auto.brandTitle }}
      {{ auto.modelTitle }}
      {{ auto.year }} г.в.
      VIN: {{ auto.vin }}
    </p>
    <NeckPart :title="'ВНУТРЕННИЙ ОСМОТР'"
              :categoryId="categoryId"
              @goNext="goNext" @hider="hider"/>
    <!-- Внеш. Осмотр кузова -->
    <ExternalInspection ref="ins_30" v-show="categoryId==30"/>
    <!-- Внутренний осмотр -->
    <InternalInspection_Edit ref="ins_40" v-show="categoryId==40"/>
    <!-- Комплектация -->
    <IComplectation ref="ins_20" v-show="categoryId==20"/>

    <div style="display: flex; justify-content: space-between">
      <el-button
        type="danger"
        v-if="categoryId<90">
        Очистить лист осмотра
      </el-button>

      <span v-else>&nbsp;</span>

      <el-button
        type="success"
        @click="save()"
        v-if="categoryId<100">
        Подтвердить и продолжить
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import InternalInspection_Edit from '@/pages/deal/tabs/collapses/inspectionList/InternalInspection_Edit.vue'
import ExternalInspection from '@/pages/deal/tabs/collapses/inspectionList/ExternalInspection.vue'
import IComplectation from '@/pages/deal/tabs/collapses/inspectionList/IComplectation.vue'
import router from '@/router'
import {onMounted, ref} from "vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useDealStore} from "@/stores/dealStore";
import NeckPart from '@/pages/deal/tabs/collapses/inspectionList/NeckPart.vue'
const dealStore = useDealStore()
const globalStore = useGlobalStore()
const route = useRoute()
const dealId = ref<string | string[]>('')
const autoId = ref<string | string[]>('')
const inspectionId = ref<string | string[]>('')
const categoryId = ref<string | string[]>('')
const listData = ref([])
const auto = ref({})
const ins_30 = ref(null)
const ins_40 = ref(null)
const ins_20 = ref(null)





function hider() {
  globalStore.showOnlyErrors = !globalStore.showOnlyErrors
}


function getData(nextCategory: number) {
  console.log(' g e t D a t a  ')
  listData.value = []
  dealStore.getbyinspectionbycategory(route.params.inspectionId, nextCategory).then(res => {
    listData.value = res.data.items
    auto.value = res.data.inspection.auto
    eval('ins_' + nextCategory).value.open(listData.value)
    categoryId.value = route.params.categoryId;
    document.documentElement.scrollTop = 0
  })
}

function save() {
  console.log('==ПЕРЕД СОХРАНЕНИЕМ== listData= ',listData.value)
  listData.value = []
  goNext ()
}

function goNext () {
  
  categoryId.value = route.params.categoryId;

  var nextCategory = 10;
  if (dealId.value != undefined) {
    switch (+categoryId.value) {
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

    router.push(`/auto/${route.params.autoId}/deal/${route.params.dealId}/inspection/${
      route.params.inspectionId}/edit-category/${nextCategory}`)

  }

}

router.beforeEach(res=>{
  // качаем данные, если пришли со ссыолки
  getData(res.params.categoryId)
})

onMounted(() => {
  // качаем данные, если обновили броузер
  getData(route.params.categoryId)
})
</script>