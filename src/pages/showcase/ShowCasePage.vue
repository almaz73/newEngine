<template>
  <div class="vitrina">
    <ShowCaseFilters @getRecord="getRecord" :gotAlready="false" />
    <ShowCase_Viewer ref="showCase_Viewer" :rootTitle="rootTitle" :lenRoot="lenRoot" />
    <ShowCaseMenu :filter2  />
  </div>
</template>
<style>
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

.vitrina_l_frame {
  border: 1px solid #999;
  border-radius: 5px;
  max-width: 300px;
  padding: 16px;
  position: relative;
  height: 90px
}

.vitrina_l_frame div {
  white-space: nowrap
}

.vitrina_l_frame div span:first-child {
  float: left;
  width: 220px
}

.vitrina_l_frame div span:nth-child(2) {
  width: 50px;
  border-bottom: 1px dotted black
}

.vitrins_l_frame-title {
  position: absolute;
  top: -10px;
  background: #f1f2f4;
  padding: 0 8px
}


.vitrina_root_bts {
  cursor: pointer;
}

.vitrina_root_bts:hover, .vitrina_root_bts.active span {
  color: #d34439
}

.vitrina_root_bts span:nth-child(3) {
  display: none;
}

.vitrina_root_bts.active span:nth-child(1):after {
  content: "  👈";
}


.place-table-vitrina {
  /*width: 420px;*/
  position: relative;
  background: white;
  /*top: 20px;*/
  /*padding-top: 20px;*/
  /*margin-bottom: 20px;*/
}


</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore.ts'
import ShowCaseFilters from '@/pages/showcase/ShowCaseFilters.vue'
import ShowCaseMenu from '@/pages/showcase/ShowCaseMenu.vue'
import { formatDateDDMMYYYY } from '@/utils/globalFunctions'
import ShowCase_Viewer from '@/pages/showcase/ShowCase_Viewer.vue'

const filter2 = ref({ SecondDateFrom: null, highCreateDatePeriod: null })
const globalStore = useGlobalStore()
const data = ref([])
const rootTitle = ref('Обращения')
const lenRoot = ref(10)
const showCase_Viewer = ref(null)


function getDepartments() {
  console.log('9999 = ', 9999)
  // if (!globalStore.isWaiting) $scope.gotAlready = false
  // if (!$scope.filter.orgElementId) return false
  // $http.get(config.apiUrl + '/OrgElement/GetDepartmentsWithBuyLocations?orgId=' + $scope.filter.orgElementId).then(res => {
  //   departments.value = res.data
  // })
}


function getRecord(val: any) {
  let params = {
    OrganizationIds: val.OrganizationIds,
    DepartmentIds: val.DepartmentIds,
    UserIds: val.UserIds,
    WorkflowLeadTypes: val.leadTypes,
    DateFrom: formatDateDDMMYYYY(val.lowCreateDatePeriod),
    DateTo: formatDateDDMMYYYY(val.highCreateDatePeriod),
    Users: true,
    SecondDateFrom: formatDateDDMMYYYY(filter2.value.SecondDateFrom || ''),
    highCreateDatePeriod: formatDateDDMMYYYY(filter2.value.highCreateDatePeriod || '')
  }


  globalStore.getDataMart(params, val.categories).then(res => {
    console.log('res = ', res)
    if (res.commissionCallCenterData) res.commissionCallCenterData.conversionByUser.map((el: any) => el.count = el.conversion)
    if (res.buyCallCenterData) {
      res.buyCallCenterData.buyConversionByUser.map((el: any) => el.count = el.conversion)
      res.buyCallCenterData.evaluationConversionByUser.map((el: any) => el.count = el.conversion)
    }
    // result(res, params)


    console.log('showCaseViewer.value = ', showCase_Viewer.value)

    showCase_Viewer.value.showData(res)
  })


  /*

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


// function result(res, params) {
//   show.value = res
//   // cach[JSON.stringify(params)] = res
//   // level = 1
//   makeTable(res.usersData)
//   globalStore.isWaiting = false
//   // $scope.lenOrgs = ''
//   // $scope.lenUsers = ' : ' + show.value.usersData.length
//   // $scope.searchText = ''
//   // $scope.isShort = false
// }


</script>


