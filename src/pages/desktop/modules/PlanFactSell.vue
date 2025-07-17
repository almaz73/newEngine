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



    <div class="a-graph-1">
      <div class="a-label"> Продажи</div>
      <div class="a-value">{{sales}}</div>
      <div :style="{'width': widthSaleDeal}" class="a-value-graph"></div>
    </div>

    <div class="a-workflow-status-analytics">
      <div class="a-counter">0&nbsp;</div>
      <div class="a-label">автомобиля в резерве</div>
      <div class="a-counter">0&nbsp;</div>
      <div class="a-label">внесена предоплата</div>
    </div>

    <h2 class="a-title">Кредитные заявки</h2>

    <div class="a-credit-application-status-analytics">
      <div class="a-status-count-item">
        <p class="a-value">{{dashboardInfo.creditApplicationFiled}}</p>
        Подано
      </div>
      <div class="a-status-count-item">
        <p class="a-value">{{dashboardInfo.creditApplicationInWork}}</p>
        В работе
      </div>
      <div class="a-status-count-item">
        <p class="a-value">{{dashboardInfo.creditApplicationApproved}}</p>
        Одобрено
      </div>
    </div>

    <h2 class="a-title">Воронка продаж</h2>

    <div class="a-graph-3">
      <div class="a-label">Обращения</div>
      <div class="a-value">{{dashboardInfo.appeals}} &middot; 100%</div>
      <div :style="{'width': 100 + '%'}" class="a-value-graph"></div>
    </div>

    <div class="a-graph-3">
      <div class="a-label">Встреча</div>
      <div class="a-value">
        {{dashboardInfo.meetings}} &middot; {{dashboardInfo.appeals !== 0? dashboardInfo.meetingProc
          : 0}}%
      </div>
      <div :style="{'width': dashboardInfo.meetingProc + '%'}" class="a-value-graph"></div>
    </div>

    <div class="a-graph-3">
      <div class="a-label">Тест-драйв</div>
      <div class="a-value">
        {{dashboardInfo.testDrive}} &middot; {{dashboardInfo.appeals !== 0?
          dashboardInfo.testDriveProc : 0}}%
      </div>
      <div :style="{'width': dashboardInfo.testDriveProc + '%'}" class="a-value-graph"></div>
    </div>

    <div class="a-graph-3">
      <div class="a-label">Контракт</div>
      <div class="a-value">
        {{dashboardInfo.contract}} &middot; {{dashboardInfo.appeals !== 0?
          dashboardInfo.contractProc : 0}}%
      </div>
      <div :style="{'width': dashboardInfo.contractProc + '%'}" class="a-value-graph"></div>
    </div>

    <div class="a-graph-3">
      <div class="a-label">Рекомендации</div>
      <div class="a-value">
        {{dashboardInfo.recommendations}} &middot; {{dashboardInfo.appeals !== 0?
          dashboardInfo.recommendationsProc : 0}}%
      </div>
      <div :style="{'width': dashboardInfo.recommendationsProc + '%'}" class="a-value-graph"></div>
    </div>

    <div class="a-credit-application-status-analytics">
      <div class="a-status-count-item">
        <p class="a-value">0%</p>
        текущий NPS
      </div>
    </div>






<!--    <div class="plan-fact green"> Оценки-->
<!--      <span>{{ dashboardInfo.dealsCount }}</span>-->
<!--    </div>-->
<!--    <br>-->
<!--    <div class="plan-fact blue"> Маржа-->
<!--      <span>нет данных</span>-->
<!--    </div>-->

<!--    <br>-->
<!--    <div>Выкупленные автомобили-->
<!--      <el-icon style="color: var(&#45;&#45;main-color)" title="Подсчет количества за весь период.-->
<!--Оценок переведенных в транзит, сервис,-->
<!--продажу и релизованных. Для руководителей-->
<!--по всем своим сотрудникам">-->
<!--        <QuestionFilled/>-->
<!--      </el-icon>-->
<!--    </div>-->


<!--    <div class="a-credit-application-status-analytics">-->
<!--      <div class="a-status-count-item" style="margin-right: 10px">-->
<!--        <p class="a-value">{{ dashboardInfo.transitCount }}</p>-->
<!--        Транзит-->
<!--      </div>-->
<!--      <div class="a-status-count-item" style="margin-right: 10px">-->
<!--        <p class="a-value">{{ dashboardInfo.serviceCount }}</p>-->
<!--        Сервис-->
<!--      </div>-->
<!--      <div class="a-status-count-item" style="margin-right: 10px">-->
<!--        <p class="a-value">{{ dashboardInfo.sellCount }}</p>-->
<!--        Продажа-->
<!--      </div>-->
<!--      <div class="a-status-count-item" style="margin-right: 10px">-->
<!--        <p class="a-value">{{ dashboardInfo.realizationsCount }}</p>-->
<!--        Реализация-->
<!--      </div>-->
<!--    </div>-->

