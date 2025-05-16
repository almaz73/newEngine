<template>
  <div class="gendir">
    <div class="gendir-three">
      <div id="a-dashboards">
        <br>
        <el-button size="large" :type="dayMode==='day'?'success':'info'" @click="dayMode='day'">День</el-button>
        <el-button size="large" :type="dayMode==='week'?'success':'info'" @click="dayMode='week'">Неделя</el-button>
        <el-button size="large" :type="dayMode==='month'?'success':'info'" @click="dayMode='month'">Месяц</el-button>

        <el-date-picker
            class="little_date_picker"
            style="margin: 0 12px"
            v-model="searchFilter.date"
            format="DD.MM.YYYY"
            value-format="DD.MM.YYYY"
            :clearable="false"
        />
        <br><br>

        <div class="a-dashboard-item">
          <h3>Входящий трафик</h3>
          <div class="a-table">
            <div class="a-table-row" @click="clientStatusClick('defaultStatus')">
              <div class="a-table-cell"><a>Не указано</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.defaultStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.defaultStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('firstAppealStatus')">
              <div class="a-table-cell"><a>Первичный</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.firstAppealStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.firstAppealStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('byRecommendationStatus')">
              <div class="a-table-cell"><a>По рекомендации</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.byRecommendationStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.byRecommendationStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('foreignStatus')">
              <div class="a-table-cell"><a>Внешний клиент</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.foreignStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.foreignStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('repeatedStatus')">
              <div class="a-table-cell"><a>Повторный</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.repeatedStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.repeatedStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('returnedStatus')">
              <div class="a-table-cell"><a>Вернувшийся</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.returnedStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.returnedStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('orphanStatus')">
              <div class="a-table-cell"><a>Сирота</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.orphanStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.orphanStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('lostedStatus')">
              <div class="a-table-cell"><a>Упущенный клиент</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.lostedStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.lostedStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('autoServiceStatus')">
              <div class="a-table-cell"><a>Клиент автосервиса</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.autoServiceStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.autoServiceStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('calledBeforeStatus')">
              <div class="a-table-cell"><a>Визит по звонку</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.calledBeforeStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.calledBeforeStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('incomingCallStatus')">
              <div class="a-table-cell"><a>Входящий звонок</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.incomingCallStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.incomingCallStatus }}%
              </div>
            </div>
            <div class="a-table-row" @click="clientStatusClick('forgottenStatus')">
              <div class="a-table-cell"><a>Забытый</a></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.forgottenStatus }}
              </div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusProcentCount.forgottenStatus }}%
              </div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Всего</b></div>
              <div class="a-table-cell" style="width: 60px">
                <b>{{ sellManagerDash.appeals.appealsCount }}</b>
              </div>
              <div class="a-table-cell" style="width: 60px"></div>
            </div>
          </div>
        </div>

        <br>
        <div class="a-dashboard-item">
          <h3>Обращения</h3>
          <div class="a-table">
            <div class="a-table-row">
              <div class="a-table-cell"><b>Всего</b></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.appeals.appealsCount }}
              </div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Назначено звонков</b></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.events.appointedCall }}
              </div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Назначено встреч</b></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.events.appointedMeet }}
              </div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Рабочие листы</b></div>
              <div class="a-table-cell" style="width: 60px">{{ sellManagerDash.appeals.workList }}</div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Упущенные клиенты</b></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.clientStatusCount.lostedStatus }}
              </div>
            </div>

            <!--<div class="a-table-row">
                  <div class="a-table-cell"><b>Новые</b></div>
                 <div class="a-table-cell" style="width:50px">{{sellManagerDash.appeals.appealsNew}}</div>
            </div>
             <div class="a-table-row">
                 <div class="a-table-cell"><b>В работе</b></div>
                 <div class="a-table-cell" style="width:50px">{{sellManagerDash.appeals.appealsWork}}</div>
            </div>-->
          </div>
        </div>
        <br>
        <div class="a-dashboard-item">
          <h3 style="padding-bottom: 7px" @click="sellManagerDash.showEvents=!sellManagerDash.showEvents">
            События {{ sellManagerDash.showEvents ? '▲' : '▼' }}
          </h3>
          <div class="a-table" v-if="sellManagerDash.showEvents">
            <div class="a-table-row">
              <div class="a-table-cell"><b>На сегодня</b></div>
              <div class="a-table-cell" style="width: 60px">{{ sellManagerDash.events.eventsNow }}</div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Просроченные</b></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.events.eventsExpired }}
              </div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Всего</b></div>
              <div class="a-table-cell" style="width: 60px">
                {{ sellManagerDash.events.eventsCount }}
              </div>
            </div>
          </div>
        </div>
        <br>


        <div class="a-dashboard-item">
          <h3 style="padding-bottom: 7px" @click="sellManagerDash.showStorage=!sellManagerDash.showStorage">
            Склад {{ sellManagerDash.showStorage ? '▲' : '▼' }}
          </h3>
          <div class="a-table" :style="{display:sellManagerDash.showStorage?'table':'none'}">
            <div class="a-table-row">
              <div class="a-table-cell"><b>Транзит</b></div>
              <div class="a-table-cell" style="width: 60px">{{ sellManagerDash.storage.transit }}</div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Сервис</b></div>
              <div class="a-table-cell" style="width: 60px">{{ sellManagerDash.storage.service }}</div>
            </div>
            <div class="a-table-row">
              <div class="a-table-cell"><b>Продажа</b></div>
              <div class="a-table-cell" style="width: 60px">{{ sellManagerDash.storage.sell }}</div>
            </div>
          </div>

        </div>
        <br><br><br><br>

      </div>
      <div style="display: table-cell;">
        <!--        <h3>Выкуп</h3>-->
        <!--        План-факт-->
        <!--        <el-button type="text" style="text-align: center">◀ &nbsp;</el-button>-->
        <!--        Май-->
        <!--        <el-button type="text">▶</el-button>-->


        <div id="a-analytics-block">
          <h2 v-if="currentUser.role === 'GenManager'">Выкуп</h2>
          <h3>
            План-факт: <a class="uk-icon-chevron-left" @click="monthSelect('left', 'buyer')"></a
          ><span class="a-month" style="color: #ca463b; margin-left: 8px; margin-right: 8px"
          >{{currentMonth.buyer}}</span
          >
            <a class="uk-icon-chevron-right" @click="monthSelect('right', 'buyer')"></a>
          </h3>
          <div class="a-graph-1">
            <div class="a-label">Оценки</div>
            <div class="a-value">{{dashboardInfoBuyer.dealsCount}}</div>
            <div :style="{'width': widthDeal}" class="a-value-graph"></div>
          </div>

          <div class="a-graph-2">
            <div class="a-label">Маржа</div>
            <div class="a-value">нет данных</div>
            <div :style="{'width': widthMargin}" class="a-value-graph"></div>
          </div>

          <h2 class="a-title">
            Выкупленные автомобили
            <a>
              <i
                  class="uk-icon-question-circle"
                  data-uk-tooltip="{pos:'bottom-left'}"
                  title="Подсчет количества за весь период. Оценок переведенных в транзит, сервис, продажу и релизованных. Для руководителей по всем своим сотрудникам"
              ></i>
            </a>
          </h2>

          <div class="a-credit-application-status-analytics">
            <div class="a-status-count-item" style="margin-right: 10px">
              <p class="a-value">{{dashboardInfoBuyer.transitCount}}</p>
              Транзит
            </div>
            <div class="a-status-count-item" style="margin-right: 10px">
              <p class="a-value">{{dashboardInfoBuyer.serviceCount}}</p>
              Сервис
            </div>
            <div class="a-status-count-item" style="margin-right: 10px">
              <p class="a-value">{{dashboardInfoBuyer.sellCount}}</p>
              Продажа
            </div>
            <div class="a-status-count-item" style="margin-right: 10px">
              <p class="a-value">{{dashboardInfoBuyer.realizationsCount}}</p>
              Реализация
            </div>
          </div>

          <h2 class="a-title">
            Воронка выкупа
            <a>
              <i
                  class="uk-icon-question-circle"
                  data-uk-tooltip="{pos:'bottom-left'}"
                  title="Подсчет количества за выбранный месяц. Созданных обращений, оценок, произведенных диагностик, и выкупленных автомобилей
       (оценок в которых выкупившим указан текущий сотрудник). Для руководителей по всем своим сотрудникам"
              ></i>
            </a>
          </h2>

          <div class="a-graph-3">
            <div class="a-label">Обращения</div>
            <div class="a-value">{{dashboardInfoBuyer.appealsCount}} / {{dashboardInfoBuyer.appealsCountProc}}%</div>
            <div :style="{'width': widthAppeals}" class="a-value-graph"></div>
          </div>

          <div class="a-graph-3">
            <div class="a-label">Осмотры</div>
            <div class="a-value">
              {{dashboardInfoBuyer.inspectionCount}} / {{dashboardInfoBuyer.inspectionCountProc || 0}}%
            </div>
            <div :style="{'width': widthInspection}" class="a-value-graph"></div>
          </div>

          <div class="a-graph-3">
            <div class="a-label">Диагностика</div>
            <div class="a-value">
              {{dashboardInfoBuyer.diagnosticsCount}} / {{dashboardInfoBuyer.diagnosticsCountProc}}%
            </div>
            <div :style="{'width': widthAtDiagnosis}" class="a-value-graph"></div>
          </div>

          <div class="a-graph-3">
            <div class="a-label">Выкуплено</div>
            <div class="a-value">{{dashboardInfoBuyer.boughtCount}} / {{dashboardInfoBuyer.boughtCountProc}}%</div>
            <div :style="{'width': widthBought}" class="a-value-graph"></div>
          </div>
        </div>

      </div>
      <div>


        <div id="a-analytics-block">
          <h2 v-if="currentUser.role === 'GenManager'">Продажа</h2>
          <h3>
            План-факт:
            <a class="uk-icon-chevron-left" @click="monthSelect('left', 'sails')"></a>
            <span class="a-month" style="color: #ca463b; margin-left: 8px; margin-right: 8px"
            >{{currentMonth.sails}}</span
            >
            <a class="uk-icon-chevron-right" @click="monthSelect('right', 'sails')"></a>
          </h3>
          <div class="a-graph-1">
            <div class="a-label">Продажи</div>
            <div class="a-value">{{sales}}</div>
            <div :style="{'width': widthSaleDeal}" class="a-value-graph"></div>
          </div>

          <div class="a-workflow-status-analytics">
            <div class="a-counter">0</div>
            <div class="a-label">автомобиля в резерве</div>
            <div class="a-counter">0</div>
            <div class="a-label">внесена предоплата</div>
          </div>

          <h2 class="a-title">Кредитные заявки</h2>

          <div class="a-credit-application-status-analytics">
            <div class="a-status-count-item">
              <p class="a-value">{{dashboardInfo.creditApplicationFiled}}</p>
              подано
            </div>
            <div class="a-status-count-item">
              <p class="a-value">{{dashboardInfo.creditApplicationInWork}}</p>
              в работе
            </div>
            <div class="a-status-count-item">
              <p class="a-value">{{dashboardInfo.creditApplicationApproved}}</p>
              одобрено
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
        </div>
      </div>
    </div>
  </div>

