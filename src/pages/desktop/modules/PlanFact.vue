<template>
<div>
  <h3>
    План-факт: <a class="uk-icon-chevron-left" @click="monthSelect('left', 'buyer')"></a>
    <el-button-group>
      <el-button :icon="ArrowLeft" @click="monthSelect('left', 'sails')"></el-button>
      <el-button>Май</el-button>
      <el-button :icon="ArrowRight" @click="monthSelect('right', 'sails')"></el-button>
    </el-button-group>
  </h3>
  <div class="plan-fact green"> Оценки
    <span>{{dashboardInfoBuyer.dealsCount}}</span>
  </div>
  <br>
    <div class="plan-fact blue"> Маржа
    <span>нет данных</span>
  </div>

  <br>
  <div>Выкупленные автомобили
    <el-icon title="Подсчет количества за весь период.
Оценок переведенных в транзит, сервис,
продажу и релизованных. Для руководителей
по всем своим сотрудникам">
      <QuestionFilled/>
    </el-icon>
  </div>
</div>
</template>

<style>
.plan-fact{
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 3px;
}
.plan-fact.green{
  background: #50e3c2;
}
.plan-fact.blue{
  background: #90d4f4;
}
.plan-fact span{
  float: right;
}
</style>

<script setup lang="ts">
import {Months} from "@/utils/globalConstantsOld";
import {ArrowLeft, ArrowRight, QuestionFilled } from "@element-plus/icons-vue";
import {ref} from "vue";

const monthValue = ref({})
const dashboardInfoBuyer = ref({dealsCount:1})

function monthSelect(direction, type) {
  console.log('direction, typ = ',direction, type)
  console.log('Months = ',Months)
  console.log('Months = ',Months[2])
  console.log('Months[monthValue.value[type]] = ',Months[monthValue.value[type]])
  
  switch (direction) {
    case 'left':
      monthValue.value[type] = monthValue.value[type] != 0 ? monthValue.value[type] - 1 : 11;
      break;
    case 'right':
      monthValue.value[type] = monthValue.value[type] != 11 ? monthValue.value[type] + 1 : 0;
      break;
  }
  // currentMonth.value[type] = Months[monthValue.value[type]];
  // loadDashboardInfo();
  
  console.log(' monthValue.value = ', monthValue.value)
  console.log(' monthValue.value[type] = ', monthValue.value[type])
}

</script>
