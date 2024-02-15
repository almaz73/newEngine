<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 900"
            :top="40"
            :title="'Обращение '+appeal.id+'. '+appeal.workflowLeadTypeTitle"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <div>
        <small class="label-right">Статус</small>

        <el-dropdown style="margin-bottom: 4px">
          <el-button type="primary">
            {{ appeal.statusTitle }}

          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  @click="clickDropDown(item)"
                  v-for="(item, ind) in AppealStatusTypes" :key="ind">{{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </div>

      <div>
        <small class="label-right" v-if="appeal.workflowLeadType === 1">Продавец</small>
        <small class="label-right" v-if="appeal.workflowLeadType === 2">Выкупщик</small>
        <small class="label-right" v-if="![1,2].includes(appeal.workflowLeadType)">Ответственный</small>

        <span v-if="!isEditManagerName">
          <small v-if="appeal.managerName">{{ appeal.managerName }}</small>
          <small v-if="!appeal.managerName">Прикрепить менеджера</small>
          &nbsp; <img src="@/assets/icons/icon-pencil-gray.png" alt=""
                      @click="toGetManagers()"
                      style="cursor: pointer">
        </span>
        <span v-else>
          <el-select v-model="appeal.managerId" @change="toChangeManager">
            <el-option v-for="item in responsibles" :key="item.id" :label="item.title" :value="item.id"/>
          </el-select>
        </span>
      </div>
      <br>

      <small style="display: flex; flex-wrap: wrap; gap: 8px">
        <span class="nowrap">
          <span class="label-red ">Вид выкупа:</span> {{ appeal.buyCategoryTitle }}
        </span>
        <span class="nowrap">
          <span class="label-red ">Тип обращения: </span>{{ workFlowType(appeal.workflowLeadType) }} &nbsp;
        </span>
        <span class="nowrap">
          <span class="label-red" v-if="appeal.tradeInDirectionTypeTitle">
            Тип направления: {{ appeal.tradeInDirectionTypeTitle }}
          </span>
        </span>
        <span class="nowrap">
          <span class="label-red ">Источник:</span> {{ appeal.treatmentSourceTitle }}
        </span>
      </small>

      <br>

      <div class="demo-collapse">
        <el-collapse @change="openCollapse">
          <el-collapse-item :title="'&nbsp; Клиент: &nbsp; '+appeal.leadName+' &nbsp; ☎:'+appeal.leadPhone" name="1">
            <div class="carusel" style="">
              <div class="carusel-left">

                <span> Статус клиента: {{ appeal.clientStatus }}<br></span>
                <span v-if="appeal.leadName">Фио:   {{ appeal.leadName }}
                  &nbsp;
                  <img src="@/assets/icons/icon-pencil-gray.png" alt=""
                       @click="()=>{}" style="cursor: pointer">
                  <br></span>
                <span v-if="appeal.leadPhone">Номер телефона:   {{ appeal.leadPhone }}<br></span>
                <span v-if="appeal.swapPhone">Подменный номер телефона:   {{ appeal.swapPhone }}<br></span>
                <span v-if="appeal.lead && appeal.lead.person.phone2">
                  Доп. телефон:   {{ appeal.lead.person.phone2 }}<br></span>
                <span v-if="appeal.email">Эл. почта:   {{ appeal.email }}<br></span>
                <span v-if="appeal.leadSourceTitle">Источник: {{ appeal.leadSourceTitle }}<br></span>
                <br>
              </div>
              <div class="carusel-right">
                <el-button size="small" @click="smsSender.open()">Создать СМС-сообщение клиенту</el-button>
                <SmsSender ref="smsSender" :appealId="appeal.id"/>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item :title="'&nbsp; Автомобиль: &nbsp; '+appeal.carBrandModel" name="2">
            <div style="padding: 0 30px">
              <span v-if="appeal.brand">Бренд:   {{ appeal.brand }}
                 &nbsp; <img src="@/assets/icons/icon-pencil-gray.png" alt=""
                             @click="()=>{}"
                             style="cursor: pointer">
                <br>
              </span>
              <span v-if="appeal.carModel">Модель:   {{ appeal.carModel }}<br></span>

              <span v-if="appeal.auto && appeal.auto.bodyColorName">
                Цвет: {{ appeal.auto.bodyColorName }}<br></span>
              <span v-if="appeal.auto && appeal.auto.certificateNumber">
                Гос.номер: {{ appeal.auto.certificateNumber }}<br></span>
              <span v-if="appeal.auto && appeal.auto.vin">
                VIN номер: {{ appeal.auto.vin }}<br></span>


            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <el-divider/>

      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="События" name="first">


          <el-table :data="events"
                    highlight-current-row
                    :size="'small'">
            <!--              <el-table-column>-->
            <!--                <template #default="scope">-->
            <!--                  <span style="">{{ scope.row.action }}: <b>{{ scope.row.comment }}</b></span>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <el-table-column prop="title"/>
            <el-table-column prop="dateStart"/>
            <el-table-column prop="person.lastName"/>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="СМС">
          <el-scrollbar maxHeight="180px">
            <div v-for="sms in listSMS" :key="sms.id" class="carusel-blocks">
              <span class="label-red label-right">Текст:</span> {{ sms.smsText }}<br>
              <span class="label-red label-right">Дата:</span> {{ formatDMY_hm(sms.sendDate) }}<br>
              <span class="label-red label-right">Статус:</span> {{ sms.statusText }}<br>
              <span class="label-red label-right">Комментарий:</span> {{ sms.comment }}<br>
            </div>
          </el-scrollbar>

        </el-tab-pane>
        <el-tab-pane label="История">

          <el-timeline>
            <el-timeline-item

                v-for="(hist, index) in histories"
                :key="index"
                :hollow="true"
                :timestamp="hist.createDate"
            >
              {{ hist.action }}: <b>{{ hist.comment }}</b> <span style="float: right">{{ hist.userTitle }}</span>
            </el-timeline-item>
          </el-timeline>

        </el-tab-pane>
        <el-tab-pane label="Комментарии">
          Комментарии
        </el-tab-pane>
      </el-tabs>


      <span class="modal-fields">
        <span>

      <br>
      </span>

      <div style="text-align: right">
        <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
        <el-button type="info" @click="isOpen = false">Отменить</el-button>
      </div>
      </span>
    </el-scrollbar>
  </AppModal>
</template>

<style>
.carusel {
  padding: 0 30px;
  display: flex;
  flex-wrap: wrap;
}

@media (width < 500px) {
  .carusel {
    padding: 0 12px;
  }

  .carusel textarea {
    width: 280px;
  }
}

.carusel-left, .carusel-right {
  width: 49%;
  min-width: 300px;
}

.carusel-blocks {
  background: white;
  margin: 10px;
  margin-left: -80px;
  font-size: 13px;
  line-height: 1.5;
  padding: 4px 0;
}
</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStore} from "@/stores/appealStore";
import {AppealStatusTable, Workflows} from "@/utils/globalConstants";
import {formatDMY_hm} from "@/utils/globalFunctions";
import {ElTable} from "element-plus";
import SmsSender from "@/components/appalCtrl/SmsSender.vue";

const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const isOpen = ref(false);
const appeal = ref({});
const closeModal = () => isOpen.value = false;
const subtitle = ref('')
const appealAvailableStatuses = ref([])
const events = ref([])
const activeName = ref('first')
const AppealStatusTypes = ref([])
let cb;
const histories = ref([])
const isEditManagerName = ref(false)
const responsibles = ref([])
const smsSender = ref(null)

const listSMS = ref([])


const clickDropDown = (val) => {
  appeal.value.status = val.id
  appeal.value.statusTitle = val.name
}


function workFlowType(type) {
  let el = appeal.value.workflowLeadType && Workflows.find(el => el.id === type)
  return el && el.title
}

function openCollapse(val) {
  console.log('openCollapse val', val)
}

function toGetManagers() {

  isEditManagerName.value = true

  isEditManagerName.value = true
  appealStore.getRoles(appeal.value.workflowLeadType).then(res => {
    responsibles.value = res.items;
  })
}

function toChangeManager(row) {
  let item = responsibles.value.find(el => el.id === row)
  if (item) appeal.value.managerName = item.title
  isEditManagerName.value = false
}


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;

  appealStore.getAppeal(row.id).then(res => {
    appeal.value = res
    subtitle.value = res.city + ' -- ' + res.locationName
  })

  histories.value = []
  appealStore.getHistoryAppeal(row.id, 20).then(res => histories.value = res.models)

  events.value = []
  appealStore.getEventAppeal(row.id).then(res => {
    console.log('events', res)
    events.value = res.items
  })


  AppealStatusTypes.value = []
  appealStore.getStatuses(row.id).then(res => {
    appealAvailableStatuses.value = res.items

    res.items.forEach(el => {
      let item = AppealStatusTable.find(item => item.id === el)
      item && AppealStatusTypes.value.push(item)
    })
  })

  appealStore.getSMS(row.id).then(res => {
    listSMS.value = res.items
  })


}


// function checking() {
//   if (!work.value.name) {
//     return ElMessage({message: 'Поле "Название" обязетелен для заполнения', type: "warning"});
//   }
//   if (!work.value.type) {
//     return ElMessage({message: 'Поле "Тип работы" обязетелен для заполнения', type: "warning"});
//   }
//   if (!work.value.rateHour) {
//     return ElMessage({message: 'Поле "Количество норма-часов" обязетелен для заполнения', type: "warning"});
//   }
// }
//
// function changeType() {
//   adminStore.getRepaired(work.value.type).then(res => repairElements.value = res.items);
// }

// function save() {
//   if (checking()) return false;
//
//   adminStore.saveWork(work.value).then(() => {
//     ElMessage({message: "Вид работы успешно сохранен", type: "success"});
//     isOpen.value = false;
//     cb();
//   });
// }

defineExpose({open});

</script>