</template>
<style>

.gendir {
  /*background: yellow;*/
  max-width: 1600px;
  margin: 0 auto;
}

.gendir div > div {
  /*border: 1px solid pink;*/
}

.gendir-three {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.gendir-three > div {
  min-width: 350px;
  padding: 0 10px;
}

.little_date_picker {
  width: 90px !important;
}

.little_date_picker .el-input__wrapper {
  width: 90px;
  padding-left: 20px;
}

#a-dashboards .a-table {
  display: table;
  box-sizing: border-box;
}

/*///////////////*/

#a-dashboards .a-dashboard-item {
  background-image: initial;
  background-color: #181a1b;
  box-shadow: #3c4144 0px 2px 3px 2px;
}

#a-dashboards .a-dashboard-item {
  width: 400px;
  background: #fff;
  box-shadow: 0 2px 3px 2px #c1bdbd;
  /*margin: 20px;*/
}

@media (width < 500px) {
  #a-dashboards .a-dashboard-item {
    width: 352px;
  }

  .little_date_picker .el-input__wrapper {
    margin-top: 16px;
    width: 120px;
  }
}

#a-dashboards .a-table {
  display: table;
  box-sizing: border-box;
}

.a-table {
  background-image: initial;
  background-color: initial;
}

@media screen and (max-width: 1280px) {
  .a-table {
    table-layout: fixed;
  }
}

