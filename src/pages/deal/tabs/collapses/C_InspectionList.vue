<template>

  <div v-if="inspection">
    <div class="insp_time">
      <span v-if="inspection.createDate">{{ formatDMY_hm(inspection.createDate) }}</span>
      <br/>
      {{ inspection.createdUserLastName }} {{ inspection.createdUserFistName }}
    </div>

    <div class="insp_time" style="background: #3cac71">
      <span v-if="inspection.lastUpdateDate">{{ formatDMY_hm(inspection.lastUpdateDate) }}</span>
      <br/>
      {{ inspection.lastUpdateUserLastName }} {{ inspection.lastUpdateUserFistName }}
    </div>


    <div style="margin-top: 12px">
      <span style="background: #d34338;  padding: 3px 10px; margin-right: 8px"></span> <span>Создан</span>
      <span style="margin-left:60px ;background: #3cac71;  padding: 3px 10px; margin-right: 8px"></span>
      <span>Изменен</span>
    </div>


    <div v-for="item in groupedItems" :key="item.categoryId" class="inspect-blocks" style="flex-wrap: wrap">
      <div class="insp-list-inner">
        <p>{{ item.categoryName }}</p>
        <span style=" flex-grow: 1"></span>



        <div v-if="item.groupItems && item.groupItems.length">
          <el-button @click="showCategory(item.categoryId)">Информация</el-button>

          <el-button v-if="item.countChanged" @click="getChangedItems(item.categoryId)">
            История изменений ({{ item.countChanged }})
          </el-button> &nbsp; &nbsp;

          <el-button :icon="Select" type="success"
                     v-if="item.groupItems.length > 0 && ![10, 20, 80].includes(item.categoryId) && item.isAllNormOk "/>
          <el-button type="danger" style="width: 45px"
                     @click="showDemages(item.categoryId)"
                     v-if="!item.isAllNormOk">&nbsp; {{ item.amount }} &nbsp;
          </el-button>
        </div> &nbsp; &nbsp;


        <el-button @click="goInspection(item.categoryId)">
          <EditPensilCtrl/>
        </el-button>


      </div>


      <AllInspectionInfo
          :showInspectArr="showInspectArr"
          :categoryId="item.categoryId"
          :groupItems="item.groupItems"/>

      <AllInspectionDamages
          :showDamagesArr="showDamagesArr"
          :categoryId="item.categoryId"
          :groupItems="item.groupItems"/>

      <el-table
          v-if="tableDatasShow[item.categoryId]"
          :data="tableDatas[item.categoryId]"
          highlight-current-row
      >
        <el-table-column prop="name" label="ФИО">
          <template #default="scope">
            {{ scope.row.lastName }} {{ scope.row.firstName }} {{ scope.row.middleName }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Дата" width="100">
          <template #default="scope">
            {{ formatDMY_hm(scope.row.createdDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Элемент" width="160px"/>
        <el-table-column prop="comment" label="" width="40px">
          <template #default="scope">
            <!--            <el-checkbox v-if="scope.row.inspectionUiType === 10" v-model="scope.row.isStock"/>-->
            <div v-if="scope.row.inspectionUiType === 10">
              <el-icon v-if="scope.row.isStock" style="color: darkgreen"><Select/></el-icon>
              <el-icon v-if="!scope.row.isStock" style="color: darkred">
                <CloseBold/>
              </el-icon>
            </div>

            <div v-if="[20, 30].includes(scope.row.inspectionUiType)">
              <el-icon v-if="scope.row.isNorm" style="color: darkgreen"><Select/></el-icon>
              <el-icon v-if="!scope.row.isNorm" style="color: darkred">
                <CloseBold/>
              </el-icon>
              <el-icon v-if="scope.row.isRepaired" title="Отремонтирован" style="color: darkred">
                <Setting/>
              </el-icon>
            </div>


          </template>
        </el-table-column>
        <el-table-column prop="comment" label="Комментарий" width="150">
          <template #default="scope">

            <div v-if="scope.row.inspectionUiType === 10">
              <span v-if="scope.row.isStock">Присутствует</span>
              <span v-else>Отсутствует</span>
            </div>

            <div v-if="scope.row.inspectionUiType === 20 || scope.row.inspectionUiType === 30">
              <div v-if="scope.row.isNorm === false">
                <p>Повреждения: {{ scope.row.damageText }}</p>
                <UploadPhoto v-if="scope.row.photos[0]" :url="scope.row.photos[0].photoPath" :noEdit="true"/>
                <UploadPhoto v-if="scope.row.photos[1]" :url="scope.row.photos[1].photoPath" :noEdit="true"/>
              </div>

              <p v-if="scope.row.isNorm">Норма</p>
              <p v-if="scope.row.isRepaired">Ранний ремонт</p>
              <p v-if="!scope.row.isRepaired">Ранее не ремонтировалось</p>
            </div>

            <div v-if="scope.row.inspectionUiType === 40">
              <el-icon v-if="scope.row.isRequired" style="color: darkgreen"><Select/></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Вложенные файлы" width="110">
          <template #default="scope">
            <div v-for="file in scope.row.documents">
              <a @click="openFile(file)">{{ file.title }}</a>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>


    <div class="inspect-blocks" style="display: block">
      <PlannedWork ref="plannedWork" @goInspection="goInspection"/>
    </div>

    <div class="inspect-blocks">
      <p>✱ Сервисные работы</p>
      <el-button @click="goInspection(110)">
        <EditPensilCtrl/>
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
import {useDealStore} from '@/stores/dealStore'
import {onMounted, ref} from 'vue'
import {formatDMY_hm} from '@/utils/globalFunctions'
import {inspectionItemCategories} from '@/utils/globalConstants'
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import PlannedWork from '@/pages/deal/tabs/collapses/inspectionList/PlannedWork.vue'
import router from '@/router'
import AllInspectionInfo from '@/pages/deal/tabs/collapses/inspectionList/AllInspectionInfo.vue'
import {CloseBold, Select, Setting} from '@element-plus/icons-vue'
import {useGlobalStore} from "@/stores/globalStore";
import UploadPhoto from '@/components/UploadPhoto.vue'
import AllInspectionDamages from '@/pages/deal/tabs/collapses/inspectionList/AllInspectionDamages.vue'
import {useRoute} from 'vue-router'

const route = useRoute()
const globalStore = useGlobalStore()
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
const tableDatas = ref({})
const tableDatasShow = ref({})

let autoId = dealStore.deal.auto ? dealStore.deal.auto.autoId : null
let dealId = dealStore.deal.dealId
let inspectionId = dealStore.deal.inspectionId
const showInspectArr = ref([])
const showDamagesArr = ref([])

function open() {
  dealStore.getInspectionitem(dealStore.deal.inspectionId).then(res => {
    oldInspectionItems.value = res.items

    dealStore.getInspection(dealStore.deal.inspectionId, false).then(function (data) {
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
  dealStore.getByInspection(dealStore.deal.inspectionId).then(function (data) {
    let infoButtons = []
    // подготавливаем группы
    inspectionItemCategories.forEach(n => {
      infoButtons[n.id] = {category: n.id, show: false, mouse_enter: false}
      groupedItems.value.push({
        categoryName: n.name,
        categoryId: n.id,
        isAllNormOk: true,
        amount: 0,
        groupItems: [],
        countChanged: oldInspectionItems.value.filter(item => {
          return item.category === n.id
        }).length
      })

    })

    data.data.items.forEach(item => {
      //ищем есть ли у нас категория из текущего item
      var existingGroup = groupedItems.value.find(itemToFind => {
        return item.inspectionItemCategory === itemToFind.categoryId
      })
      // если категория существует, то кладём в нее item.
      if (existingGroup !== undefined) {
        if (item.inspectionUiType === 10) {
          if (item.isStock) existingGroup.groupItems.push(item)
        } else {
          existingGroup.groupItems.push(item)
        }
      }
      if ((item.inspectionUiType === 30 || item.inspectionUiType === 20) && item.isNorm === false) {
        existingGroup.isAllNormOk = false
        existingGroup.amount += 1
      }

    })

  })
}

function goInspection(categoryId: number) {

  if (categoryId === 100) return router.push(`/auto/${autoId}/deal/${dealId}/inspections/${inspectionId}/plainwork`)
  if (categoryId === 110) return router.push(`/deal/${autoId}/servicework`)

  router.push(`/auto/${autoId}/deal/${dealId}/inspection/${inspectionId}/edit-category/${categoryId}`)
}

function showCategory(categoryId: number) {
  let place = showInspectArr.value.indexOf(categoryId)
  if (place > -1) showInspectArr.value.splice(place, 1)
  else showInspectArr.value.push(categoryId)
}

function showDemages(categoryId: number) {
  let place = showDamagesArr.value.indexOf(categoryId)
  if (place > -1) showDamagesArr.value.splice(place, 1)
  else showDamagesArr.value.push(categoryId)
}

function getChangedItems(category: number) {
  tableDatasShow.value[category] = !tableDatasShow.value[category]
  globalStore.isWaiting = true
  dealStore.getChangedItems(dealStore.deal.inspectionId, category).then(res => {
    tableDatas.value[category] = res.items
    globalStore.isWaiting = false
  })
}

function openFile(file: any) {
  let fileUrl = `/api/file/${file.documentId}`
  window.open(fileUrl)
}

defineExpose({open})

onMounted(() => {
  // Если зашли на лист осмотра по ссылке, и неизвестно id pзагружаем дополнительно
  if (document.location.pathname.includes('inspection')) {
    globalStore.setTitle('Лист осмотра')
    if (!dealStore.deal.inspectionId) {
      dealStore.getDeal(dealId).then(res => {
        dealStore.deal = res
        globalStore.steps = dealStore.deal.workflowsChain
        open()
      })
    } else {
      globalStore.steps = dealStore.deal.workflowsChain
      open()
    }
  }
})

</script>
