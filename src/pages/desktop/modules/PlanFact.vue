<template>
  <div id="a-analytics-block">
    <h3>
      План-факт: <a class="uk-icon-chevron-left" @click="monthSelect(0)"></a>
      <el-button-group style="float: right">
        <el-button :icon="ArrowLeft" @click="monthSelect(-1)"></el-button>
        <el-button style="color: var(--main-color)">{{ Months[surrentMonth] }}</el-button>
        <el-button :icon="ArrowRight" @click="monthSelect(1)"></el-button>
      </el-button-group>
    </h3>
    <br>

    <div class="plan-fact green"> Оценки
      <span>{{ dashboardInfoBuyer.dealsCount }}</span>
    </div>
    <br>
    <div class="plan-fact blue"> Маржа
      <span>нет данных</span>
    </div>

    <br>
    <div>Выкупленные автомобили
      <el-icon style="color: var(--main-color)" title="Подсчет количества за весь период.
Оценок переведенных в транзит, сервис,
продажу и релизованных. Для руководителей
по всем своим сотрудникам">
        <QuestionFilled/>
      </el-icon>
    </div>


    <div class="a-credit-application-status-analytics">
      <div class="a-status-count-item" style="margin-right: 10px">
        <p class="a-value">{{ dashboardInfoBuyer.transitCount }}</p>
        Транзит
      </div>
      <div class="a-status-count-item" style="margin-right: 10px">
        <p class="a-value">{{ dashboardInfoBuyer.serviceCount }}</p>
        Сервис
      </div>
      <div class="a-status-count-item" style="margin-right: 10px">
        <p class="a-value">{{ dashboardInfoBuyer.sellCount }}</p>
        Продажа
      </div>
      <div class="a-status-count-item" style="margin-right: 10px">
        <p class="a-value">{{ dashboardInfoBuyer.realizationsCount }}</p>
        Реализация
      </div>
    </div>

    <div style="margin: 30px 0">Воронка выкупа
      <el-icon style="color: var(--main-color)" title="Подсчет количества
за выбранный месяц. Созданных
обращений, оценок,
произведенных диагностик, и
выкупленных автомобилей
 (оценок в которых выкупившим
 указан текущий сотрудник). Для
 руководителей по всем своим
 сотрудникам">
        <QuestionFilled/>
      </el-icon>
    </div>

    <div>
      <div class="a-graph-3">
        <div class="a-label">Обращения</div>
        <div class="a-value">{{ dashboardInfoBuyer.appealsCount }} / {{ dashboardInfoBuyer.appealsCountProc }}%</div>
        <div :style="{'width': widthAppeals}" class="a-value-graph"></div>
      </div>

      <div class="a-graph-3">
        <div class="a-label">Осмотры</div>
        <div class="a-value">
          {{ dashboardInfoBuyer.inspectionCount }} / {{ dashboardInfoBuyer.inspectionCountProc || 0 }}%
        </div>
        <div :style="{'width': widthInspection}" class="a-value-graph"></div>
      </div>

      <div class="a-graph-3">
        <div class="a-label">Диагностика</div>
        <div class="a-value">
          {{ dashboardInfoBuyer.diagnosticsCount }} / {{ dashboardInfoBuyer.diagnosticsCountProc }}%
        </div>
        <div :style="{'width': widthAtDiagnosis}" class="a-value-graph"></div>
      </div>

      <div class="a-graph-3">
        <div class="a-label">Выкуплено</div>
        <div class="a-value">{{ dashboardInfoBuyer.boughtCount }} / {{ dashboardInfoBuyer.boughtCountProc }}%</div>
        <div :style="{'width': widthBought}" class="a-value-graph"></div>
      </div>
    </div>
  </div>
</template>

<style>
.plan-fact {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 3px;
}

.plan-fact.green {
  background: #50e3c2;
}

.plan-fact.blue {
  background: #90d4f4;
}

.plan-fact span {
  float: right;
}


