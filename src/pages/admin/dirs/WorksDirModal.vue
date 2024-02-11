<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 330: 480"
            :top="40"
            :title="'Вид работ'"
            draggable
            resizable>
    <el-scrollbar maxHeight="480px">

      <span class="modal-fields">
        <span>
          <el-input placeholder="Название *" title="Название" v-model="work.name"/>

          <el-select
              title="Тип работы"
              placeholder="Тип работы"
              v-model="work.type"
              @change="changeType()"
              filterable
              clearable>
              <el-option v-for="item in WorkType" :key="item.id" :label="item.name"
                         :value="item.id"/>
           </el-select>

          <el-input
              placeholder="Количество норма часов"
              title="Количество норма часов"
              v-model="work.rateHour"
              clearable>
          </el-input>

          <el-select
              title="Ремонтируемый элемент"
              placeholder="Ремонтируемый элемент"
              v-model="work.repairedElementsIds"
              filterable
              multiple
              clearable>
              <el-option v-for="item in repairElements" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
          <hr>

        </span>
      <div style="text-align: right">
        <el-button type="danger" @click="save()" :icon="Plus">Сохранить</el-button>
        <el-button type="info" @click="isOpen = false">Отменить</el-button>
      </div>
      </span>
    </el-scrollbar>
  </AppModal>
  <UsersDirModal_History ref="modalHistory"/>
</template>
<style>


</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useAdminStore} from "@/stores/adminStore";
import {ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import UsersDirModal_History from "@/pages/admin/dirs/UsersDirModal_History.vue";
import {WorkType} from "@/utils/globalConstants";

const globalStore = useGlobalStore();
const isOpen = ref(false);
const work = ref({});
const closeModal = () => isOpen.value = false;

const modalHistory = ref(null);
const adminStore = useAdminStore();
let cb;
const repairElements = ref([])


function open(row, cbModal) {
  cb = cbModal;
  isOpen.value = true;
  if (!row) work.value = {type: 10};
  else adminStore.getWork(row.id).then(res => work.value = res);
  changeType()
}


function checking() {
  if (!work.value.name) {
    return ElMessage({message: 'Поле "Название" обязетелен для заполнения', type: "warning"});
  }
  if (!work.value.type) {
    return ElMessage({message: 'Поле "Тип работы" обязетелен для заполнения', type: "warning"});
  }
  if (!work.value.rateHour) {
    return ElMessage({message: 'Поле "Количество норма-часов" обязетелен для заполнения', type: "warning"});
  }
}

function changeType() {
  adminStore.getRepaired(work.value.type).then(res => repairElements.value = res.items);
}

function save() {
  if (checking()) return false;

  adminStore.saveWork(work.value).then(() => {
    ElMessage({message: "Вид работы успешно сохранен", type: "success"});
    isOpen.value = false;
    cb();
  });
}

defineExpose({open});

</script>