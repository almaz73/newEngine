﻿<template>
  <div style="display: flex; align-items: center; flex-wrap: wrap">
    <div class="appealStat">
      <MStatus :appeal="appeal"/>

      <mResponsible :appeal="appeal"/>
      <br>
    </div>

    <div class="appealStatRight">
      <small>
        <div class="label-red ">Результаты и действия:</div>
        <!--              <div v-if="lastTaskAndResult">⚡{{ lastTaskAndResult }}</div>-->
        <div v-if="lastTaskAndResult" v-html="lastTaskAndResult"/>
        <div>⚡{{ prevTask }}</div>
      </small>
    </div>
  </div>
  <br>

  <small style="display: flex; flex-wrap: wrap; gap: 8px">
    <span class="nowrap" v-if="appeal.locationName">
      <span class="label-red ">Место выкупа:</span>
      <span class="bigger">{{ appeal.locationName }} ({{ appeal.city }})</span>
    </span>
    <span class="nowrap" v-if="appeal.buyCategoryTitle">
      <span class="label-red ">Вид выкупа:</span>
      <span class="bigger">{{ appeal.buyCategoryTitle }}</span>
    </span>
    <span class="nowrap" v-if="appeal.workflowLeadType">
      <span class="label-red ">Тип обращения: </span>
      <span class="bigger">{{ workFlowType(appeal.workflowLeadType) }} &nbsp;</span>
    </span>
    <span class="nowrap" v-if="appeal.tradeInDirectionTypeTitle">
          <span class="label-red"> Тип направления:</span>
          <span class="bigger">{{ appeal.tradeInDirectionTypeTitle }}</span>
    </span>
    <span class="nowrap">
          <span class="label-red ">Источник:</span>
          <span class="bigger">{{ appeal.treatmentSourceTitle }}</span>
    </span>
  </small>

  <br>

  <div class="big-collapse">
    <el-collapse>
      <el-collapse-item
          :title="'&nbsp; Клиент: &nbsp; '+appeal.leadName+' &nbsp; ☎: '+formattingPhone(appeal.leadPhone)"
          name="1">
        <div class="collapse" style="">
          <div class="collapse-left">

            <div>
              <span class="label">Вид выкупа </span>
              <div v-if="!isTypeClientEdit" style="display: inline-block">
                <span
                    v-if="appeal.lead"> {{
                    appeal.lead.leadType === 10 ? 'Физическое лицо' : 'Юридическое лицо'
                  }}</span>
                &nbsp;
                <EditPensilCtrl @click="isTypeClientEdit=true"/>
              </div>
              <el-select
                  v-if="isTypeClientEdit"
                  style="width: 180px"
                  placeholder="Выберите тип клиента"
                  v-model="appeal.lead.leadType"
                  @change="changeTypeClient()"
                  filterable>
                <el-option v-for="item in [{id:10, title:'Физическое лицо'},{id:20, title:'Юридическое лицо'}]"
                           :key="item.id" :label="item.title" :value="item.id"/>
              </el-select>
            </div>
            <div><span class="label">Статус клиента: </span> {{ appeal.clientStatus }}</div>

            <div v-if="appeal.leadName && appeal.lead.person"><span class="label">ФИО:</span>
              <!--физическое лицо-->
              {{ appeal.lead.person.firstName }}
              {{ appeal.lead.person.middleName }}
              {{ appeal.lead.person.lastName }}
              &nbsp;
              <EditPensilCtrl @click="openClient()"/>
            </div>

            <div v-if="appeal.leadName && appeal.lead.legalEntity"><span class="label">ФИО:</span>
              <!--Юридическое лицо-->
              {{ appeal.lead.legalEntity.person.firstName }}
              {{ appeal.lead.legalEntity.person.middleName }}
              {{ appeal.lead.legalEntity.person.lastName }}
              &nbsp;
              <EditPensilCtrl @click="openLegal()"/>
            </div>

            <div v-if="appeal.leadPhone"><span class="label">Номер телефона: </span>
              {{ formattingPhone(appeal.leadPhone) }}
            </div>
            <div v-if="appeal.swapPhone">
              <span class="label l_200">Подменный номер телефона ☎:</span>
              <a title=". . . загрузка истории изменений"
                 @click="openSwapHist(true, true)"
                 @mouseover="openSwapHist(true)"
                 @mouseleave="openSwapHist()">
                {{ formattingPhone(appeal.swapPhone) }}
              </a>

            </div>
            <div v-if="appeal.lead && appeal.lead.person && appeal.lead.person.phone2"><span class="label">
              Доп. телефон: </span> {{ appeal.lead && appeal.lead.person && appeal.lead.person.phone2 }}
            </div>
            <div v-if="appeal.email"><span class="label">Эл. почта: </span> {{ appeal.email }}</div>
            <div v-if="appeal.leadSourceTitle"><span class="label">Источник:</span> {{ appeal.leadSourceTitle }}</div>

          </div>
          <div class="collapse-right" v-if="appeal.lead && appeal.lead.person">
            <div v-if="appeal.lead.person.dateOfBirth">
              <span class="label">День рождения:</span> {{ formatDateDDMMYYYY(appeal.lead.person.dateOfBirth) }}
            </div>
            <div v-if="appeal.lead.person.gender">
              <span class="label">Пол:</span>
              {{ appeal.lead.person.gender === 10 ? 'муж.' : '' }}
              {{ appeal.lead.person.gender === 20 ? 'жен.' : '' }}
            </div>
            <div v-if="appeal.lead.person.homeAddress.fiasAddress?.value">
              <span class="label">Место проживания:</span>
              {{appeal.lead.person.homeAddress.fiasAddress?.value }}
            </div>
            <div v-if="appeal.lead.person.registrationAddress.fiasAddress?.value">
              <span class="label">Место регистрации:</span> {{
                appeal.lead.person.registrationAddress.fiasAddress?.value
              }}
            </div>

            <div v-if="communicationLink"><span class="label">Коммуникация:</span>
              <span  style="width: 200px; overflow: hidden;display: inline-grid">
                <a :href="communicationLink" target="_blank"> {{ communicationLink }} </a>
              </span>
            </div>
          </div>
        </div>
        <br>
      </el-collapse-item>
      <el-collapse-item :title="'&nbsp; Автомобиль'+(appeal.carBrandModel?': &nbsp; '+appeal.carBrandModel:'')"
                        name="2">
        <div style="padding: 0 30px">
          <span v-if="appeal.carModel"><span class="label">
            Модель:</span>   {{ appeal.carBrandModel }} &nbsp;

            <span style="float: inline-end">
              <RouterLink :to="`/auto/deal/add/clientId/${appeal.leadId}/parentId/${appeal.id}`"
                          v-if="permit_locale() && !appeal.auto">
                <el-button :icon="Edit" size="small">Оценивать </el-button>
              </RouterLink>

              <RouterLink :to="`/auto/${appeal.autoId}/deal/${appeal.deal.id}`"
                           v-if="permit_locale() && appeal.auto && appeal.deal && appeal.auto.vin">
                <el-button :icon="Edit" size="small">Автомобиль на стадии оценки</el-button>
              </RouterLink>
            </span>
          <br></span>

          <span class="label" v-if="appeal.yearReleased">  Год: </span>{{ appeal.yearReleased }}
          <span class="label" v-if="appeal.mileageAuto">  Пробег: </span>{{ appeal.mileageAuto }}


          <span class="label" v-if="appeal.deal && appeal.deal.dealStatus"> Статус: </span>
          {{ appeal && appeal.deal && statuses.find(el => el.id === appeal.deal.dealStatus).name }}
          <br>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>

  <el-divider/>

  <AppealTabs ref="appealTabs" :carPhoto="carPhoto"/>
  <ClientsDirModal ref="clientsDirModal"/>
  <SwapPhoneHistoryModal ref="swapPhoneHistoryModal"/>
  <ClientsDirLegalModal ref="clientsDirLegalModal"/>