.a-table {
  width: 100%;
  padding: 15px;
  background: 0 0;
}

#a-dashboards .a-table-row {
  display: table-row;
}

#a-dashboards .a-dashboard-item .a-table-cell {
  border-bottom-color: #383d3f;
}

#a-dashboards .a-dashboard-item .a-table-cell {
  border-bottom: 1px solid #e2e2e2;
  word-break: break-all;
  padding: 7px 0;
}

#a-dashboards .a-table-cell {
  display: table-cell;
}

#a-dashboards .a-dashboard-item h3 {
  font-weight: 700;
  text-align: center;
  margin: 0;
  padding-top: 10px;
  font-size: 18px;
}


#a-analytics-block .a-graph-1 {
  background-color:  rgba(25, 149, 128, 0.2);
}

#a-analytics-block .a-graph-1, #a-analytics-block .a-graph-2, #a-analytics-block .a-graph-3 {
  width: 100%;
  height: 21px;
  border-radius: 3px;
  position: relative;
  margin-bottom: 20px;
}
#a-analytics-block .a-graph-1 {
  background-color: rgba(80, 226, 193, .2);
}

#a-analytics-block .a-graph-1 .a-label, #a-analytics-block .a-graph-2 .a-label, #a-analytics-block .a-graph-3 .a-label {
  position: absolute;
  top: 2px;
  left: 5px;
  z-index: 20;
}

