<template>
  <div class="vitrina">
    <div class="vitrina-block little">
      <div v-if="globalStore.account.role!=='CallManager'">
        <label class="label-red">Организация</label><br>
        <el-select
          v-model="filter.OrganizationIds"
          multiple
          clearable
          @change="getDepartments()"
        >
          <el-option
            v-for="item in organizations"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <br><br>

        <label class="label-red">Отдел</label><br>
        <el-select
          v-model="filter.DepartmentIds"
          multiple
          clearable
        >
          <el-option
            v-for="item in departments"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <br><br>


      </div>

      <label class="label-red">Категория менеджеров</label><br>
      <el-select
        v-model="filter.categories"
        multiple
        clearable
        @change="getManagers()"
      >
        <el-option
          v-for="item in roleCategories"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <br><br>
      <label class="label-red">Менеджер</label><br>
      <el-select
        v-model="filter.DepartmentIds"
        multiple
        clearable
      >
        <el-option
          v-for="item in departments"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <br><br>

      <label class="label-red">Вид обращения</label><br>
      <el-select
        v-model="filter.DepartmentIds"
        multiple
        clearable
      >
        <el-option
          v-for="item in departments"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <br><br>

      <div class="block">
        <label class="label-red">Период</label><br>
        <div style="margin: -25px 0 0 105px">
          <el-date-picker
            v-model="filter.lowCreateDatePeriod"
            type="date"
            placeholder="От"
          />
          <br>
          <el-date-picker
            v-model="filter.highCreateDatePeriod"
            type="date"
            placeholder="До"
          />
        </div>
      </div>

      <br>
      <el-button type="success" style="float: right" @click="getRecord()" :disabled="gotAlready">
        Сформировать
      </el-button>

    </div>
    <div class="vitrina-block">
      912 1 1212 3120931239 1231203123912 312309121 12912 293023 20323 0923

    </div>
    <div class="vitrina-block little">


      <div class="l_frame" style="height: 100px">
        <div class="l_frame-title">
          <small>Оперативная информация </small>
        </div>

        <div class="root_bts" :class="{'active':showName==='overdueTotalByUser1'}"
             @click="toShow('appealData|overdueTotalByUser1', 'Общее. Просроченные события')">
          <span>Просроченные события</span>
          <span>{{ show.appealData.overdueTotal }}</span>
        </div>

        <div class="root_bts" :class="{'active':showName==='archiveRequestTotalByUser1'}"
             @click="toShow('appealData|archiveRequestTotalByUser1', 'Общее. Запрос в архив')">
          <span>Запрос в архив</span>
          <span>{{ show.appealData.archiveRequestTotal }}</span>
        </div>
      </div>

      <div class="block" style="margin: -73px 0 10px 0 ">
        <label class="label-red">&nbsp; Период</label><br>
        <div style="margin: -20px 0 0 100px">
          <el-date-picker
            v-model="filter.lowCreateDatePeriod"
            type="date"
            placeholder="От"
          />
          <br>
          <el-date-picker
            v-model="filter.highCreateDatePeriod"
            type="date"
            placeholder="До"
          />
        </div>
      </div>
      <br>

      <div class="l_frame" style="height: 50px">
        <div class="l_frame-title">
          <small>Оперативная информация по обращениями</small>
        </div>

        <div class="root_bts" :class="{'active':showName==='totalByUser1'}"
             @click="toShow('appealData|totalByUser1', 'Общее. Обращения')">
          <span>Обращения в работе</span>
          <span>{{ show.appealData.total }}</span>
        </div>

        <div class="root_bts" :class="{'active':showName==='todayTotalByUser1'}"
             @click="toShow('appealData|todayTotalByUser1', 'Общее. События сегодня')">
          <span>События сегодня</span>
          <span>{{ show.appealData.todayTotal }}</span>
        </div>

        <!--                <div class="root_bts" :class="{'active':showName==='overdueTotalByUser1'}"-->
        <!--                     @click="toShow('appealData|overdueTotalByUser1', 'Общее. Просроченные события')">-->
        <!--                    <span>Просроченные события</span>-->
        <!--                    <span>{{show.appealData.overdueTotal}}</span>-->
        <!--                </div>-->

        <!--                <div class="root_bts" :class="{'active':showName==='archiveRequestTotalByUser1'}"-->
        <!--                     @click="toShow('appealData|archiveRequestTotalByUser1', 'Общее. Запрос в архив')">-->
        <!--                    <span>Запрос в архив</span>-->
        <!--                    <span>{{show.appealData.archiveRequestTotal}}</span>-->
        <!--                </div>-->

        <div class="root_bts" :class="{'active':showName==='archivedTotalByUser1'}"
             @click="toShow('appealData|archivedTotalByUser1', 'Архив')">
          <span>Архив</span>
          <span>{{ show.appealData.archivedTotal }}</span>
        </div>

      </div>
      <br>
      <div class="l_frame" style="height: 190px">
        <div class="l_frame-title">
          <small>Воронка КЦ (выкуп)</small>
        </div>
        <div class="root_bts" :class="{'active':showName==='totalByUser2'}"
             @click="toShow('buyCallCenterData|totalByUser2', 'Выкуп. Обращения')">
          <span>Обращения</span>
          <span>{{ show.buyCallCenterData.total }}</span>
        </div>
        <div v-if="globalStore.account.role!=='CallManager'">
          <div class="root_bts" :class="{'active':showName==='callTotalByUser2'}"
               @click="toShow('buyCallCenterData|callTotalByUser2', 'Выкуп. Звонок')">
            <span>Звонок</span>
            <span>{{ show.buyCallCenterData.callTotal }}</span>
          </div>
          <div class="root_bts" :class="{'active':showName==='confirmationMeetTotalByUser2'}"
               @click="toShow('buyCallCenterData|confirmationMeetTotalByUser2', 'Выкуп. Подтверждение встречи')">
            <span>Подтверждение встречи</span>
            <span>{{ show.buyCallCenterData.confirmationMeetTotal }}</span>
          </div>
          <div class="root_bts" :class="{'active':showName==='meetTotalByUser2'}"
               @click="toShow('buyCallCenterData|meetTotalByUser2', 'Выкуп. Встреча')">
            <span>Встреча</span>
            <span>{{ show.buyCallCenterData.meetTotal }}</span>
          </div>
        </div>
        <div class="root_bts" :class="{'active':showName==='evaluationTotalByUser2'}"
             @click="toShow('buyCallCenterData|evaluationTotalByUser2', 'Выкуп. Оценка')">
          <span>Оценка</span>
          <span>{{ show.buyCallCenterData.evaluationTotal }}</span>
        </div>
        <div class="root_bts" :class="{'active':showName==='acceptTotalByUser2'}"
             @click="toShow('buyCallCenterData|acceptTotalByUser2', 'Выкуплено')">
          <span>Выкуплено</span>
          <span>{{ show.buyCallCenterData.acceptTotal }}</span>
        </div>
        <div class="root_bts" :class="{'active':showName==='rejectTotalByUser2'}"
             @click="toShow('buyCallCenterData|rejectTotalByUser2', 'Выкуп. Отказ')">
          <span>Отказ</span>
          <span>{{ show.buyCallCenterData.rejectTotal }}</span>
        </div>

        <div class="root_bts" :class="{'active':showName==='rejectedBuysByUser2'}"
             @click="toShow('buyCallCenterData|rejectedBuysByUser2', 'Выкуп. Отказ')">
          <span>Заявка отклонена</span>
          <span>{{ show.buyCallCenterData.rejectedBuysTotal }}</span>
        </div>


        <div class="root_bts" :class="{'active':showName==='conversionByUser2'}"
             @click="toShow('buyCallCenterData|conversionByUser2', 'Выкуп. Конверсия')">
          <span>Конверсия: Выкуп/Обращение, %</span>
          <span>{{ show.buyCallCenterData.conversion }}</span>
        </div>

        <div class="root_bts" :class="{'active':showName==='evaluationConversionByUser2'}"
             @click="toShow('buyCallCenterData|evaluationConversionByUser2', 'Выкуп. Конверсия')">
          <span>Конверсия: Оценка/Обращение, %</span>
          <span>{{ show.buyCallCenterData.evaluationConversion }}</span>
        </div>

        <div class="root_bts" :class="{'active':showName==='buyConversionByUser2'}"
             @click="toShow('buyCallCenterData|buyConversionByUser2', 'Выкуп. Конверсия')">
          <span>Конверсия: Выкуп/Оценка, %</span>
          <span>{{ show.buyCallCenterData.buyConversion }}</span>
        </div>


      </div>
      <br>
      <div class="l_frame" style="height: 120px">
        <div class="l_frame-title">
          <small>Воронка КЦ (комиссия)</small>
        </div>
        <div class="root_bts" :class="{'active':showName==='totalByUser3'}"
             @click="toShow('commissionCallCenterData|totalByUser3', 'Комиссия. Обращения')">
          <span>Обращения</span>
          <span>{{ show.commissionCallCenterData.total }}</span>
        </div>
        <div v-if="globalStore.account.role!=='CallManager'">
          <div class="root_bts" :class="{'active':showName==='callTotalByUser3'}"
               @click="toShow('commissionCallCenterData|callTotalByUser3', 'Комиссия. Звонок')">
            <span>Звонок</span>
            <span>{{ show.commissionCallCenterData.callTotal }}</span>
          </div>
          <div class="root_bts" :class="{'active':showName==='confirmationMeetTotalByUser3'}"
               @click="toShow('commissionCallCenterData|confirmationMeetTotalByUser3', 'Комиссия. Подтверждение встречи')">
            <span>Подтверждение встречи</span>
            <span>{{ show.commissionCallCenterData.confirmationMeetTotal }}</span>
          </div>
          <div class="root_bts" :class="{'active':showName==='meetTotalByUser3'}"
               @click="toShow('commissionCallCenterData|meetTotalByUser3', 'Комиссия. Встреча')">
            <span>Встреча</span>
            <span>{{ show.commissionCallCenterData.meetTotal }}</span>
          </div>
        </div>
        <div class="root_bts" :class="{'active':showName==='rejectTotalByUser3'}"
             @click="toShow('commissionCallCenterData|rejectTotalByUser3', 'Комиссия. Отказ')">
          <span>Отказ</span>
          <span>{{ show.commissionCallCenterData.rejectTotal }}</span>
        </div>
        <div class="root_bts" :class="{'active':showName==='acceptTotalByUser3'}"
             @click="toShow('commissionCallCenterData|acceptTotalByUser3', 'Принято на комиссию')">
          <span>Принято на комиссию</span>
          <span>{{ show.commissionCallCenterData.acceptTotal }}</span>
        </div>
        <div class="root_bts" :class="{'active':showName==='conversionByUser3'}"
             @click="toShow('commissionCallCenterData|conversionByUser3', 'Комиссия. Конверсия')">
          <span>Конверсия: Принято/Обращение, %</span>
          <span>{{ show.commissionCallCenterData.conversion }}</span>
        </div>
        <br>

      </div>
    </div>

  </div>