</template>

<style>
.appealStat {
  width: 40%;
  white-space: nowrap
}

.appealStatRight {
  border-left: 5px solid #d34338;
  padding-left: 20px;
  width: 50%
}

@media (width < 500px) {
  .appealStatRight {
    width: initial;
    margin: 12px 0;
  }
}
</style>

<script setup>

import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {statuses, Workflows} from "@/utils/globalConstants";
import AppealTabs from "@/pages/appeal/controls/AppealTabs.vue";
import {formatDateDDMMYYYY, formatDMY_hm, formattingPhone} from "@/utils/globalFunctions";
import ClientsDirModal from "@/pages/admin/dirs/ClientsDirModal.vue";
import MResponsible from "@/pages/appeal/appealEditFields/MResponsible.vue";
import MStatus from "@/pages/appeal/appealEditFields/status/MStatus.vue";
import {Edit} from "@element-plus/icons-vue";
import EditPensilCtrl from '@/controls/EditPensilCtrl.vue'
import {ElMessageBox} from 'element-plus'
import SwapPhoneHistoryModal from "@/pages/appeal/controls/SwapPhoneHistoryModal.vue";
import ClientsDirLegalModal from '@/pages/admin/dirs/ClientsDirLegalModal.vue'

const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const isOpen = ref(false);
const appeal = ref({});
const carPhoto = ref(null)
const appealTabs = ref(null)
const lastTaskAndResult = ref('')
const prevTask = ref('')
const events = ref([])
const clientsDirModal = ref(null)
const clientsDirLegalModal = ref(null)
const isTypeClientEdit = ref(false)
const swapPhoneHistoryModal = ref(null)
const communicationLink = ref('')
let timerSwap = null
let openSwapmodal = function () {
  swapPhoneHistoryModal.value.open(appeal.value.id)
}

