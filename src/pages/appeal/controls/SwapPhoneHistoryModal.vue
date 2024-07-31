<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 340: 650"
            :top="40"
            :title="'История изменений подменного телефонного номера'"
            resizable
            draggable>
    <el-table
        :data="tableData"
        empty-text="Нет данных"
        highlight-current-row
    >
      <el-table-column label="Номер" min-width="100">
        <template #default="scope">
          {{ formattingPhone(scope.row.swapPhone) }}
        </template>
      </el-table-column>
      <el-table-column label="Дата и время изменения">
        <template #default="scope">
          {{ formatDMY_hm(scope.row.changeDate) }}
        </template>
      </el-table-column>
      <el-table-column label="Пользователь" prop="responsible"/>
    </el-table>

  </AppModal>
</template>

<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import {ref} from "vue";
import {useAppealStore} from "@/stores/appealStore";
import {useGlobalStore} from "@/stores/globalStore";
import {ElTable} from "element-plus";
import {formatDMY_hm, formattingPhone} from "@/utils/globalFunctions";

const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const isOpen = ref(false);
const closeModal = () => isOpen.value = false;
const tableData = ref([])


function open(id: number) {
  isOpen.value = true;

  appealStore.getSwapPhoneHistory(id).then(res => {
    tableData.value = res.items
  })
}

defineExpose({open});


</script>