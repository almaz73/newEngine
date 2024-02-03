<template>

  <AppModal v-if="isOpen"
            @closeModal="emits('closeModal')"
            :width="globalStore.isMobileView? 330: 1000"
            :title="`Тел.: ${tel}`"
            :subtitle="'Есть не завершенные обращения по данному номеру'"
            draggable
            resizable>
    <el-scrollbar maxHeight="400px">
      <div v-for="client in clients" :key="client.leadId" class="client-phone-modal">
        <el-button @click="emits('setFoundClient', client, listAppeals)"> +</el-button>
        {{ client.name }} | <small>клиент</small>
        <el-table
            :data="listAppeals.filter(el=>el.leadId===client.leadId)"
            empty-text="Нет данных"
            :show-header="false"
            :row-class-name="tableRowClassName"
        >
          <template v-if="!globalStore.isMobileView">
            <el-table-column>
              <template #default="scope">
                {{ scope.row.statusTitle }}<br>
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

const globalStore = useGlobalStore()


const {listAppeals, tel, isOpen, clients} = defineProps(['listAppeals', 'tel', 'isOpen', 'clients'])
const emits = defineEmits(['closeModal', 'setFoundClient'])

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