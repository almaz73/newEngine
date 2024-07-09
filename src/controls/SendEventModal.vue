<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 350: 600"
            :top="73"
            :title="'Создать событие: '+title"
            draggable>
    <small>
      <label class="label-right l_150">Результат встречи:</label>
      <el-select
          style="width: 210px"
          placeholder="Выберите значение"
          v-model="event.closeType">
        <el-option v-for="item in closeEnums" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </small>

    <div style="text-align: center; margin: 12px">
      <el-button type="success" style="padding: 22px 12px; border: none"
                 :style="{background: model.id===event.type?'#999999 !important':''}"
                 v-for="(model, ind) in EventTypes" :key="ind" :title="'Тип вызова: '+ model.value">
        <img :src="'/v2/src/assets/icons/'+eventTypeButtonClass(model)" alt=""
             @click="changeEventType(model.id)"/>
      </el-button>
    </div>


    <small>

      <label class="label-right l_150">Ответственный:</label>
      {{ event.userResponsibleTitle }}
    </small><br>

    <small>
      <label class="label-right l_150">Описание:</label>
      <el-input type="textarea" name="description" v-model="event.description"
                :style="{width:globalStore.isMobileView?'213px':'395px'}"
                rows="2"
      ></el-input>
    </small><br>

    <small>
      <label class="label-right l_150">Дата:</label>

      <el-button @click="openHourly()">{{ eventTime ? formatDMY_hm(eventTime) : 'Календарь' }}</el-button>

      <div>
        <label style="cursor: pointer" @click="checkResponsible()">
          <el-checkbox :checked="responsible"/>&nbsp; Поставить себя ответственным на событие
        </label>
      </div>
    </small>
    <div style="text-align: right">
      <el-button type="danger" @click="save()" :disabled="!isReady" :icon="Plus">Добавить</el-button>
      <el-button type="info" @click="isOpen = false">Отмена</el-button>
    </div>
  </AppModal>
  <HourlyCalendarModal ref="hourlyModal"/>
</template>

<style>

</style>

<script setup>
/*
*
            $scope.newEvent.managerId = $scope.currentUser.id;
            $scope.newEvent.appealId = event.entityId;
            $scope.newEvent.lastTaskId = event.id;
            $scope.newEvent.lastTaskType = event.type;
            $scope.newEvent.appealType = event.entityType;
* */