<!--    <div style="margin: 30px 0">Воронка выкупа-->
<!--      <el-icon style="color: var(&#45;&#45;main-color)" title="Подсчет количества-->
<!--за выбранный месяц. Созданных-->
<!--обращений, оценок,-->
<!--произведенных диагностик, и-->
<!--выкупленных автомобилей-->
<!-- (оценок в которых выкупившим-->
<!-- указан текущий сотрудник). Для-->
<!-- руководителей по всем своим-->
<!-- сотрудникам">-->
<!--        <QuestionFilled/>-->
<!--      </el-icon>-->
<!--    </div>-->

<!--    <div>-->
<!--      <div class="a-graph-3">-->
<!--        <div class="a-label">Обращения</div>-->
<!--        <div class="a-value">{{ dashboardInfo.appealsCount }} / {{ dashboardInfo.appealsCountProc }}%</div>-->
<!--        <div :style="{'width': widthAppeals}" class="a-value-graph"></div>-->
<!--      </div>-->

<!--      <div class="a-graph-3">-->
<!--        <div class="a-label">Осмотры</div>-->
<!--        <div class="a-value">-->
<!--          {{ dashboardInfo.inspectionCount }} / {{ dashboardInfo.inspectionCountProc || 0 }}%-->
<!--        </div>-->
<!--        <div :style="{'width': widthInspection}" class="a-value-graph"></div>-->
<!--      </div>-->

<!--      <div class="a-graph-3">-->
<!--        <div class="a-label">Диагностика</div>-->
<!--        <div class="a-value">-->
<!--          {{ dashboardInfo.diagnosticsCount }} / {{ dashboardInfo.diagnosticsCountProc }}%-->
<!--        </div>-->
<!--        <div :style="{'width': widthAtDiagnosis}" class="a-value-graph"></div>-->
<!--      </div>-->

<!--      <div class="a-graph-3">-->
<!--        <div class="a-label">Выкуплено</div>-->
<!--        <div class="a-value">{{ dashboardInfo.boughtCount }} / {{ dashboardInfo.boughtCountProc }}%</div>-->
<!--        <div :style="{'width': widthBought}" class="a-value-graph"></div>-->
<!--      </div>-->
<!--    </div>-->
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
  line-height: 0.5
}

#a-analytics-block .a-credit-application-status-analytics .a-status-count-item .a-value {
  font-size: 29px;
  font-weight: 500;
  color: #333333;
}

#a-analytics-block .a-workflow-status-analytics .a-counter {
  display: inline-block;
  font-size: 29px;
  font-weight: 500;
  color: #333333;
  vertical-align: middle; }

#a-analytics-block .a-workflow-status-analytics .a-label {
  display: inline-block;
  vertical-align: middle;
  margin-right: 30px;
  width: 25%;
  line-height: 12px; }

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
import {useGlobalStore} from "@/stores/globalStore.ts";

const globalStore = useGlobalStore()
const desktopStore = useDesktopStore()
const dashboardInfo = ref({})
const surrentMonth = ref(new Date().getMonth())
const sales = ref({})
const widthSaleDeal = ref({})

const widthAtDiagnosis = ref({})
const widthBought = ref({})

function monthSelect(direction: number) {
  surrentMonth.value += direction
  if (surrentMonth.value < 0) surrentMonth.value = 11
  if (surrentMonth.value > 11) surrentMonth.value = 0


  desktopStore.getDashboardInfoSales(surrentMonth.value+1).then(data => {
    dashboardInfo.value = data;

    sales.value = (globalStore.account.role === 'SalesEmployee') ? data.appeals.toString() : (data.sales.toString() + '/' + data.appeals.toString());

    widthSaleDeal.value = (data.sales / data.appeals) * 100;

    var meetingProc = ((data.meetings * 100) / data.appeals).toFixed(2);
    dashboardInfo.value.meetingProc = isNaN(meetingProc) ? '0' : meetingProc;

    var testDriveProc = ((data.testDrive * 100) / data.appeals).toFixed(2);
    dashboardInfo.value.testDriveProc = isNaN(testDriveProc) ? '0' : testDriveProc;

    var contractProc = ((data.contract * 100) / data.appeals).toFixed(2);
    dashboardInfo.value.contractProc = isNaN(contractProc) ? '0' : contractProc;

    var recommendationsProc = ((data.recommendations * 100) / data.appeals).toFixed(2);
    dashboardInfo.value.recommendationsProc = isNaN(recommendationsProc) ? '0' : recommendationsProc;

  })
}

monthSelect(0)
</script>
