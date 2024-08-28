<template>

  <div>
    <div class="insp_time">
      <span v-if="inspection.createDate">{{ formatDMY_hm(inspection.createDate) }}</span>
      <br />
      {{ inspection.createdUserLastName }} {{ inspection.createdUserFistName }}
    </div>

    <div class="insp_time" style="background: #3cac71">
      <span v-if="inspection.lastUpdateDate">{{ formatDMY_hm(inspection.lastUpdateDate) }}</span>
      <br />
      {{ inspection.lastUpdateUserLastName }} {{ inspection.lastUpdateUserFistName }}
    </div>

    <!--    <span ng-if="dealStore.deal.malfunctions" style="font-size: large"><a data-uk-modal="{target:'#damages', center:true}">Возможные неисправнсти</a></span>-->

    <div style="margin-top: 12px">
      <span style="background: #d34338;  padding: 3px 10px; margin-right: 8px"></span> <span>Создан</span>
      <span style="margin-left:60px ;background: #3cac71;  padding: 3px 10px; margin-right: 8px"></span>
      <span>Изменен</span>
    </div>


    <div v-for="item in groupedItems" :key="item.categoryId" class="inspect-blocks" style="flex-wrap: wrap">
      <div class="insp-list-inner" >
        <p>{{ item.categoryName }}</p>
        <span style=" flex-grow: 1"></span>


        <div v-if="item.groupItems && item.groupItems.length">
          <el-button

            @click="showCategory(item.categoryId)">Информация</el-button>

          <el-button :icon="Select" v-if="item.isAllNormOk" type="success" />
          <el-button type="danger" style="width: 45px" v-if="!item.isAllNormOk">&nbsp; {{item.amount}} &nbsp; </el-button>
        </div> &nbsp; &nbsp;

        <el-button @click="goInspection(item.categoryId)">
          <EditPensilCtrl />
        </el-button>

      </div>


      <AllInspectionInfo ref="allInspectionInfo"
                         :showInspectArr="showInspectArr"
                         :categoryId="item.categoryId"
                         :groupItems="item.groupItems" />
    </div>


    <div class="inspect-blocks" style="display: block">
      <PlannedWork ref="plannedWork" @goInspection="goInspection"  />
    </div>

    <div class="inspect-blocks">
      <p>✱ Сервисные работы</p>
      <el-button @click="goInspection(110)">
        <EditPensilCtrl />
      </el-button>
    </div>

  </div>
</template>

<style>
.insp_time {
  border-radius: 5px;
  background: #d34338;
  color: white;
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px
}
</style>

<script setup lang="ts">
import { useDealStore } from '@/stores/dealStore'
import { ref } from 'vue'
import { formatDMY_hm } from '@/utils/globalFunctions'
import { inspectionItemCategories } from '@/utils/globalConstants'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import PlannedWork from '@/pages/deal/tabs/collapses/inspectionList/PlannedWork.vue'
import router from '@/router'
import AllInspectionInfo from '@/pages/deal/tabs/collapses/inspectionList/AllInspectionInfo.vue'
import { Select } from '@element-plus/icons-vue'

const dealStore = useDealStore()
const inspection = ref({
  createDate: null,
  createdUserLastName: '',
  createdUserFistName: '',
  lastUpdateDate: null,
  lastUpdateUserLastName: '',
  lastUpdateUserFistName: ''
})
const plannedWork = ref(null)
const oldInspectionItems = ref([])
const groupedItems = ref([])
const errorCount = ref([])

let autoId = dealStore.deal.auto.autoId
let dealId = dealStore.deal.dealId
let inspectionId = dealStore.deal.inspectionId
const showInspectArr = ref([])

function showCategory(categoryId: number) {
  let place = showInspectArr.value.indexOf(categoryId)
  if (place > -1) showInspectArr.value.splice(place, 1)
  else showInspectArr.value.push(categoryId)
}

function open() {
  dealStore.getInspectionitem(dealStore.deal.inspectionId).then(res => {
    oldInspectionItems.value = res.items

    dealStore.getInspection(dealStore.deal.inspectionId, false).then(function(data) {
      inspection.value = data
      plannedWork.value.open()
    })

    getByInspection()
  })


  // dealStore.getStatuses(dealStore.deal.dealId).then(res => {
  //   console.log('r   e   s', res)
  // })





}

function getByInspection() {
  console.log('getByInspection:::::::::::::: ')

  dealStore.getByInspection(dealStore.deal.inspectionId).then(function(data) {
    let infoButtons = []
    // подготавливаем группы
    inspectionItemCategories.forEach(n => {
      infoButtons[n.id] = { category: n.id, show: false, mouse_enter: false }
      groupedItems.value.push({
        categoryName: n.name,
        categoryId: n.id,
        isAllNormOk: true,
        amount: 0,
        groupItems: [],
        countChanged: oldInspectionItems.value.filter(item => {
          return item.category == n.id
        }).length
      })

    })

    data.data.items.forEach(item => {
      //ищем есть ли у нас категория из текущего item
      var existingGroup = groupedItems.value.find(itemToFind => {
        return item.inspectionItemCategory == itemToFind.categoryId
      })
      // если категория существует, то кладём в нее item.
      if (existingGroup !== undefined) {
        if (item.inspectionUiType == 10) {
          if (item.isStock) existingGroup.groupItems.push(item)
        } else {
          existingGroup.groupItems.push(item)
        }
      }
      if ((item.inspectionUiType == 30 || item.inspectionUiType == 20) && item.isNorm == false) {
        existingGroup.isAllNormOk = false
        existingGroup.amount += 1
      }
      
      // console.log('existingGroup.amount = ',existingGroup.amount)
    })

    // console.log('groupedItems.value = ',JSON.stringify(groupedItems.value))
  })
}

function goInspection(categoryId: number) {

  if (categoryId == 100) return router.push(`/auto/${autoId}/deal/${dealId}/inspections/${inspectionId}/plainwork`)
  if (categoryId == 110) return router.push(`/deal/${autoId}/servicework`)

  router.push(`/auto/${autoId}/deal/${dealId}/inspection/${inspectionId}/edit-category/${categoryId}`)
}

defineExpose({ open })

</script>