#a-analytics-block .a-graph-2 {
  background-color: rgba(12, 80, 113, 0.2);
}

#a-analytics-block .a-graph-1, #a-analytics-block .a-graph-2, #a-analytics-block .a-graph-3 {
  width: 100%;
  height: 21px;
  border-radius: 3px;
  position: relative;
  margin-bottom: 20px;
}
#a-analytics-block .a-graph-2 {
  background-color: rgba(144, 211, 243, .2);
}

#a-analytics-block .a-graph-1 .a-value, #a-analytics-block .a-graph-2 .a-value, #a-analytics-block .a-graph-3 .a-value {
  position: absolute;
  z-index: 10;
  right: 5px;
  top: 2px;
}

#a-analytics-block .a-title {
  color:  #c8c3bc;
}

#a-analytics-block .a-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

#a-analytics-block .a-credit-application-status-analytics, #a-analytics-block .a-workflow-status-analytics {
  text-align: left;
  width: 100%;
}

#a-analytics-block .a-credit-application-status-analytics .a-status-count-item {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

#a-analytics-block .a-credit-application-status-analytics, #a-analytics-block .a-workflow-status-analytics {
  text-align: left;
  width: 100%;
}

#a-analytics-block .a-credit-application-status-analytics .a-status-count-item .a-value {
  color:  #c8c3bc;
}

#a-analytics-block .a-credit-application-status-analytics .a-status-count-item .a-value {
  font-size: 29px;
  font-weight: 500;
  color: #333;
}
#a-analytics-block .a-credit-application-status-analytics .a-status-count-item {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

