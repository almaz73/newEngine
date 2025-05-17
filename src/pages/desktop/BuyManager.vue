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
            <el-button style="float: right"
                       title="Добавить новое обращение"
                       size="small" @click="addAppeal()" :icon="Plus"/>
          </h3>

          <el-tabs v-model="activeName" @tab-change="tabchange">
            <el-tab-pane :label="'Новые '+note_10" name="10">
              <BuyManagerNotes ref="buyManagerNotes_10" @returnNoteCount="returnNoteCount"/>
            </el-tab-pane>
            <el-tab-pane :label="'В работе '+note_11" name="11">
              <BuyManagerNotes ref="buyManagerNotes_11" @returnNoteCount="returnNoteCount"/>
            </el-tab-pane>
          </el-tabs>

        </div>
        <br><br><br><br>

      </div>

      <div class="three">
        <h3>
          События
        </h3>

        <el-tabs v-model="activeEventName" @tab-change="tabcEventshange">
          <el-tab-pane :label="'Просроченные '+event_20" name="20">
            <BuyManagerEvents ref="buyManagerEvents_20" @returnEventCount="returnEventCount"/>
          </el-tab-pane>
          <el-tab-pane :label="'Сегодня '+event_10" name="10">
            <BuyManagerEvents ref="buyManagerEvents_10" @returnEventCount="returnEventCount"/>
          </el-tab-pane>
          <el-tab-pane :label="'Все '+event_30" name="30">
            <BuyManagerEvents ref="buyManagerEvents_30" @returnEventCount="returnEventCount"/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="three">
        33333333333

      </div>
    </div>
  </div>

  <AddAppealModal ref="addAppealModal"/>
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
  /*max-width: 350px;*/
  background: #fff;
  box-shadow: 0 2px 3px 2px #c1bdbd;
  padding: 10px;
  margin: 10px 5px;
  position: relative;
  min-height: 30px;
}

.desk-panels .notes .date {
  right: 10px;
  position: absolute;
}

.desk-panels .notes .opener {
  visibility: hidden;
  right: 10px;
  bottom: 5px;
  position: absolute;
}

.desk-panels .notes:hover .opener {
  visibility: visible;
}

</style>
<script setup lang="ts">
import {ref} from "vue";
import {useDesktopStore} from "@/stores/desktopStore";
import {useGlobalStore} from "@/stores/globalStore";
import AddAppealModal from "@/pages/appeal/AddAppealModal.vue";
import {Plus} from "@element-plus/icons-vue";
import BuyManagerNotes from "@/pages/desktop/modules/BuyManagerNotes.vue";
import BuyManagerEvents from "@/pages/desktop/modules/BuyManagerEvents.vue";

const globalStore = useGlobalStore()
const desktopStore = useDesktopStore()
const activeName = ref('10')
const activeEventName = ref('10')
const addAppealModal = ref(null)
const buyManagerNotes_10 = ref([])
const buyManagerNotes_11 = ref([])
const note_10 = ref('')
const note_11 = ref('')
const buyManagerEvents_20 = ref(null)
const buyManagerEvents_10 = ref(null)
const buyManagerEvents_30 = ref(null)
const event_20 = ref('')
const event_10 = ref('')
const event_30 = ref('')


function tabchange(val: number) {
  eval('buyManagerNotes_' + val).value.getNews(val)
}

function tabcEventshange(val: number) {
  eval('buyManagerEvents_' + val).value.getNews(val)
}

function returnNoteCount(val: { type: number, value: number }) {
  eval('note_' + val.type).value = val.value
}

function returnEventCount(val: { type: number, value: number }[]) {
  val.forEach(el => eval('event_' + el.type).value = el.value)
}

function init() {
  buyManagerNotes_10.value.getNews(10)
  buyManagerEvents_10.value.getNews(10)
  activeName.value = '10'
}

setTimeout(init)


function addAppeal() {
  addAppealModal.value.open(init)
}


</script>