import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {computed, ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {Plus} from "@element-plus/icons-vue";
import {formatDateDDMMYYYY, formatDMY_hm} from "@/utils/globalFunctions";
import {ElMessage} from "element-plus";
import {EventType} from "@/utils/globalConstants";
import HourlyCalendarModal from "@/pages/appeal/controls/HourlyCalendarModal.vue";

const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const isOpen = ref(false);
const entity = ref({});
const closeModal = () => isOpen.value = false;
let cb;
const responsible = ref(false)
const closeEnums = ref([])
const commentLabel = ref(null)
const EventTypes = ref([]); // кнокп с рисунками
const eventselectedDateTime = ref(null)
const hourlyModal = ref(null)
const eventTime = ref(null)
const isReady = ref(false)

const title = computed(() => {
  let elem = event.value.type && EventTypes.value.find(el => el.id === event.value.type)
  return elem ? elem.value : ''
})

const event = ref({
  closeType: null,
  userResponsibleTitle: '',
  type: '',
  userResponsibleId: ''
})
const lastTaskType = ref(null)
const account = globalStore.account

const EventClosePhoneEnums = [
  {id: 10, name: 'Не доступен'},
  {id: 11, name: 'Не берет трубку'},
  {id: 12, name: 'Звонок завершен'},
]
const EventCloseConfirmationMeetingEnums = [
  {id: 20, name: 'Подтверждено'},
  {id: 21, name: 'Перенесено'},
  {id: 22, name: 'Отклонено'},
]
const MeetingConfirmEnums = [
  {id: 30, name: 'Встреча состоялась'},
  {id: 31, name: 'Встреча перенесена'}
]

const DefaultEvents = [
  {id: 1, value: 'Звонок'},
  {id: 141, value: 'Видеозвонок'},
  {id: 2, value: 'Встреча'},
  {id: 142, value: 'Франшиза. Сделка'},
]
const BuyerEvents = [
  {id: 1, value: 'Звонок'},
  {id: 2, value: 'Встреча'},
  {id: 8, value: 'Осмотр'},
  {id: 5, value: 'Оформление'},
]
const SalesEvents = [
  {id: 1, value: 'Звонок'},
  {id: 2, value: 'Встреча'},
  //{id: 4, value: 'Тест драйв'},
  {id: 120, value: 'Предоплата'},
  {id: 90, value: 'Оформление'},
]
const HostessEvents = [
  {id: 1, value: 'Звонок'},
  {id: 2, value: 'Встреча'},
  {id: 4, value: 'Тест драйв'},
  {id: 120, value: 'Предоплата'},
  {id: 90, value: 'Оформление'},
]

const CallCenterEventsConfirm = [
  {id: 1, value: 'Звонок'},
  {id: 130, value: 'Подтверждение встречи'},
]
const CallCenterEventsMeet = [
  {id: 1, value: 'Звонок'},
  {id: 2, value: 'Встреча'},
]


function getSelects(lastTaskType) {

  console.log('lastTaskTyp = ',lastTaskType)

  switch (lastTaskType) {
      // звонок
    case 1:
      closeEnums.value = EventClosePhoneEnums;
      commentLabel.value = 'Результат звонка';
      break;
      // звонок вежливости
    case 145:
      closeEnums.value = EventClosePhoneEnums;
      commentLabel.value = 'Результат звонка';
      break;
      // подтверждение встречи
    case 130:
      closeEnums.value = EventCloseConfirmationMeetingEnums;
      commentLabel.value = 'Результат подтверждения встречи';
      break;
      // встреча
    case 2:
      closeEnums.value = MeetingConfirmEnums;
      commentLabel.value = 'Результат встречи';
      break;
    default:
      commentLabel.value = 'Результат события';
      break;
  }


  switch (account.role) {
    case 'BuyerEmployee':
      EventTypes.value = BuyerEvents;
      break;
    case 'BuyerManager':
      EventTypes.value = BuyerEvents;
      break;
    case 'SalesEmployee':
      EventTypes.value = SalesEvents;
      break;
    case 'SalesManager':
      EventTypes.value = SalesEvents;
      break;
    case 'CallEmployee':
      EventTypes.value = CallCenterEventsConfirm;
      break;
    case 'CallManager':
      EventTypes.value = CallCenterEventsConfirm;
      break;
    case 'LocalCallEmployee':
      EventTypes.value = CallCenterEventsConfirm;
      break;
    case 'LocalCallManager':
      EventTypes.value = CallCenterEventsConfirm;
      break;
    case 'Hostess':
      EventTypes.value = HostessEvents;
      break;
    case 'SimpleEmployee':
      EventTypes.value = DefaultEvents;
      break;
    default:
      EventTypes.value = DefaultEvents;
      break;
  }

}

function openHourly() {
  if (!title.value) return ElMessage.info('Выберите тип вызова')
  hourlyModal.value.open(event.value, backFromHourly)
}

function backFromHourly(time) {
  eventTime.value = time
  let dateStart = time
  let dateEnd = new Date(time)
  dateEnd.setMinutes(new Date(time).getMinutes() + 15)


  event.value.dateStart = formatDateDDMMYYYY(dateStart)//  dateStart.format('DD.MM.YYYY');
  event.value.timeStart = dateStart.toLocaleTimeString()// dateStart.format('HH:mm');
  event.value.dateEnd = formatDateDDMMYYYY(dateEnd)//  dateStart.format('DD.MM.YYYY');
  event.value.timeEnd = dateEnd.toLocaleTimeString()// dateStart.format('HH:mm');
  isReady.value = true
}


function changeEventType(key) {
  eventselectedDateTime.value = null;
  event.value.type = parseInt(key);
  EventCloseTypeChange();
}

function checkDate() {
  // if (eventselectedDateTime.value < new Date())
  //   return ElMessage({message: 'Выбранная дата меньше текущей', type: 'warning'})
}

function EventCloseTypeChange() {
  if (
      account.role === 'CallManager' ||
      account.role === 'CallEmployee' ||
      account.role === 'LocalCallManager' ||
      account.role === 'LocalCallEmployee'
  ) {
    if ((event.value.closeType === 10 || event.value.closeType === 11) && event.value.type === 1) {
      var currentDate = new Date();
      var timeDay = new Date(new Date(new Date().setHours(14)).setMinutes(30));
      var dateStart = null;

      if (currentDate < timeDay) {
        dateStart = new Date((new Date().setHours(new Date().getHours() + 3)));
      } else if (currentDate > timeDay) {
        dateStart = new Date(new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(10),).setMinutes(0))

        if (dateStart.getDay() === 6 || dateStart.getDay() === 0) {
          dateStart = new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() + 2));
        }
      }

      event.value.dateStart = formatDateDDMMYYYY(dateStart)
      event.value.timeStart = dateStart && dateStart.toLocaleTimeString()
      event.value.dateEnd = formatDateDDMMYYYY(dateStart)
      event.value.timeEnd = dateStart && dateStart.toLocaleTimeString()

      isReady.value = true

      eventselectedDateTime.value = event.value.dateStart + ' ' + event.value.timeStart;
    } else {
      eventselectedDateTime.value = null;
    }

    // зачем?
    if (event.value.closeType === 20) {
      EventTypes.value = CallCenterEventsMeet;
    } else {
      // зачем?
      // EventTypes.value = CallCenterEventsConfirm;
    }
  } else {
    dateStart = new Date()
    event.value.dateStart = formatDateDDMMYYYY(dateStart)//  dateStart.format('DD.MM.YYYY');
    event.value.timeStart = dateStart.toLocaleTimeString()// dateStart.format('HH:mm');
    event.value.dateEnd = formatDateDDMMYYYY(dateStart)//  dateStart.format('DD.MM.YYYY');
    event.value.timeEnd = dateStart.toLocaleTimeString()// dateStart.format('HH:mm');
  }
}

