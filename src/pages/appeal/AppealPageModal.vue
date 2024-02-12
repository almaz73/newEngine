<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 680"
            :top="40"
            :title="'Обращение '+appeal.id+'. '+appeal.workflowLeadTypeTitle"
            :subtitle="subtitle"
            draggable
            resizable>
    <el-scrollbar maxHeight="480px">


      <div>Статус

        <el-select
            title="Статус"
            placeholder="Статус"
            v-model="appeal.type"
            filterable
            clearable>
          <el-option v-for="(item, ind) in statusTypes" :key="ind" :label="item"
                     :value="item"/>
        </el-select>
      </div>

      <hr>
      <div>Результаты и действия</div>

      <div>Выкупщик

        <el-select
            title="Статус"
            placeholder="Статус"
            v-model="appeal.type"
            filterable
            clearable>
          <el-option v-for="(item, ind) in statusTypes" :key="ind" :label="item"
                     :value="item"/>
        </el-select>
      </div>


      <el-tabs v-model="activeName"
               class="demo-tabs"
               @tab-click="handleClick">
        <el-tab-pane label="События" name="first">

          <div v-for="event in events" :key="event.id" style="margin: 12px 0; background: white; padding: 8px">
            {{ event.title }}

            {{ event.dateStart }} до {{ event.dateEnd }}

            {{ event.description }}

            ===
            {{ event.responsible.person.lastName }} {{ event.responsible.person.firstName }}
          </div>


        </el-tab-pane>
        <el-tab-pane label="СМС">
          смс
        </el-tab-pane>
        <el-tab-pane label="История">
          исто
        </el-tab-pane>
        <el-tab-pane label="Комментарии">
          Комментарии
        </el-tab-pane>
      </el-tabs>


      <span class="modal-fields">
        <span>

          <hr>

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

const globalStore = useGlobalStore();
const appealStore = useAppealStore()
const isOpen = ref(false);
const appeal = ref({});
const closeModal = () => isOpen.value = false;
const subtitle = ref('')
const statusTypes = [
  'Новый',
  'Обращение. В работу',
  'Передать на комиссию',
  'Передать на выкуп',
  'Передать на Трейд-ин',
  'Обращение. Отказ',
  'Обращение. Контракт',
  'Обращение. Запрос архивирования',
  'Обращение. Архивировать',
  'Обращение. Оформление',
  'Создание обращения с типом "Продажа"'
]
const events = ref([])
const activeName = ref('first')
let cb;


function handleClick() {
  console.log('handleClick')
}


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;

  appealStore.getAppeal(row.id).then(res => {
    console.log(res)
    appeal.value = res
    subtitle.value = res.city + ' -- ' + res.locationName
  })

  appealStore.getEventAppeal(row.id).then(res => {
    console.log('res', res)
    events.value = res.items
  })

  appealStore.getHistoryAppeal(row.id, 20).then(res => {
    console.log('22 res', res)
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