#a-analytics-block .a-credit-application-status-analytics {
  text-align: left;
  width: 100%;
}

#a-analytics-block .a-credit-application-status-analytics .a-status-count-item {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
  font-size: smaller;
}

#a-analytics-block .a-credit-application-status-analytics .a-status-count-item .a-value {
  font-size: 29px;
  font-weight: 500;
  color: #333333;
}

#a-analytics-block .a-graph-3 {
  border-bottom: 1px solid #dcdcdc;
  position: relative;
}

#a-analytics-block .a-graph-3 .a-value-graph {
  background-color: #d34439;
  bottom: 0;
  position: absolute;
  height: 2px !important;
}

#a-analytics-block .a-graph-1, #a-analytics-block .a-graph-2, #a-analytics-block .a-graph-3 {
  width: 100%;
  height: 21px;
  border-radius: 3px;
  position: relative;
  margin-bottom: 20px;
}

#a-analytics-block .a-graph-1 .a-label, #a-analytics-block .a-graph-2 .a-label, #a-analytics-block .a-graph-3 .a-label {
  position: absolute;
  top: 2px;
  left: 5px;
  z-index: 20;
  font-size: smaller;
}

#a-analytics-block .a-graph-1 .a-value, #a-analytics-block .a-graph-2 .a-value, #a-analytics-block .a-graph-3 .a-value {
  position: absolute;
  z-index: 10;
  right: 5px;
  top: 2px;
}

#a-analytics-block .a-graph-1 .a-value-graph, #a-analytics-block .a-graph-2 .a-value-graph, #a-analytics-block .a-graph-3 .a-value-graph {
  height: 21px;
  border-radius: 3px;
}
</style>

<script setup lang="ts">
import {Months} from "@/utils/globalConstantsOld";
import {ArrowLeft, ArrowRight, QuestionFilled} from "@element-plus/icons-vue";
import {ref} from "vue";
import {useDesktopStore} from "@/stores/desktopStore.ts";

const desktopStore = useDesktopStore()
const dashboardInfoBuyer = ref({})
const surrentMonth = ref(new Date().getMonth())
const widthAppeals = ref({})
const widthInspection = ref({})
const widthAtDiagnosis = ref({})
const widthBought = ref({})

function monthSelect(direction: number) {
  surrentMonth.value += direction
  if (surrentMonth.value < 0) surrentMonth.value = 11
  if (surrentMonth.value > 11) surrentMonth.value = 0


  desktopStore.getDashboardInfoBuyer(surrentMonth.value+1).then(res => {
    dashboardInfoBuyer.value = res
    dashboardInfoBuyer.value.appealsCountProc = 100;

    var inspectionCountProc = ((dashboardInfoBuyer.value.inspectionCount * 100) / dashboardInfoBuyer.value.appealsCount).toFixed(2);
    dashboardInfoBuyer.value.inspectionCountProc = isNaN(inspectionCountProc) ? '0' : inspectionCountProc;

    var diagnosticsCountProc = ((dashboardInfoBuyer.value.diagnosticsCount * 100) / dashboardInfoBuyer.value.appealsCount).toFixed(2);
    dashboardInfoBuyer.value.diagnosticsCountProc = isNaN(diagnosticsCountProc) ? '0' : diagnosticsCountProc;

    var boughtCountProc = ((dashboardInfoBuyer.value.boughtCount * 100) / dashboardInfoBuyer.value.appealsCount).toFixed(2);
    dashboardInfoBuyer.value.boughtCountProc = isNaN(boughtCountProc) ? '0' : boughtCountProc;


    widthAppeals.value = dashboardInfoBuyer.value.appealsCountProc + '%';
    widthInspection.value = dashboardInfoBuyer.value.inspectionCountProc + '%';
    widthAtDiagnosis.value = dashboardInfoBuyer.value.diagnosticsCountProc + '%';
    widthBought.value = dashboardInfoBuyer.value.boughtCountProc + '%';

  })
}

monthSelect(0)
</script>