function openSwapHist(val, fast) {
  clearTimeout(timerSwap)
  if (fast) openSwapmodal()
  if (!val) return false;
  timerSwap = setTimeout(openSwapmodal, 1500)
}

function changeTypeClient() {
  ElMessageBox.confirm('Вы действительно хотите изменить тип клиента?', 'Внимание', {
    confirmButtonText: 'Да',
    cancelButtonText: 'Нет'
  })
      .then(res => {
        // router.push('/client/legal/add') в отдельной странице добавить клиента
        clientsDirLegalModal.value.open()
      }, () => {
        appeal.value.lead.leadType = appeal.value.lead.leadType === 10 ? 20 : 10
        isTypeClientEdit.value = false
      })

}

function permit_locale() {
  return ['BuyerEmployee', 'Admin'].includes(globalStore.account.role)
}

function workFlowType(type) {
  let el = appeal.value.workflowLeadType && Workflows.find(el => el.id === type)
  return el && el.title
}


function openClient() {
  appeal.value && clientsDirModal.value.open(appeal.value.leadId)
}

function openLegal() {
  // нужно открыть на редактирование юридическое лицо
}

function open(row) {
  if (row.smallPhoto) carPhoto.value = row.smallPhoto[0]
  isOpen.value = true;
  appealStore.getAppeal(row.id).then(res => {
    appeal.value = res
    getEvents()
    appealTabs.value.open(res)
    init()
  })


}

function getEvents() {
  lastTaskAndResult.value = ''
  prevTask.value = ''
  appealStore.getEvents(appeal.value.id).then(res => {
    events.value = res.items
    let last = events.value[0];
    let result = events.value[1];
    let endPhrase = ' завершено в ';
    switch (result && result.type) {
      case 1:
        endPhrase = ' завершен в ';
        break;
      case 2:
      case 120:
        endPhrase = ' завершена в ';
        break;
    }


    if (result) {
      lastTaskAndResult.value = '⚡' + result.typeTitle + endPhrase
          + formatDMY_hm(last.createDate) +
          (result.comment ? ' с результатом: <b>' + result.comment : '</b>');
    }

    prevTask.value = 'Следующее действие: ' + events.value[0].typeTitle + ' на ' + formatDMY_hm(events.value[0].dateStart)
  })
}

function init() {
  globalStore.setTitle(appeal.value.id + ' - Обращение. ' + ' ' + appeal.value.workflowLeadTypeTitle)
  globalStore.steps = [{title: 'Обращение', done: true}]
  console.log('appeal.id = ',appeal.value.id)
  appealStore.getCommunication(appeal.value.id).then(res=>{
    console.log('res = ',res)
    communicationLink.value = res.description
  })
}

defineExpose({open})

</script>