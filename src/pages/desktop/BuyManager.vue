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
            <el-tab-pane :label="'Новые'" name="10">
              <BuyManagerNotes ref="buyManagerNotes_10"/>
            </el-tab-pane>
            <el-tab-pane :label="'В работе'" name="11">
              <BuyManagerNotes ref="buyManagerNotes_11"/>
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
import AddAppealModal from "@/pages/appeal/AddAppealModal.vue";
import {Plus} from "@element-plus/icons-vue";
import BuyManagerNotes from "@/pages/desktop/modules/BuyManagerNotes.vue";

const globalStore = useGlobalStore()
const desktopStore = useDesktopStore()
const activeName = ref('10')

const addAppealModal = ref(null)
const buyManagerNotes_10 = ref([])
const buyManagerNotes_11 = ref([])


function tabchange(val: number) {
  eval('buyManagerNotes_' + val).value.getNews(val)
}

function init() {
  buyManagerNotes_10.value.getNews(10)
  activeName.value = '10'
}

setTimeout(init)


function addAppeal() {
  addAppealModal.value.open(init)
}


</script>
