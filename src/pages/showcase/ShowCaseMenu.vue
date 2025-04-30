<template>
  <div class="vitrina-block little">
    <div class="vitrina_l_frame" style="height: 100px">
      <div class="vitrins_l_frame-title">
        <small>Оперативная информация</small>
      </div>

      <div class="vitrina_root_bts" :class="{'active':showName==='overdueTotalByUser1'}"
           @click="toShow('appealData|overdueTotalByUser1', 'Общее. Просроченные события')">
        <span>Просроченные события</span>
        <span>{{ show.appealData.overdueTotal }}</span>
      </div>

      <div class="vitrina_root_bts" :class="{'active':showName==='archiveRequestTotalByUser1'}"
           @click="toShow('appealData|archiveRequestTotalByUser1', 'Общее. Запрос в архив')">
        <span>Запрос в архив</span>
        <span>{{ show.appealData.archiveRequestTotal }}</span>
      </div>
    </div>

    <div class="block" style="margin: -73px 0 10px 0 ">
      <label class="label-red">&nbsp; Период</label><br>
      <div style="margin: -20px 0 0 100px">
        <el-date-picker
          v-model="props.filter2.SecondDateFrom"
          type="date"
          format="DD.MM.YYYY"
          placeholder="От"
        />
        <br>
        <el-date-picker
          v-model="props.filter2.highCreateDatePeriod"
          type="date"
          format="DD.MM.YYYY"
          placeholder="До"
        />
      </div>
    </div>
    <br>

    <div class="vitrina_l_frame" style="height: 50px">
      <div class="vitrins_l_frame-title">
        <small>Оперативная информация по обращениями</small>
      </div>

      <div class="vitrina_root_bts" :class="{'active':showName==='totalByUser1'}"
           @click="toShow('appealData|totalByUser1', 'Общее. Обращения')">
        <span>Обращения в работе</span>
        <span>{{ show.appealData.total }}</span>
      </div>

      <div class="vitrina_root_bts" :class="{'active':showName==='todayTotalByUser1'}"
           @click="toShow('appealData|todayTotalByUser1', 'Общее. События сегодня')">
        <span>События сегодня</span>
        <span>{{ show.appealData.todayTotal }}</span>
      </div>


      <div class="vitrina_root_bts" :class="{'active':showName==='archivedTotalByUser1'}"
           @click="toShow('appealData|archivedTotalByUser1', 'Архив')">
        <span>Архив</span>
        <span>{{ show.appealData.archivedTotal }}</span>
      </div>

    </div>
    <br>
    <div class="vitrina_l_frame" style="height: 190px">
      <div class="vitrins_l_frame-title">
        <small>Воронка КЦ (выкуп)</small>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='totalByUser2'}"
           @click="toShow('buyCallCenterData|totalByUser2', 'Выкуп. Обращения')">
        <span>Обращения</span>
        <span>{{ show.buyCallCenterData.total }}</span>
      </div>
      <div v-if="globalStore.account.role!=='CallManager'">
        <div class="vitrina_root_bts" :class="{'active':showName==='callTotalByUser2'}"
             @click="toShow('buyCallCenterData|callTotalByUser2', 'Выкуп. Звонок')">
          <span>Звонок</span>
          <span>{{ show.buyCallCenterData.callTotal }}</span>
        </div>
        <div class="vitrina_root_bts" :class="{'active':showName==='confirmationMeetTotalByUser2'}"
             @click="toShow('buyCallCenterData|confirmationMeetTotalByUser2', 'Выкуп. Подтверждение встречи')">
          <span>Подтверждение встречи</span>
          <span>{{ show.buyCallCenterData.confirmationMeetTotal }}</span>
        </div>
        <div class="vitrina_root_bts" :class="{'active':showName==='meetTotalByUser2'}"
             @click="toShow('buyCallCenterData|meetTotalByUser2', 'Выкуп. Встреча')">
          <span>Встреча</span>
          <span>{{ show.buyCallCenterData.meetTotal }}</span>
        </div>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='evaluationTotalByUser2'}"
           @click="toShow('buyCallCenterData|evaluationTotalByUser2', 'Выкуп. Оценка')">
        <span>Оценка</span>
        <span>{{ show.buyCallCenterData.evaluationTotal }}</span>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='acceptTotalByUser2'}"
           @click="toShow('buyCallCenterData|acceptTotalByUser2', 'Выкуплено')">
        <span>Выкуплено</span>
        <span>{{ show.buyCallCenterData.acceptTotal }}</span>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='rejectTotalByUser2'}"
           @click="toShow('buyCallCenterData|rejectTotalByUser2', 'Выкуп. Отказ')">
        <span>Отказ</span>
        <span>{{ show.buyCallCenterData.rejectTotal }}</span>
      </div>

      <div class="vitrina_root_bts" :class="{'active':showName==='rejectedBuysByUser2'}"
           @click="toShow('buyCallCenterData|rejectedBuysByUser2', 'Выкуп. Отказ')">
        <span>Заявка отклонена</span>
        <span>{{ show.buyCallCenterData.rejectedBuysTotal }}</span>
      </div>


      <div class="vitrina_root_bts" :class="{'active':showName==='conversionByUser2'}"
           @click="toShow('buyCallCenterData|conversionByUser2', 'Выкуп. Конверсия')">
        <span>Конверсия: Выкуп/Обращение, %</span>
        <span>{{ show.buyCallCenterData.conversion }}</span>
      </div>

      <div class="vitrina_root_bts" :class="{'active':showName==='evaluationConversionByUser2'}"
           @click="toShow('buyCallCenterData|evaluationConversionByUser2', 'Выкуп. Конверсия')">
        <span>Конверсия: Оценка/Обращение, %</span>
        <span>{{ show.buyCallCenterData.evaluationConversion }}</span>
      </div>

      <div class="vitrina_root_bts" :class="{'active':showName==='buyConversionByUser2'}"
           @click="toShow('buyCallCenterData|buyConversionByUser2', 'Выкуп. Конверсия')">
        <span>Конверсия: Выкуп/Оценка, %</span>
        <span>{{ show.buyCallCenterData.buyConversion }}</span>
      </div>


    </div>
    <br>
    <div class="vitrina_l_frame" style="height: 120px">
      <div class="vitrins_l_frame-title">
        <small>Воронка КЦ (комиссия)</small>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='totalByUser3'}"
           @click="toShow('commissionCallCenterData|totalByUser3', 'Комиссия. Обращения')">
        <span>Обращения</span>
        <span>{{ show.commissionCallCenterData.total }}</span>
      </div>
      <div v-if="globalStore.account.role!=='CallManager'">
        <div class="vitrina_root_bts" :class="{'active':showName==='callTotalByUser3'}"
             @click="toShow('commissionCallCenterData|callTotalByUser3', 'Комиссия. Звонок')">
          <span>Звонок</span>
          <span>{{ show.commissionCallCenterData.callTotal }}</span>
        </div>
        <div class="vitrina_root_bts" :class="{'active':showName==='confirmationMeetTotalByUser3'}"
             @click="toShow('commissionCallCenterData|confirmationMeetTotalByUser3', 'Комиссия. Подтверждение встречи')">
          <span>Подтверждение встречи</span>
          <span>{{ show.commissionCallCenterData.confirmationMeetTotal }}</span>
        </div>
        <div class="vitrina_root_bts" :class="{'active':showName==='meetTotalByUser3'}"
             @click="toShow('commissionCallCenterData|meetTotalByUser3', 'Комиссия. Встреча')">
          <span>Встреча</span>
          <span>{{ show.commissionCallCenterData.meetTotal }}</span>
        </div>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='rejectTotalByUser3'}"
           @click="toShow('commissionCallCenterData|rejectTotalByUser3', 'Комиссия. Отказ')">
        <span>Отказ</span>
        <span>{{ show.commissionCallCenterData.rejectTotal }}</span>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='acceptTotalByUser3'}"
           @click="toShow('commissionCallCenterData|acceptTotalByUser3', 'Принято на комиссию')">
        <span>Принято на комиссию</span>
        <span>{{ show.commissionCallCenterData.acceptTotal }}</span>
      </div>
      <div class="vitrina_root_bts" :class="{'active':showName==='conversionByUser3'}"
           @click="toShow('commissionCallCenterData|conversionByUser3', 'Комиссия. Конверсия')">
        <span>Конверсия: Принято/Обращение, %</span>
        <span>{{ show.commissionCallCenterData.conversion }}</span>
      </div>
      <br>

    </div>
  </div>
</template>


<script setup lang="ts">
import { useGlobalStore } from '@/stores/globalStore.ts'
import { ref } from 'vue'

const globalStore = useGlobalStore()
const filter2 = ref({})
const show = ref<any>({ appealData: {}, buyCallCenterData: {}, commissionCallCenterData: {} })
const showName = ref('')
const rootTitle = ref('')

const props = defineProps(['filter2'])

function toShow(val, name) {
  let path = val.split('|')
  console.log('path = ', path)

  showName.value = path[1]
  rootTitle.value = name
  let node = show.value[path[0]]
  let users = node[path[1].slice(0, -1)]
  // if (users) $scope.lenUsers = ' : ' + users.length
  makeTable(users)
  // $scope.isShort = true
  // $scope.gotAlready = false
}

function makeTable() {

}
</script>

