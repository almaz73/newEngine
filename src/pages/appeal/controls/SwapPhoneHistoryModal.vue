<template>
  <AppModal v-if="isOpen"
            @closeModal="closeModal()"
            :width="globalStore.isMobileView? 340: 730"
            :top="40"
            :title="title"
            resizable
            draggable>
    <el-table
        :data="tableData"
        empty-text="Нет данных"
        highlight-current-row
        style="max-height: 600px"
    >
      <el-table-column label="Значение">
        <template #default="scope">
          {{scope.row.phone}}
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
import {formatDMY_hm} from "@/utils/globalFunctions";
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()
const globalStore = useGlobalStore()
const appealStore = useAppealStore()
const isOpen = ref(false);
const closeModal = () => isOpen.value = false;
const tableData = ref([])
const title = ref('История изменений подменного телефона')

function summHistoryGeneralPhone(phone: string, changeDate: string, responsible: string) {
  tableData.value.push({phone, changeDate, responsible})
  globalStore.isWaiting = false
}


function summTime(data: any) {
  data.forEach((el:any) =>
      el.differences.forEach((item:any) => {
        if (item.field === 'Phone') summHistoryGeneralPhone(
            item.newValue,
            el.createDate,
            el.user.person.lastName + ' ' + el.user.person.firstName)
      })
  )
  return false
}

function summClientValues(data: any) {
  data.forEach((el:any) =>
      el.differences.forEach((item:any) => {
        if (!item.description.includes('Источник')
            && item.field == 'MiddleName' || item.field == 'LastName' || item.field == 'FirstName')
          summHistoryGeneralPhone(
              item.description + ' ➢ ' + item.newValue,
              el.createDate,
              el.user.person.lastName + ' ' + el.user.person.firstName
          )
      })
  )
}


function open(typeHistory: string, appealId: number, clientId: number) {
  title.value = 'История изменений подменного телефона ☎'
  if (typeHistory === 'client') title.value = 'История изменений ФИО клиента'
  if (typeHistory === 'phone') title.value = 'История изменений основного телефона ☎'

  tableData.value = []
  isOpen.value = true;
  globalStore.isWaiting = true

  if (typeHistory === 'swapPhone') {
    appealStore.getSwapPhoneHistory(appealId).then(res => {
      tableData.value = res.items
      tableData.value.map((el:any)=>el.phone=el.swapPhone)
      globalStore.isWaiting = false
    })
  } else{
    adminStore.getClientHistory(clientId).then(res=>{
      if (typeHistory === 'phone') return summTime(res.data)
      else summClientValues(res.data)
    })
    adminStore.getLeadHistory(clientId).then(res=>{
      if (typeHistory === 'phone') return summTime(res.data)
      else summClientValues(res.data)
    })

  }


}

defineExpose({open});


</script>