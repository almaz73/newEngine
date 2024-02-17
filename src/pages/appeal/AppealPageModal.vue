<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 1100"
            :top="40"
            :title="'Обращение '+appeal.id+'. '+appeal.workflowLeadTypeTitle"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'500px':'680px'">
      <div style="display: flex; align-items: center">
        <div style="width: 50%">
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
          <br>

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

        <div style="border-left: 5px solid #d34338; padding-left: 20px">
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
            <div class="collapse" style="">
              <div class="collapse-left">

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
              <div class="collapse-right">
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

      <AppealTabs ref="appealTabs" :carPhoto="carPhoto"/>

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

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {useAppealStore} from "@/stores/appealStore";
import {AppealStatusTable, Workflows} from "@/utils/globalConstants";
import SmsSender from "@/components/appalCtrl/SmsSender.vue";
import AppealTabs from "@/components/appalCtrl/AppealTabs.vue";
import {formatDMY_hm} from "@/utils/globalFunctions";

const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const isOpen = ref(false);
let cb;
const appeal = ref({});
const subtitle = ref('')
const appealAvailableStatuses = ref([])
const AppealStatusTypes = ref([])
const isEditManagerName = ref(false)
const responsibles = ref([])
const smsSender = ref(null)
const carPhoto = ref(null)
const appealTabs = ref(null)
const lastTaskAndResult = ref('')
const prevTask = ref('')
const events = ref([])

const closeModal = () => isOpen.value = false;
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
  carPhoto.value = row.smallPhoto[0]

  cb = cbModal;
  isOpen.value = true;

  appealStore.getAppeal(row.id).then(res => {
    appeal.value = res
    subtitle.value = res.city + ' -- ' + res.locationName
    getEvents()
    appealTabs.value.open(res)
  })


  AppealStatusTypes.value = []
  appealStore.getStatuses(row.id).then(res => {
    appealAvailableStatuses.value = res.items

    res.items.forEach(el => {
      let item = AppealStatusTable.find(item => item.id === el)
      item && AppealStatusTypes.value.push(item)
    })
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