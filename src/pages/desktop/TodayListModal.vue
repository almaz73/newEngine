<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 360: 930"
            :top="60"
            :title="'Список обращений по дате'"
            draggable
            resizable>
    <el-date-picker
        style="right: 100px; float: right "
        v-model="startDate"
        format="DD.MM.YYYY"
        @change="getDatas()"
        :clearable="false"
    />
    <div style="clear: both"></div>
    <el-scrollbar :maxHeight="globalStore.isMobileView?'450px':'600px'">


      <el-table
          :data="tableData"
          empty-text="Нет данных"
          @row-click="openAppeal"
          highlight-current-row
      >
        <el-table-column label="Статус">
          <template #default="scope">
            <ColorButtons :statusTitle="scope.row.statusTitle"></ColorButtons>
            <br>
            {{ scope.row.sourceTitle }}
          </template>
        </el-table-column>
        <el-table-column label="Обращение">
          <template #default="scope">
            {{ scope.row.createUserName }}<br>
            <small>
              <span style="color:#d34338">{{ scope.row.id }}</span>
              от {{ formatDateDDMMYYYY(scope.row.createDate) }}
            </small>
          </template>
        </el-table-column>
        <el-table-column label="Клиент">
          <template #default="scope">
            {{ scope.row.leadName }}<br>
            <small> {{ formattingPhone(scope.row.leadPhone) }}</small>
          </template>
        </el-table-column>
        <el-table-column label="Авто">
          <template #default="scope">
            {{ scope.row.workflowLeadTypeTitle }}<br>
            <small> {{ scope.row.carBrandModel }}</small>
          </template>
        </el-table-column>
        <el-table-column label="Ответственный">
          <template #default="scope">
            {{ scope.row.responsibleUser.fullName }}<br>
            <small style="color:#d34338">{{ scope.row.locationName }}</small>
          </template>
        </el-table-column>

      </el-table>

    </el-scrollbar>
  </AppModal>
</template>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {useGlobalStore} from "@/stores/globalStore";
import {useDesktopStore} from "@/stores/desktopStore";
import {ref} from "vue";
import {ElTable} from "element-plus";
import ColorButtons from "@/controls/ColorButtons.vue";
import {formatDateDDMMYYYY, formattingPhone} from "@/utils/globalFunctions";
import router from "@/router";

const globalStore = useGlobalStore()
const desktopStore = useDesktopStore();
const isOpen = ref(false);
const closeModal = () => isOpen.value = false;
const tableData = ref([])
const startDate = ref(new Date())


function openAppeal(row) {
  router.push({path: '/appeal/' + row.id})
}

function open() {
  isOpen.value = true;
  getDatas()
}

function getDatas() {
  globalStore.isWaiting = true
  desktopStore.getleadworkflowsbydate(formatDateDDMMYYYY(startDate.value)).then(res => {
    if (res) tableData.value = res.items
    globalStore.isWaiting = false
  })
}


defineExpose({open});


</script>