</template>
<style scoped>
.vitrina {
  display: flex;
  margin: auto;
  max-width: 1400px;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
}

.vitrina-block {
  max-width: 500px;
  background: white;
  padding: 10px;
}

.vitrina-block.little {
  width: 320px;
}

.l_frame {
  border: 1px solid #999;
  border-radius: 5px;
  max-width: 300px;
  padding: 16px;
  position: relative;
  height: 90px
}

.l_frame div {
  white-space: nowrap
}

.l_frame div span:first-child {
  float: left;
  width: 220px
}

.l_frame div span:nth-child(2) {
  width: 50px;
  border-bottom: 1px dotted black
}

.l_frame-title {
  position: absolute;
  top: -10px;
  background: #f1f2f4;
  padding: 0 8px
}

/*.place-table-vitrina {*/
/*  width: 420px;*/
/*  position: relative;*/
/*  background: white;*/
/*  top: 20px;*/
/*  margin-bottom: 20px;*/
/*}*/

/*!*.top8 {*!*/
/*!*  margin-top: 8px*!*/
/*!*}*!*/

/*!*.b_org_us {*!*/
/*!*  display: flex;*!*/
/*!*  justify-content: space-between;*!*/
/*!*  margin-top: 20px*!*/
/*!*}*!*/

/*!*.b_org_us button {*!*/
/*!*  padding: 0 30px;*!*/
/*!*}*!*/

