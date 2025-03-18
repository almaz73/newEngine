<template>

  <AppModal v-if="isOpen"
            @closeModal="emits('closeModal')"
            :width="globalStore.isMobileView? 330: 1000"
            :title="'Переход на незавершенные обращения по телефону'"
            :subtitle="`Тел.: ${tel}`"
            draggable
            resizable>
    <el-scrollbar maxHeight="600px">
      <div v-for="appeal in listAppeals" :key="appeal.id" class="client-phone-modal">
        <button @click="emits('setFoundClient', appeal, listAppeals)"
                   title="Добавить новое обращение по этому телефону"> +</button>
          {{ appeal.leadName }} | <small>клиент</small>
        <el-table
            :data="listAppeals.filter(el=>el.leadId===appeal.leadId)"
            empty-text="Нет данных"
            @row-click="openAppeal(appeal.id)"
            :show-header="false"
            :row-class-name="tableRowClassName"
        >
          <template v-if="!globalStore.isMobileView">
            <el-table-column>
              <template #default="scope">
                <ColorButtons  @click="openAppeal(scope.row.id)" :statusTitle="scope.row.statusTitle"/>
                <br>
                {{ scope.row.sourceTitle }}
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                {{ formatDate(scope.row.createDate) }} &nbsp; №{{ scope.row.id }}<br>
                {{ scope.row.createUserName }}
              </template>
            </el-table-column>

            <el-table-column>
              <template #default="scope">
                {{ scope.row.workflowLeadTypeTitle }}<br>
                {{ scope.row.carBrandModel }}
              </template>
            </el-table-column>

            <el-table-column>
              <template #default="scope">
                {{ scope.row.locationName }}<br>
                {{ scope.row.managerName }}
              </template>
            </el-table-column>
          </template>
          <template v-if="globalStore.isMobileView">
            <el-table-column>
              <template #default="scope">
                {{ scope.row.statusTitle }}<br>
                {{ scope.row.sourceTitle }}<br>

                {{ formatDate(scope.row.createDate) }} &nbsp; №{{ scope.row.id }}<br>
                {{ scope.row.createUserName }}
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                {{ scope.row.workflowLeadTypeTitle }}<br>
                {{ scope.row.carBrandModel }}<br>
                {{ scope.row.locationName }}<br>
                {{ scope.row.managerName }}
              </template>
            </el-table-column>
          </template>
        </el-table>

      </div>
    </el-scrollbar>

  </AppModal>
</template>
<style>
.client-phone-modal {
  margin-bottom: 16px;
}

.el-table .new-row {
  --el-table-tr-bg-color: #f9f8d8;
}

.el-table .work-row {
  --el-table-tr-bg-color: #eafedf;
}

.el-table .buy-row {
  --el-table-tr-bg-color: #c5c5c5;
}
</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDate} from "@/utils/globalFunctions";
import ColorButtons from "@/controls/ColorButtons.vue";
import router from "@/router";

const globalStore = useGlobalStore()


const {listAppeals, tel, isOpen} = defineProps(['listAppeals', 'tel', 'isOpen'])
const emits = defineEmits(['closeModal', 'setFoundClient'])

function openAppeal(id) {
  router.push({path: '/appeal/' + id})
}

const tableRowClassName = ({row}) => {
  if (row.statusTitle === 'Новый') {
    return 'new-row'
  } else if (row.statusTitle === 'В работе') {
    return 'work-row'
  } else if (row.statusTitle === 'Оформление') {
    return 'buy-row'
  }
  return ''
}


</script>