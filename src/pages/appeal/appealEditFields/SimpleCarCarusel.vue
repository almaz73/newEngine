<!-- область авто  Откуда идет разветвление к разным отображениям,   -->

<template>
  <div class="big-collapse">
    <el-collapse>
      <el-collapse-item
          v-if="isVisible"
          :title="'&nbsp; Автомобиль'+(appeal.carBrandModel?': &nbsp; '+appeal.carBrandModel:'')"
          name="2" style="position: relative">

          <span class="button-on-collapse"
                v-if="permit_locale() && appeal.auto && appeal.deal && appeal.auto.vin">
            <RouterLink :to="`/auto/${appeal.autoId}/deal/${appeal.deal.id}`">
              <el-button :icon="Edit" size="small">Автомобиль на стадии оценки</el-button>
            </RouterLink>
          </span>


        <div style="width: 310px">
          <span class="label" v-if="appeal.carBrandModel">  Модель: </span>{{ appeal.carBrandModel }}
          <span class="label" v-if="appeal.yearReleased">  Год: </span>{{ appeal.yearReleased }}
          <span class="label" v-if="appeal.mileageAuto">  Пробег: </span>{{ appeal.mileageAuto }}

          <div v-if="appeal.deal && appeal.deal.dealStatus">
            <span class="label">
              Статус: </span>
            {{ appeal && appeal.deal && statuses.find(el => el.id === appeal.deal.dealStatus).name }}
          </div>

          <br><br>
        </div>
      </el-collapse-item>

      <AutoComiss :appeal v-if="isComiss"/>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import {useAppealStore} from "@/stores/appealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {statuses} from "@/utils/globalConstants";
import {ref} from "vue";
import AutoComiss from "@/pages/appeal/appealEditFields/comiss/AutoComiss.vue";
import { Edit } from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const appeal = ref({})
const isVisible = ref(true) // [10:'Комиссия-simple', 11:'Комиссия', 2:'tradeIn']
const isComiss = ref(false)

function showData(data: any) {
  appeal.value = data
  console.log('appeal.value = ', appeal.value)


  if (appealStore.comissId) {
    isComiss.value = true
    isVisible.value = false
  }  // скрываем для комиссии
  
  console.log('isVisible.value = ',isVisible.value)

}

function permit_locale() {
  return ['BuyerEmployee', 'Admin'].includes(globalStore.account.role)
}


defineExpose({showData})
</script>