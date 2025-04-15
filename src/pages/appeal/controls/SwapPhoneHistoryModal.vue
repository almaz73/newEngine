<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 340: 900"
            :top="40"
            :title="'История изменений подменного телефонного номера'"
            resizable
            draggable>
    <el-table
        :data="tableData"
        empty-text="Нет данных"
        highlight-current-row
        style="height: 600px"
    >
      <el-table-column label="Значение">
        <template #default="scope">
          {{ formattingPhone(scope.row.swapPhone || scope.row.phone) }}
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
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const isOpen = ref(false);
const closeModal = () => isOpen.value = false;
const tableData = ref([])



function open(typeHistory: string, appealId: number, clientId: number) {
  console.log('typeHistory = ',typeHistory)
  console.log('appealId = ',appealId)
  console.log('ClientId = ',clientId)
  // todo
  isOpen.value = true;

  function summHistoryGeneralPhone(phone:string, changeDate:string, responsible:string) {
    tableData.value.push({phone, changeDate, responsible})
  }


  function summTime(data:any) {
    data.forEach((el:any) =>
      el.differences.forEach((item:any) => {
        if (item.field === 'Phone') summHistoryGeneralPhone(
          item.newValue,
          el.createDate,
          el.user.person.lastName + ' ' + el.user.person.firstName + ' ' + el.user.person.middleName)
      })
    )
    return false
  }

  function summClientValues(data:any) {
    data.forEach((el:any) =>
      el.differences.forEach((item:any) => {
        if (!item.description.includes('Источник') && item.field !== 'Phone') summHistoryGeneralPhone(
          item.description + ' ➢ ' + item.newValue,
          el.createDate,
          el.user.person.lastName + ' ' + el.user.person.firstName)
      })
    )
  }

  if (typeHistory === 'swapPhone') {
    globalStore.isWaiting = true
    appealStore.getSwapPhoneHistory(appealId).then(res => {
      tableData.value = res.items

      console.log(' tableData.value = ', tableData.value)

      globalStore.isWaiting = false
    })
  } else{
    globalStore.isWaiting = true
    adminStore.getClientHistory(clientId).then(res=>{
      if (typeHistory === 'phone') return summTime(res.data)
      else summClientValues(res.data)
      globalStore.isWaiting = false
    })
    adminStore.getLeadHistory(clientId).then(res=>{
      if (typeHistory === 'phone') return summTime(res.data)
      else summClientValues(res.data)
      globalStore.isWaiting = false
    })

  }


}

defineExpose({open});


</script>