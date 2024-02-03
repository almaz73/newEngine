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
        <el-button> +</el-button>
        {{ client.name }} | клиент
        <el-table
            :data="listAppeals.filter(el=>el.leadId==client.leadId)"
            empty-text="Нет данных"
            :show-header="false"
            highlight-current-row
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
          <el-table-column >
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
</style>

<script setup>
import AppModal from "@/components/AppModal.vue";
import {ElTable} from "element-plus";
import {useGlobalStore} from "@/stores/globalStore";
import {formatDate} from "../../utils/globalFunctions";

const globalStore = useGlobalStore()


const {listAppeals, tel, isOpen, clients} = defineProps(['listAppeals', 'tel', 'isOpen', 'clients'])
const emits = defineEmits(['closeModal'])


</script>