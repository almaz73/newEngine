<template>
  <div class="desk-panels">
    <div class="desk-panels-three">
      <div class="three">
        <!--        <br>-->
        <!--        <el-button size="large" :type="dayMode==='day'?'success':'info'" @click="dayMode='day'">День</el-button>-->
        <!--        <el-button size="large" :type="dayMode==='week'?'success':'info'" @click="dayMode='week'">Неделя</el-button>-->
        <!--        <el-button size="large" :type="dayMode==='month'?'success':'info'" @click="dayMode='month'">Месяц</el-button>-->

        <!--        <el-date-picker-->
        <!--            class="little_date_picker"-->
        <!--            style="margin: 0 12px"-->
        <!--            v-model="searchFilter.date"-->
        <!--            format="DD.MM.YYYY"-->
        <!--            value-format="DD.MM.YYYY"-->
        <!--            :clearable="false"-->
        <!--        />-->
        <!--        <br><br>-->

        <div>
          <h3>
            Обращения
          </h3>

          <el-tabs v-model="activeName" @tab-click="tabchange">
            <el-tab-pane :label="'Новые'" name="1">
              <div class="notes" v-for="appeal in appeals_1">
                <small class="date">{{ formatDMY_hm(appeal.createDate) }}</small>
                <div class="red-text">{{ appeal.leadName }}</div>
                <div v-if="appeal.leadPhone">☎: {{ formattingPhone(appeal.leadPhone) }}</div>
                <div v-if="appeal.carBrandModel">🚗 {{ appeal.carBrandModel }}</div>
                <el-button size="small" class="opener" @click="openAppeal(appeal.id)">Открыть</el-button>
              </div>

              <template v-if="total_1>2">
                <el-pagination
                    size="small"
                    v-model:page-size="rowsPerPage_1"
                    :page-sizes="[5, 10, 20, 50]"
                    layout="prev, pager, next, sizes"
                    @current-change="changePage_1"
                    @size-change="changePageSize_1"
                    :total="total_1"
                />
              </template>


            </el-tab-pane>
            <el-tab-pane :label="'В работе'" name="2">

              <div class="notes" v-for="appeal in appeals_2">
                <small class="date">{{ formatDMY_hm(appeal.createDate) }}</small>
                <div class="red-text">{{ appeal.leadName }}</div>
                <div v-if="appeal.leadPhone">☎: {{ formattingPhone(appeal.leadPhone) }}</div>
                <div v-if="appeal.carBrandModel">🚗 {{ appeal.carBrandModel }}</div>
                <el-button size="small" class="opener" @click="openAppeal(appeal.id)">Открыть</el-button>
              </div>

              <template v-if="total_2>2">
                <el-pagination
                    size="small"
                    v-model:page-size="rowsPerPage_2"
                    :page-sizes="[5, 10, 20, 50]"
                    layout="prev, pager, next, sizes"
                    @current-change="changePage_2"
                    @size-change="changePageSize_2"
                    :total="total_2"
                />
              </template>

            </el-tab-pane>
          </el-tabs>

        </div>
        <br><br><br><br>

      </div>

      <div class="three">
        22222
      </div>
      <div class="three">
        33333333333

      </div>
    </div>
  </div>

</template>
<style>

.desk-panels {
  /*background: yellow;*/
  max-width: 1600px;
  margin: 0 auto;
}

.desk-panels div ~ div {
  /*border: 1px solid pink;*/
}

.desk-panels-three {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.desk-panels-three .three {
  min-width: 350px;
  padding: 0 10px;
}

.desk-panels .notes {
  background: #fff;
  box-shadow: 0 2px 3px 2px #c1bdbd;
  padding: 10px;
  margin: 10px 5px;
  position: relative;
  min-height: 30px;

  .date {
    right: 10px;
    position: absolute;
  }

  .opener {
    visibility: hidden;
    right: 10px;
    bottom: 5px;
    position: absolute;
  }
}

.desk-panels .notes:hover .opener {
  visibility: visible;
}

</style>
<script setup lang="ts">
import {ref} from "vue";
import {useDesktopStore} from "@/stores/desktopStore";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDMY_hm, formattingPhone} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const desktopStore = useDesktopStore()
const activeName = ref('1')
const appeals_1 = ref([])
const appeals_2 = ref([])
const rowsPerPage_1 = ref(7)
const rowsPerPage_2 = ref(7)
const total_1 = ref(0)
const total_2 = ref(0)
let filter_1 = {"status": 10, "statuses": [10, 11], limit: 7, offset: 0}
let filter_2 = {"status": 11, "statuses": [10, 11], limit: 7, offset: 0}

function tabchange() {
  console.log('tabchange = ')
  if (!appeals_2.value.length) getNews(11)
}

function changePage_1(val: number) {
  filter_1.offset = (val - 1) * rowsPerPage_1.value
  getNews(10)
}

function changePage_2(val: number) {
  filter_2.offset = (val - 1) * rowsPerPage_2.value
  getNews(11)
}

function changePageSize_1(val: number) {
  rowsPerPage_1.value = val
  filter_1.offset = 0
  filter_1.limit = rowsPerPage_1.value
  getNews(10)
}

function changePageSize_2(val: number) {
  rowsPerPage_2.value = val
  filter_2.offset = 0
  filter_2.limit = rowsPerPage_2.value
  getNews(11)
}


function getNews(val) {
  let filterBoth = (val === 10) ? filter_1 : filter_2
  globalStore.isWaiting = true
  let filter = JSON.stringify({status: filterBoth.status, statuses: filterBoth.statuses})
  desktopStore.getLeadWorkflowsByStatus(filter, filterBoth.limit, filterBoth.offset).then(res => {
    globalStore.isWaiting = false
    if ((val === 10)) {
      appeals_1.value = res.appeals
      total_1.value = res.appealsCount
    } else {
      appeals_2.value = res.appeals
      total_2.value = res.appealsCount
    }
  })
}

getNews(10)

function openAppeal(id: number) {
  // router.push({path: '/appeal/' + id})
  // window.open
  window.open('/v2/appeal/' + id)
}

// console.log('getLeadWorkflowsByStatus = ',getLeadWorkflowsByStatus)

</script>