.root_bts {
  cursor: pointer;
}

.root_bts:hover, .root_bts.active span {
  color: #d34439
}

.root_bts span:nth-child(3) {
  display: none;
}

.root_bts.active span:nth-child(2):after {
  content: "  👈";
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import { useReportStore } from '@/stores/reportStore.ts'
import { useAdminStore } from '@/stores/adminStore.ts'

const adminStore = useAdminStore()
const reportStore = useReportStore()
const globalStore = useGlobalStore()
const organizations = ref([])
const departments = ref([])
const roleCategories = ref([])
const filter = ref<any>({ OrganizationIds: [], DepartmentIds: [] })
const gotAlready = ref
const show = ref<any>({ appealData: {}, buyCallCenterData: {}, commissionCallCenterData: {} })
const showName = ref('')
const rootTitle = ref('')


function getDepartments() {
  console.log('9999 = ', 9999)
  // if (!globalStore.isWaiting) $scope.gotAlready = false
  // if (!$scope.filter.orgElementId) return false
  // $http.get(config.apiUrl + '/OrgElement/GetDepartmentsWithBuyLocations?orgId=' + $scope.filter.orgElementId).then(res => {
  //   departments.value = res.data
  // })
}

function getManagers() {

}

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

let cach = {}

function getRecord() {
  /*
  let params = {
    OrganizationIds: $scope.filter.OrganizationIds,
    DepartmentIds: $scope.filter.DepartmentIds,
    UserIds: $scope.filter.UserIds,
    Categories: $scope.filter.categories,
    WorkflowLeadTypes: $scope.filter.leadTypes,
    DateFrom: $scope.filter.lowCreateDatePeriod,
    DateTo: $scope.filter.highCreateDatePeriod,
    Users: true
  }
  $scope.isWaiter = true
  $scope.rootTitle = 'Обращения'
  $scope.showName = 'total'
  $scope.lenRoot = 0
  $scope.gotAlready = true

  if (cach[JSON.stringify(params)]) return result(cach[JSON.stringify(params)])
  GetService.Get('Dashboard/GetDataMart', params).then(res => {
    if (res.commissionCallCenterData) res.commissionCallCenterData.conversionByUser.map(el => el.count = el.conversion)
    if (res.buyCallCenterData) {
      res.buyCallCenterData.buyConversionByUser.map(el => el.count = el.conversion)
      res.buyCallCenterData.evaluationConversionByUser.map(el => el.count = el.conversion)
    }
    result(res, params)
  }, err => {
    console.error(err)
    $scope.isWaiter = false
  });
*/
}

function result(res, params) {
  show.value = res
  // cach[JSON.stringify(params)] = res
  // level = 1
  makeTable(res.usersData)
  globalStore.isWaiting = false
  // $scope.lenOrgs = ''
  // $scope.lenUsers = ' : ' + show.value.usersData.length
  // $scope.searchText = ''
  // $scope.isShort = false
}


onMounted(() => {
  globalStore.setTitle('Витрина')
  globalStore.steps = []

  globalStore.getOrganizations().then(res => organizations.value = res.items)
  adminStore.getDepartmentsWithBuyLocations(3).then(res => departments.value = res)
  globalStore.getRoleCategories().then(res => {
    roleCategories.value = res.filter((el: any) => [60, 61].includes(el.value))
  })

})
</script>


