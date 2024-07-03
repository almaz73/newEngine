<template>
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
      <span class="label-red ">Место выкупа:</span> {{ appeal.locationName }} ({{ appeal.city }})
    </span>
    <span class="nowrap" v-if="appeal.buyCategoryTitle">
      <span class="label-red ">Вид выкупа:</span> {{ appeal.buyCategoryTitle }}
    </span>
    <span class="nowrap" v-if="appeal.workflowLeadType">
      <span class="label-red ">Тип обращения: </span>{{ workFlowType(appeal.workflowLeadType) }} &nbsp;
    </span>
    <span class="nowrap" v-if="appeal.tradeInDirectionTypeTitle">
          <span class="label-red">
            Тип направления: {{ appeal.tradeInDirectionTypeTitle }}
          </span>
        </span>
    <span class="nowrap">
          <span class="label-red ">Источник:</span> {{ appeal.treatmentSourceTitle }}
        </span>
  </small>

  <br>

  <div class="big-collapse">
    <el-collapse>
      <el-collapse-item :title="'&nbsp; Клиент: &nbsp; '+appeal.leadName+' &nbsp; ☎: '+formattingPhone(appeal.leadPhone)"
                        name="1">
        <div class="collapse" style="">
          <div class="collapse-left">

            <div><span class="label">Тип клиента: </span>
              <span v-if="appeal.lead && appeal.lead.leadType===10">Физическое лицо</span>
              <span v-if="appeal.lead && appeal.lead.leadType===20">Юридическое лицо</span>
              &nbsp; <img src="@/assets/icons/icon-pencil-gray.png" alt="" @click="openClient()"
                          style="cursor: pointer">
            </div>
            <div><span class="label">Статус клиента: </span> {{ appeal.clientStatus }}</div>
            <div v-if="appeal.leadName"><span class="label">ФИО:</span>
              {{ appeal.lead.person && appeal.lead.person.firstName }}
              {{ appeal.lead.person && appeal.lead.person.middleName }}
              {{ appeal.lead.person && appeal.lead.person.lastName }}
              &nbsp;

              <img src="@/assets/icons/icon-pencil-gray.png" alt="" @click="openClient()"
                   style="cursor: pointer">
            </div>

            <div v-if="appeal.leadPhone"><span class="label">Номер телефона: </span>
              {{ formattingPhone(appeal.leadPhone) }}
            </div>
            <div v-if="appeal.swapPhone">Подменный номер телефона: {{ appeal.swapPhone }}</div>
            <div v-if="appeal.lead && appeal.lead.person && appeal.lead.person.phone2"><span class="label">
              Доп. телефон: </span> {{ appeal.lead && appeal.lead.person && appeal.lead.person.phone2 }}
            </div>
            <div v-if="appeal.email"><span class="label">Эл. почта: </span> {{ appeal.email }}</div>
            <div v-if="appeal.leadSourceTitle"><span class="label">Источник:</span> {{ appeal.leadSourceTitle }}</div>

          </div>
          <div class="collapse-right" v-if="appeal.lead && appeal.lead.person">
            <div><span class="label">День рождения:</span> {{ formatDateDDMMYYYY(appeal.lead.person.dateOfBirth) }}
            </div>
            <div><span class="label">Пол:</span>
              {{ appeal.lead.person.gender === 10 ? 'муж.' : '' }}
              {{ appeal.lead.person.gender === 20 ? 'жен.' : '' }}
            </div>
            <div><span class="label">Место проживания:</span>
              {{ appeal.lead.person.homeAddress.fiasAddress && appeal.lead.person.homeAddress.fiasAddress.value }}
            </div>
            <div><span class="label">Место регистрации:</span> {{
                appeal.lead.person.registrationAddress.fiasAddress && appeal.lead.person.registrationAddress.fiasAddress.value
              }}
            </div>
            <br> <a @click="infoAboutClient.open(appeal)" style="float: right">Более подробно о клиенте ➣ ➣ ➣</a>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item :title="'&nbsp; Автомобиль'+(appeal.carBrandModel?': &nbsp; '+appeal.carBrandModel:'')"
                        name="2">
        <div style="padding: 0 30px">
          <span v-if="appeal.carModel"><span class="label">
            Модель:</span>   {{ appeal.carBrandModel }} &nbsp;
            <img src="@/assets/icons/icon-pencil-gray.png" alt=""
                 title="Данные со слов клиента"
                 @click="editCar()"
                 style="cursor: pointer; margin: 0 12px">

            <RouterLink :to="`/auto/deal/add/clientId/${appeal.leadId}/parentId/${appeal.id}`">
              <el-button :icon="Edit">Оформление байером </el-button>
            </RouterLink>
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
  <InfoAboutClientModal ref="infoAboutClient"/>
  <ClientsDirModal ref="сlientModal"/>
  <EditCarModal ref="carModal"/>
  <EditCarBayerModal ref="editCarBayerModal"/>
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
import AppealTabs from "@/components/appalCtrl/AppealTabs.vue";
import {formatDateDDMMYYYY, formatDMY_hm, formattingPhone} from "@/utils/globalFunctions";
import InfoAboutClientModal from "@/components/appalCtrl/InfoAboutClientModal.vue";
import ClientsDirModal from "@/pages/admin/dirs/ClientsDirModal.vue";
import EditCarModal from "@/components/appalCtrl/EditCarModal.vue";
import MResponsible from "@/pages/appeal/appealEditFields/MResponsible.vue";
import MStatus from "@/pages/appeal/appealEditFields/status/MStatus.vue";
import EditCarBayerModal from "@/components/appalCtrl/EditCarBayerModal.vue";
import {Edit} from "@element-plus/icons-vue";

const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const isOpen = ref(false);
const appeal = ref({});
const carPhoto = ref(null)
const appealTabs = ref(null)
const lastTaskAndResult = ref('')
const prevTask = ref('')
const events = ref([])
const infoAboutClient = ref(null)
const сlientModal = ref(null)
const carModal = ref(null)
const editCarBayerModal = ref(null)

function workFlowType(type) {
  let el = appeal.value.workflowLeadType && Workflows.find(el => el.id === type)
  return el && el.title
}


function openClient() {
  сlientModal.value.open(appeal.value)
}

function editCar() {
  if (globalStore.account.role === 'BuyerEmployee') editCarBayerModal.value.open(appeal.value)
  else carModal.value.open(appeal.value)
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
  globalStore.setTitle(appeal.value.id + '- Обращение. ' + ' ' + appeal.value.workflowLeadTypeTitle)
  globalStore.steps = [{name: 'Обращение', done: true},
    {name: 'Сбор данных', done: true}, {name: 'Оценка'}, {name: 'Договор'}, {name: 'Банк'}, {name: 'Выкуп'}]
}

defineExpose({open})

</script>