function eventTypeButtonClass(button) {
  let url = ''
  switch (button.id) {
    case 1:
      url = 'eventCallWhite.png'
      break;
    case 2:
      url = 'eventMeetingWhite.png'
      break;
    case 5:
      url = 'eventFormalizationWhite.png'
      break;
    case 8:
      url = 'eventInspectionWhite.png'
      break;
    case 120:
      url = 'eventAdvancePaymentWhite.png'
      break;
    case 4:
      url = 'eventTestDriveWhite.png'
      break;
    case 90:
      url = 'eventFormalizationWhite.png'
      break;
    case 130:
      url = 'eventConfirmationMeetingWhite.png'
      break;
    case 141:
      url = 'eventVideoCall.png'
      break;
    case 142:
      url = 'eventFranchiseDeal.png'
      break;
  }
  return url
}

function checkResponsible() {
  responsible.value = !responsible.value;
  event.value.userResponsibleId = responsible.value ? account.id : entity.value.managerId;
}

/**
 *
 * @param row
 * @param cbModal - метод, где что делать после закрытия модалки
 * @param lastTaskType - type послежднего события
 */
function open(row, cbModal) {

  console.log('row = ',row)
  cb = cbModal
  entity.value = row
  isOpen.value = true

  console.log('entity.valu = ',entity.value)

  if(entity.value.managerName){
    event.value.userResponsibleTitle = entity.value.managerName
    event.value.userResponsibleId = entity.value.managerId
  }

  getSelects(entity.value.type)
}

function getDateTime(myDate, time) {
  var splitDate = myDate.split('.');
  var splitTime = time.split(':');
  var date = new Date(
      Date.UTC(
          splitDate[2],
          parseInt(splitDate[1]) - 1,
          splitDate[0],
          splitTime[0],
          splitTime[1],
      ),
  );

  var minutes = date.getMinutes();
  var month = date.getMonth() + 1;
  var dateOfmonth = date.getUTCDate();

  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (dateOfmonth < 10) {
    dateOfmonth = '0' + dateOfmonth;
  }

  return (
      date.getFullYear() +
      '.' +
      month +
      '.' +
      dateOfmonth +
      ' ' +
      date.getUTCHours() +
      ':' +
      minutes
  );
}

function save() {
  if (checkDate()) return false

  event.value.status = 10;

  var dateTimeStart = getDateTime(event.value.dateStart, event.value.timeStart);
  var dateTimeEnd = getDateTime(event.value.dateEnd, event.value.timeEnd);

  var newEvent = {
    // id: event.value.id,
    title: EventType[event.value.type],
    type: event.value.type,
    status: event.value.status,
    userResponsibleId: event.value.userResponsibleId,
    dateStart: dateTimeStart,  // тут нужно разбираться todo
    dateEnd: dateTimeEnd,  // тут нужно разбираться todo
    // dealId: event.value.dealId,
    // deleted: event.value.deleted,
    description: event.value.description,
    // created: event.value.created,
    entityId: entity.value.id,
    entityType: 20, // тут нужно разбираться todo
    // typeEntityId: event.value.typeEntityId,
  };
  appealStore.saveEvent(newEvent).then(() => {
    isOpen.value = false
    cb('noCach')

  })
}

defineExpose({open});

</script>