#a-analytics-block .a-graph-3 {
  border-bottom-color: #3a3f41;
}
#a-analytics-block .a-graph-1, #a-analytics-block .a-graph-2, #a-analytics-block .a-graph-3 {
  width: 100%;
  height: 21px;
  border-radius: 3px;
  position: relative;
  margin-bottom: 20px;
}
#a-analytics-block .a-graph-3 {
  border-bottom: 1px solid #dcdcdc;
  position: relative;
}

#a-analytics-block .a-workflow-status-analytics .a-counter {
  display: inline-block;
  font-size: 29px;
  font-weight: 500;
  color: #333;
  vertical-align: middle;
}

#a-analytics-block .a-credit-application-status-analytics, #a-analytics-block .a-workflow-status-analytics {
  text-align: left;
  width: 100%;
}

#a-analytics-block .a-workflow-status-analytics .a-counter {
  color: #c8c3bc;
}
#a-analytics-block .a-workflow-status-analytics .a-counter {
  display: inline-block;
  font-size: 29px;
  font-weight: 500;
  color: #333;
  vertical-align: middle;
}
</style>
<script setup lang="ts">
import {ref} from "vue";
import {useDesktopStore} from "@/stores/desktopStore";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDateDDMMYYYY} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const desktopStore = useDesktopStore()
const searchFilter = ref({ date:formatDateDDMMYYYY(new Date())})
const dayMode = ref('day')
// const tableData1 = ref([])
const currentMonth = ref({})
const dashboardInfoBuyer = ref({})
const sellManagerDash = ref({
  clientStatusProcentCount: {},
  clientStatusCount: {},
  appeals: {},
  showEvents: false,
  showStorage: false,
  events: {},
  storage: {}
});
const dashboardInfo = ref({})
const currentUser = ref(globalStore.account)

console.log('currentUser.value = ',currentUser.value)

globalStore.isWaiting = true
desktopStore.getDashboardInfoSalesManager({}).then(function (data) {
  globalStore.isWaiting = false
/*let data = {
  "clientStatusCount": {
    "defaultStatus": 12.11,
    "firstAppealStatus": 12.11,
    "byRecommendationStatus": 12.11,
    "foreignStatus": 12.11,
    "repeatedStatus": 12.11,
    "returnedStatus": 12.11,
    "orphanStatus": 12.11,
    "lostedStatus": 12.11,
    "autoServiceStatus": 12.11,
    "calledBeforeStatus": 12.11,
    "forgottenStatus": 12.11,
    "incomingCallStatus": 12.11
  },
  "clientStatusProcentCount": {
    "defaultStatus": 12.11,
    "firstAppealStatus": 12.11,
    "byRecommendationStatus": 12.11,
    "foreignStatus": 12.11,
    "repeatedStatus": 12.11,
    "returnedStatus": 12.11,
    "orphanStatus": 12.11,
    "lostedStatus": 12.11,
    "autoServiceStatus": 12.11,
    "calledBeforeStatus": 12.11,
    "forgottenStatus": 12.11,
    "incomingCallStatus": 12.11
  },
  "appeals": {
    "appealsCount": 7,
    "appealsNew": 7,
    "appealsWork": 7,
    "workList": 7
  },
  "events": {
    "eventsCount": 7,
    "eventsNow": 7,
    "eventsExpired": 7,
    "appointedCall": 7,
    "appointedMeet": 7
  },
  "storage": {
    "transit": 7,
    "service": 7,
    "sell": 7
  }
}*/

  console.log('data = ', data)
// DashboardService.getDashboardInfoSalesManager({ filter: $scope.searchFilter }).then(function (data) {
//   sellManagerDash.value = data


  sellManagerDash.value.appeals = data.appeals;
  sellManagerDash.value.clientStatusCount = data.clientStatusCount;
  sellManagerDash.value.clientStatusProcentCount = data.clientStatusProcentCount;
  sellManagerDash.value.events = data.events;
  sellManagerDash.value.storage = data.storage;

  console.log('sellManagerDash.value = ', sellManagerDash.value)
});


function clientStatusClick() {
  console.log('clientStatusClick = ')
}
</script>